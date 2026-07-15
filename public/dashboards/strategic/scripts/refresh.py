"""Pulls fresh response data from the Phase 2 Google Sheet and emits
PortraitOfAGraduate/data.json. The dashboard fetches that JSON on load
and overlays current numbers (KPIs, leaderboard, matrix, theme counts)
on top of the baked-in fallback values.

Verbatim quotes and Key Insights cards stay baked into index.html — they
are deliberately curated, not auto-generated. If patterns shift meaningfully,
the curation gets refreshed manually.

Source of truth:
  Sheet ID:  1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0
  Tab:       Responses
  Schema:    25 columns, defined in lessons.md (timestamp, respondent_id,
             role, school, ..., user_agent)

Auth:
  Service account JSON in env GOOGLE_CREDENTIALS_JSON (workflow secret)
  read-only scope on the single Sheet, no PII collected by design.

Run locally:
  GOOGLE_CREDENTIALS_JSON=$(cat ~/secret.json) \
  SHEET_ID=1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0 \
  python3 scripts/refresh.py
"""
from __future__ import annotations

import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

# --- third-party deps installed in the workflow ---
from google.oauth2.service_account import Credentials  # type: ignore
from googleapiclient.discovery import build  # type: ignore

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------
SHEET_ID = os.environ.get("SHEET_ID", "1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0")
SHEET_RANGE = os.environ.get("SHEET_RANGE", "Responses!A1:Y")
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data.json"

# Schema (must match lessons.md and the form payload). Order matters.
COLUMNS = [
    "timestamp", "respondent_id", "role", "school", "grade_or_role",
    "parent_num_students", "parent_student_grades", "leadership_years",
    "collaboration", "communication", "critical_thinking", "agency",
    "integrity", "using_ai", "ai_frequency", "ai_secondary",
    "ai_matters_most", "ai_open", "top_3", "skills_open",
    "mindsets_open", "ready_learner_can", "missing_skill", "graduate_does",
    "user_agent",
]

SKILLS = ["collaboration", "communication", "critical_thinking",
          "agency", "integrity", "using_ai"]

ROLES = ["parent", "student", "staff", "leadership"]

SCHOOL_DISPLAY = {
    "West Park High School":   "West Park",
    "Granite Bay High School": "Granite Bay",
    "Woodcreek High School":   "Woodcreek",
    "Roseville High School":   "Roseville",
    "Oakmont High School":     "Oakmont",
    "Antelope High School":    "Antelope",
    "Independence High School": "Independence",
    "Adelante High School":    "Adelante",
}

# Theme regex bundles — same as the curation pass that produced the dashboard.
# Each tuple: (theme_id, regex). A respondent matches a theme if any source
# field for that section matches.

AI_THEMES = [
    ("tool_not_crutch",
     r"\b(tool|aid|assist(?:ance|ant)?|supplement|support(?:ive|ing)?|resource|aug?ment|enhance|help(?:s|ing|er|ed)?)\b.*\b(not|never|no|n[o']t|don[ '’]?t|isn[ '’]?t|stop|instead|rather|over)\b|\b(crutch|cheat|shortcut|short[- ]cut|replace|do(es)? (the|all the|all of the|my|their) work|do(es)? it for|relian(?:t|ce)|reliance|depend(?:ent|ence|ency)?|lazy|lazi(?:ness|er)|substitute)\b"),
    ("dont_replace_thinking",
     r"\b(think(?:ing)?|critical[- ]?think|own (?:brain|mind|thought|thinking|ideas|words|head)|process|reason(?:ing)?|cognit(?:ion|ive))\b.*\b(not|never|don[ '’]?t|own|themselves?|themself)\b|\b(replace|substitute|circumvent|bypass|kill(?:s|ing|ed)?|degrad(?:e|ing|es))\b.*\b(think|brain|mind|thought|critical)\b|\b(critical (?:thinking|thought)|original (?:work|thought|ideas|thinking)|do (?:not|n[o']t) lose|don[ '’]?t lose)\b"),
    ("integrity_honesty",
     r"\b(integrity|honest(?:y|ly)?|truth(?:ful|fulness)?|transparen(?:t|cy)|cite|cit(?:e|ing|ation)|plagia|ethic(?:s|al|ally)|cheat(?:ing)?|honor)\b"),
    ("verify_accuracy",
     r"\b(fact[- ]?check|cross[- ]?(?:check|reference)|verify(?:ing)?|verification|accura(?:te|cy)|inaccura|wrong|biased?|misinform|hallucin|reliable|unreliable|trust(?:worthy)?|source(?:s|d)?)\b"),
    ("opposed_to_ai",
     r"\b(stop (?:using|promoting|teaching)|ban\s|hate (?:ai|using ai)|don[ '’]?t (?:use|like) (?:it|ai)|never use|prefer not|opposed|destroy|dislike|burning|let it burn|destroying|kill(?:ed|ing) the planet|don[ '’]?t want|never using|absurd|go back to (?:books|paper)|reduce (?:my )?use)\b"),
]

