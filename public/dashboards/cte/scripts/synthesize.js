// Synthesize a demo dataset by mutating a de-identified CTE source export.
//
// Reads real_data.js (already de-identified — no names/IDs map to real students),
// then perturbs the aggregate distributions so dashboard numbers look plausible
// but do NOT reflect any real district's outcomes. School codes are remapped
// to cardinal directions (N/E/S/W) so the dataset is fully de-attributed.
// Output overwrites real_data.js.
//
// Run: node scripts/synthesize.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_PATH = path.join(__dirname, '..', 'real_data.js');
const SEED = 0x5eed42;  // deterministic — same input + seed = same output

// Mulberry32 PRNG (seeded)
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const chance = (p) => rand() < p;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// 1. Load — rewrite `const ` to `globalThis.` so vars escape to a sandbox
const rawCode = fs.readFileSync(DATA_PATH, 'utf8');
const code = rawCode.replace(/^const\s+([A-Z_]+)\s*=\s*/gm, 'globalThis.$1 = ');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const ALL_STUDENTS = sandbox.ALL_STUDENTS;
const PATHWAY_RECORDS = sandbox.PATHWAY_RECORDS;
const SCHOOL_TOTALS = sandbox.SCHOOL_TOTALS;
const CTE_PATHWAY_DEFS = sandbox.CTE_PATHWAY_DEFS;
const GRADE_BY_PATHWAY = sandbox.GRADE_BY_PATHWAY;
const PROGRAM_DATA = sandbox.PROGRAM_DATA;

console.log(`Loaded:
  ALL_STUDENTS:    ${ALL_STUDENTS.length}
  PATHWAY_RECORDS: ${PATHWAY_RECORDS.length}
  GRADE_BY_PATHWAY: ${GRADE_BY_PATHWAY.length}
  PROGRAM_DATA:    ${Object.keys(PROGRAM_DATA).length}`);

// 2. Mutate ALL_STUDENTS — reassign ~3% to a different school, then remap codes
const OLD_SCHOOLS = ['CH', 'OV', 'RV', 'VV'];
const SCHOOL_REMAP = { CH: 'N', OV: 'E', RV: 'S', VV: 'W' }; // de-identify
const SCHOOLS = ['N', 'E', 'S', 'W'];
let reassigned = 0;
// First remap original codes to de-identified codes
ALL_STUDENTS.forEach(s => {
  s.school = SCHOOL_REMAP[s.school] || s.school;
});
ALL_STUDENTS.forEach(s => {
  if (chance(0.03)) {
    const others = SCHOOLS.filter(x => x !== s.school);
    s.school = pick(others);
    reassigned++;
  }
});

// 3. Mutate PATHWAY_RECORDS
//    - Drop ~7% of records
//    - Flip ~5% of completer flags
//    - Shift ~10% of academic_year by ±1
//    - Realign each record's school to its student's (current) school
const studentSchool = Object.fromEntries(ALL_STUDENTS.map(s => [s.student_id, s.school]));
let dropped = 0, flipped = 0, yearShifted = 0;
const newRecords = [];
PATHWAY_RECORDS.forEach(r => {
  if (chance(0.07)) { dropped++; return; }
  const next = { ...r };
  // remap any original school code to the de-identified code, then realign to student
  if (next.school && SCHOOL_REMAP[next.school]) next.school = SCHOOL_REMAP[next.school];
  if (studentSchool[next.student_id]) next.school = studentSchool[next.student_id];
  // flip completer
  if (chance(0.05)) {
    next.completer = next.completer === 'Yes' ? '' : 'Yes';
    flipped++;
  }
  // shift year
  if (next.academic_year && chance(0.10)) {
    const m = next.academic_year.match(/^(\d{4})-(\d{4})$/);
    if (m) {
      const shift = chance(0.5) ? -1 : 1;
      const a = parseInt(m[1]) + shift;
      const b = parseInt(m[2]) + shift;
      next.academic_year = `${a}-${b}`;
      yearShifted++;
    }
  }
  newRecords.push(next);
});

// 4a. Remap GRADE_BY_PATHWAY school codes
GRADE_BY_PATHWAY.forEach(g => { if (g.school && SCHOOL_REMAP[g.school]) g.school = SCHOOL_REMAP[g.school]; });

// 4b. Remap CTE_PATHWAY_DEFS schools keys
Object.values(CTE_PATHWAY_DEFS).forEach(def => {
  if (!def.schools) return;
  const remapped = {};
  for (const [code, courses] of Object.entries(def.schools)) {
    remapped[SCHOOL_REMAP[code] || code] = courses;
  }
  def.schools = remapped;
});