RL_THEMES = [
    ("communicate",
     r"\b(communicat(?:e|ion|or|ing|es?)|articulate|express|spe(?:ak|aks|aking)|conversation|listen(?:ing|er)?|present(?:ing|ation)?|verbal|written)\b"),
    ("real_world_life_skills",
     r"\b(financ(?:e|ial|es)|budget|money|tax(?:es)?|credit|invest(?:ing|ment)?|loan|pay (?:bills|rent|insurance)|cook|clean|laundry|drive|adult(?:ing|hood)?|real[- ]?world|life skill|household|car insur|job applicat|resume|apply (?:to|for) (?:college|jobs))\b"),
    ("confidence_voice",
     r"\b(confiden(?:t|ce|tly)|believe in (?:them|him|her)|self[- ]worth|self[- ]esteem|use (?:their|his|her) voice|speak up|stand up|lead(?:er|ership|s|ing)?|own (?:their|his|her) (?:story|voice|power))\b"),
    ("adapt_change",
     r"\b(adapt(?:ive|ability|ing|ation)?|flexib(?:le|ility)|pivot|shift|chang(?:e|ing|es)|evolv(?:e|ing)|navigate|nimble|ready for (?:any|the) (?:change|future))\b"),
    ("self_advocate_independent",
     r"\b(self[- ]advocate|advocat(?:e|ing|ed) (?:for them|for self|for him|for her)|independen(?:t|ce|tly)|on (?:their|his|her) own|take (?:ownership|charge|responsibility|initiative|control)|self[- ](?:directed|reliant|sufficient|motivated|managed|aware)|drive(?:s|n)?(?: (?:their|his|her))? own)\b"),
]

MS_THEMES = [
    ("integrity_character",
     r"\b(integrity|honest(?:y)?|character|moral(?:s|ity)?|ethic(?:s|al|ally)?|truth(?:ful)?|transparen|trust(?:worthy)?|respect(?:ful)?|values?)\b"),
    ("empathy_kindness",
     r"\b(empath(?:y|ize|etic)|compass(?:ion|ionate)|kind(?:ness)?|car(?:e|ing) for others|understand(?:ing)? others|patient|patience|respect|cultural awareness|tolerance|inclusion)\b"),
    ("resilience_growth_mindset",
     r"\b(resilien(?:t|ce|cy)|grit|persever|growth (?:mind ?set|mind|attitude)|fail(?:ure|s|ing)?|setback|don[ '’]?t (?:give up|quit)|push (?:through|past)|bounce back)\b"),
    ("financial_literacy",
     r"\b(financ(?:e|ial|es)|budget|money|tax(?:es)?|credit|invest(?:ing|ment)?|debt|saving|economic|personal financ|money manag|financial literacy|adult(?:ing)?)\b"),
    ("work_ethic_responsibility",
     r"\b(work ethic|hard[- ]?work|account(?:able|ability)|responsib(?:ility|le|ilities)|ownership|take (?:ownership|responsibility)|reliable|dependable|drive|motivat(?:ed|ion))\b"),
    ("time_management_discipline",
     r"\b(time manag|organiz(?:ed|ation|ing)|punctual|disciplin(?:e|ed)|focus(?:ed|ing)?|self[- ]disciplin|routine|consisten(?:t|cy)|planning|prioriti(?:ze|sation|zation))\b"),
    ("curiosity_lifelong_learning",
     r"\b(curio(?:us|sity)|life[- ]?long learn|love of learning|lifelong|growth mindset|always learning|keep learning|inquir(?:y|ing|e)|wonder(?:ing)?)\b"),
    ("mental_health_wellbeing",
     r"\b(mental health|self[- ]care|wellbeing|well[- ]being|self[- ]worth|self[- ]esteem|stress (?:management|manage)|anxiety|burnout|emotion(?:al|s|ally)|mindful|psycholog)\b"),
]

AI_FIELDS = ["ai_matters_most", "ai_open"]
RL_FIELDS = ["ready_learner_can", "graduate_does"]
MS_FIELDS = ["missing_skill"]


# --------------------------------------------------------------------------
# Sheet fetch
# --------------------------------------------------------------------------

def fetch_rows() -> list[list]:
    cred_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    if not cred_json:
        sys.exit("GOOGLE_CREDENTIALS_JSON env not set")
    try:
        info = json.loads(cred_json)
    except json.JSONDecodeError:
        sys.exit("GOOGLE_CREDENTIALS_JSON is not valid JSON")
    creds = Credentials.from_service_account_info(
        info,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )
    service = build("sheets", "v4", credentials=creds, cache_discovery=False)
    resp = service.spreadsheets().values().get(
        spreadsheetId=SHEET_ID,
        range=SHEET_RANGE,
        valueRenderOption="UNFORMATTED_VALUE",
        dateTimeRenderOption="FORMATTED_STRING",
    ).execute()
    return resp.get("values", [])


def normalize(rows: list[list]) -> list[dict]:
    """Skip the header row, return list of dicts keyed by COLUMNS."""
    if not rows:
        return []
    out = []
    for raw in rows[1:]:
        # Pad short rows with None so column index never errors out.
        padded = list(raw) + [None] * (len(COLUMNS) - len(raw))
        rec = dict(zip(COLUMNS, padded))
        # Coerce numeric fields
        for f in SKILLS + ["ai_frequency", "leadership_years", "parent_num_students"]:
            v = rec.get(f)
            if v in (None, ""):
                rec[f] = None
            else:
                try:
                    rec[f] = float(v)
                except (TypeError, ValueError):
                    pass  # leadership_years can be "11+" etc; leave as-is
        out.append(rec)
    return out


# --------------------------------------------------------------------------
# Computations
# --------------------------------------------------------------------------

def open_text(rec: dict, fields: list[str]) -> str:
    parts = []
    for f in fields:
        v = rec.get(f)
        if v is None:
            continue
        s = str(v).strip()
        if not s or s.lower() in ("n/a", "na", "none", "no", ".", "?", "-", "idk"):
            continue
        parts.append(s)
    return " || ".join(parts).lower()


def classify(rows: list[dict], fields: list[str], themes):
    """Return (counts, role_counts, n_with_text)."""
    counts = Counter()
    role_counts = defaultdict(Counter)
    n_with_text = 0
    for rec in rows:
        text = open_text(rec, fields)
        if not text:
            continue
        n_with_text += 1
        role = rec.get("role")
        for theme, pattern in themes:
            if re.search(pattern, text):
                counts[theme] += 1
                role_counts[theme][role] += 1
    return counts, role_counts, n_with_text