// 4. Mutate GRADE_BY_PATHWAY — perturb each row's dCount/fCount by ±20%
function perturb(n, pct = 0.20) {
  if (!n) return n;
  const noise = (rand() * 2 - 1) * pct;
  return Math.max(0, Math.round(n * (1 + noise)));
}
const newGrades = GRADE_BY_PATHWAY.map(g => ({
  ...g,
  total: perturb(g.total, 0.10),
  aCount: perturb(g.aCount, 0.15),
  bCount: perturb(g.bCount, 0.15),
  cCount: perturb(g.cCount, 0.20),
  dCount: perturb(g.dCount, 0.25),
  fCount: perturb(g.fCount, 0.30)
}));

// 5. Mutate PROGRAM_DATA — toggle ~3% of each flag
let progToggled = 0;
const newProgram = {};
Object.entries(PROGRAM_DATA).forEach(([id, p]) => {
  const next = { ...p };
  if (chance(0.03)) { next.el = !next.el; progToggled++; }
  if (chance(0.03)) { next.sped = !next.sped; progToggled++; }
  // AVID: shift years by ±1 with 5% chance
  if (next.avid > 0 && chance(0.05)) {
    next.avid = Math.max(0, Math.min(4, next.avid + (chance(0.5) ? -1 : 1)));
    progToggled++;
  }
  newProgram[id] = next;
});

// 6. Recompute SCHOOL_TOTALS from the mutated records (these are derived stats)
const newTotals = {};
SCHOOLS.forEach(s => {
  const enrolled = ALL_STUDENTS.filter(st => st.school === s);
  const studentMap = {};
  newRecords.forEach(r => {
    if (r.school !== s) return;
    if (!studentMap[r.student_id]) studentMap[r.student_id] = { participant: false, completer: false };
    if (r.pathway && r.pathway.trim()) studentMap[r.student_id].participant = true;
    if (r.completer === 'Yes') studentMap[r.student_id].completer = true;
  });
  const participants = Object.values(studentMap).filter(x => x.participant).length;
  const completers = Object.values(studentMap).filter(x => x.completer).length;
  newTotals[s] = { total: enrolled.length, participants, completers };
});

// 7. Serialize
function serializeStudents(arr) {
  return '[\n' + arr.map(s =>
    `  {student_id:"${s.student_id}",school:"${s.school}"}`
  ).join(',\n') + '\n]';
}
function serializeRecord(r) {
  const parts = [];
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === 'string') parts.push(`${k}:${JSON.stringify(v)}`);
    else if (typeof v === 'boolean') parts.push(`${k}:${v}`);
    else if (typeof v === 'number') parts.push(`${k}:${v}`);
    else if (v == null) parts.push(`${k}:null`);
    else parts.push(`${k}:${JSON.stringify(v)}`);
  }
  return `{${parts.join(',')}}`;
}
function serializeRecords(arr) {
  return '[\n' + arr.map(r => '  ' + serializeRecord(r)).join(',\n') + '\n]';
}
function serializeGrades(arr) {
  return '[\n' + arr.map(g => '  ' + serializeRecord(g)).join(',\n') + '\n]';
}

const banner = `// SYNTHETIC DEMO DATA — do not interpret as any real district's outcomes.
//
// Derived from a de-identified CTE source export, then perturbed:
//   - school codes remapped to cardinal directions (N / E / S / W)
//   - ~3% of students reassigned to a different school
//   - ~7% of pathway records dropped
//   - ~5% of completer flags flipped
//   - ~10% of academic years shifted by ±1
//   - D/F counts perturbed by ±20-30%
//   - AVID/EL/SpEd flags toggled at ~3-5%
//
// Schema preserves the dashboard contract; aggregate numbers are demo-only.
// Generated by scripts/synthesize.js (seed=${SEED}).
//
`;

const out =
  banner +
  `const ALL_STUDENTS = ${serializeStudents(ALL_STUDENTS)};\n\n` +
  `const PATHWAY_RECORDS = ${serializeRecords(newRecords)};\n\n` +
  `const SCHOOL_TOTALS = ${JSON.stringify(newTotals)};\n\n` +
  `const CTE_PATHWAY_DEFS = ${JSON.stringify(CTE_PATHWAY_DEFS)};\n\n` +
  `const GRADE_BY_PATHWAY = ${serializeGrades(newGrades)};\n\n` +
  `const PROGRAM_DATA = ${JSON.stringify(newProgram)};\n`;

fs.writeFileSync(DATA_PATH, out);

console.log(`\nMutations applied:
  Students reassigned:  ${reassigned}
  Records dropped:      ${dropped}  (${PATHWAY_RECORDS.length} → ${newRecords.length})
  Completer flips:      ${flipped}
  Year shifts:          ${yearShifted}
  Program toggles:      ${progToggled}

New SCHOOL_TOTALS:`);
console.table(newTotals);

console.log(`\nWrote: ${DATA_PATH}`);