def compute(rows: list[dict]) -> dict:
    n = len(rows)
    role_counts = Counter(r.get("role") for r in rows)

    # Skill stats — overall mean + per-role mean + 1..5 distribution
    skill_overall = {}
    skill_dist = {}  # skill -> [n1, n2, n3, n4, n5]
    skill_role = {}  # skill -> {role: {n, mean}}
    for s in SKILLS:
        vals = [r[s] for r in rows if isinstance(r.get(s), (int, float))]
        skill_overall[s] = {
            "n": len(vals),
            "mean": round(sum(vals) / len(vals), 2) if vals else None,
        }
        dist = Counter(int(v) for v in vals)
        skill_dist[s] = [dist.get(i, 0) for i in (1, 2, 3, 4, 5)]
        skill_role[s] = {}
        for role in ROLES:
            rvals = [r[s] for r in rows
                     if r.get("role") == role and isinstance(r.get(s), (int, float))]
            if rvals:
                skill_role[s][role] = {
                    "n": len(rvals),
                    "mean": round(sum(rvals) / len(rvals), 2),
                }

    # Top-3 picks
    top3_overall = Counter()
    top3_by_role = defaultdict(Counter)
    for rec in rows:
        v = rec.get("top_3")
        if not v:
            continue
        for pick in str(v).split("|"):
            pick = pick.strip()
            if pick:
                top3_overall[pick] += 1
                top3_by_role[rec.get("role")][pick] += 1

    # School n + per-school skill means (only for schools with n >= 60)
    school_n = Counter(r.get("school") for r in rows if r.get("school"))
    school_means = {}
    for sch, count in school_n.items():
        if count < 60:
            continue
        school_means[sch] = {}
        for s in SKILLS:
            vals = [r[s] for r in rows
                    if r.get("school") == sch and isinstance(r.get(s), (int, float))]
            if vals:
                school_means[sch][s] = round(sum(vals) / len(vals), 2)

    # Themes
    ai_counts, ai_roles, ai_n = classify(rows, AI_FIELDS, AI_THEMES)
    rl_counts, rl_roles, rl_n = classify(rows, RL_FIELDS, RL_THEMES)
    ms_counts, ms_roles, ms_n = classify(rows, MS_FIELDS, MS_THEMES)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": {
            "sheet_id": SHEET_ID,
            "range": SHEET_RANGE,
        },
        "totals": {
            "n": n,
            "by_role": {role: role_counts.get(role, 0) for role in ROLES},
            "schools_seen": len([s for s in school_n if s and s in SCHOOL_DISPLAY]),
            "schools_total": len(SCHOOL_DISPLAY),
        },
        "skills": {
            "overall": skill_overall,
            "distribution": skill_dist,
            "by_role": skill_role,
        },
        "top3": {
            "overall": dict(top3_overall),
            "by_role": {role: dict(top3_by_role[role]) for role in ROLES},
            "total_picks": sum(top3_overall.values()),
        },
        "schools": {
            "n_by_school": dict(school_n),
            "means_qualified": school_means,
            "qualified_threshold": 60,
        },
        "themes": {
            "ai":   {"counts": dict(ai_counts), "by_role": {t: dict(c) for t, c in ai_roles.items()},  "n_with_text": ai_n},
            "rl":   {"counts": dict(rl_counts), "by_role": {t: dict(c) for t, c in rl_roles.items()},  "n_with_text": rl_n},
            "ms":   {"counts": dict(ms_counts), "by_role": {t: dict(c) for t, c in ms_roles.items()},  "n_with_text": ms_n},
        },
    }


# --------------------------------------------------------------------------
# Entry
# --------------------------------------------------------------------------

def main() -> None:
    rows_raw = fetch_rows()
    rows = normalize(rows_raw)
    if not rows:
        sys.exit("No rows returned from the Sheet — refusing to overwrite data.json")

    payload = compute(rows)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH} · n={payload['totals']['n']}")


if __name__ == "__main__":
    main()
