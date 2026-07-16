/**
 * Geometry for the Karst homepage formation sequence.
 *
 * This is the proven Fieldwork body, translated to typed TypeScript. Every
 * form is index-parameterized: particle i keeps a deterministic destination
 * in every movement, so the scroll can reform one continuous body without a
 * nearest-neighbour matching pass. Transition forces are zero at the holds
 * and only shape the flight between them.
 */

export const HERO_FORMATION_COUNT = 7
export const GOLDEN_ANGLE = 2.399963229728653

const INTRO_SPAN = 0.08538
const FORMATION_SPAN = 0.907895

export interface FormationShot {
  dxR: number
  dyR: number
  scale: number
  pitch: number
  yawBias: number
  roll: number
  focalR: number
}

/** Exact shot direction proven on the Fieldwork cohort hero. */
export const HERO_FORMATION_SHOTS: readonly FormationShot[] = [
  { dxR: 0.02, dyR: -0.04, scale: 0.94, pitch: 0.16, yawBias: -0.22, roll: -0.018, focalR: 4.1 },
  { dxR: 0.04, dyR: -0.04, scale: 0.98, pitch: 0.29, yawBias: -0.34, roll: 0, focalR: 3.1 },
  { dxR: 0.07, dyR: -0.06, scale: 0.8, pitch: 0.63, yawBias: -0.58, roll: -0.055, focalR: 3.7 },
  { dxR: 0.05, dyR: -0.04, scale: 0.88, pitch: 0.55, yawBias: -1, roll: 0.025, focalR: 3.35 },
  { dxR: 0.075, dyR: -0.055, scale: 0.9, pitch: 0.4, yawBias: -1.3, roll: -0.012, focalR: 5.2 },
  { dxR: 0.06, dyR: -0.045, scale: 0.99, pitch: 0.39, yawBias: -1.7, roll: -0.018, focalR: 3.55 },
  { dxR: 0.03, dyR: -0.03, scale: 0.92, pitch: 0.47, yawBias: -2.22, roll: 0, focalR: 3.25 },
]

export interface FormationState {
  from: number
  to: number
  mix: number
  cameraMix: number
  stage: number
}

export interface HeroFormationGeometry {
  shapes: Float32Array[]
  forces: Float32Array[]
  staggers: Float32Array
}

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

/** Hold / travel / hold: 18% / 64% / 18%. Each morph now spans roughly one viewport. */
export function heldEase(value: number) {
  const x = clamp01(value)
  if (x < 0.18) return 0
  if (x > 0.82) return 1
  return smoothstep((x - 0.18) / 0.64)
}

/** The camera moves more continuously than the particle body, with short rests at each authored view. */
export function cameraEase(value: number) {
  const x = clamp01(value)
  if (x < 0.12) return 0
  if (x > 0.88) return 1
  return smoothstep((x - 0.12) / 0.76)
}

export function prand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/** The seven bodies complete by the end of the formation span so RECORD can hold. */
export function formationStateAt(progress: number, reducedMotion = false): FormationState {
  if (reducedMotion) {
    return {
      // The static assembly explains the offer without simulating an interface.
      from: 4,
      to: 4,
      mix: 0,
      cameraMix: 0,
      stage: 4,
    }
  }

  const shifted = clamp01((clamp01(progress) - INTRO_SPAN) / (1 - INTRO_SPAN))
  const normalized = clamp01(shifted / FORMATION_SPAN)
  if (normalized >= 1) {
    return {
      from: HERO_FORMATION_COUNT - 1,
      to: HERO_FORMATION_COUNT - 1,
      mix: 0,
      cameraMix: 0,
      stage: HERO_FORMATION_COUNT - 1,
    }
  }

  const segment = normalized * (HERO_FORMATION_COUNT - 1)
  const from = Math.min(HERO_FORMATION_COUNT - 2, Math.floor(segment))
  const local = segment - from
  const mix = heldEase(local)
  // The body keeps its held rhythm; the camera moves through the segment with
  // a shorter hold, so the authored angle change reads as calm travel.
  const cameraMix = cameraEase(local)
  return { from, to: from + 1, mix, cameraMix, stage: mix < 0.5 ? from : from + 1 }
}

function buildField(out: Float32Array, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const selector = prand(i * 97 + 19)
    const u = prand(i * 11 + 3) * 2 - 1
    const v = prand(i * 17 + 7) * 2 - 1
    const wave = Math.sin(u * 2.6 + prand(i * 23 + 11) * 1.2)

    if (selector < 0.56) {
      // The primary body is a broad, asymmetric atmosphere rather than a bounded blob.
      const breadth = 0.68 + 0.32 * (1 - Math.pow(Math.abs(u), 1.7))
      out[ix] = u * radius * 2.18 + wave * radius * 0.12
      out[ix + 1] = v * radius * 0.96 * breadth + wave * radius * 0.19 - u * radius * 0.08
      out[ix + 2] = (prand(i * 29 + 13) - 0.5) * radius * 1.26 + Math.cos(u * 1.8) * radius * 0.16
    } else if (selector < 0.84) {
      // Distant matter reaches beyond the viewport edges and keeps the field environmental.
      out[ix] = u * radius * 2.56 + wave * radius * 0.18
      out[ix + 1] = v * radius * 1.24 + Math.sin(u * 3.4) * radius * 0.15
      out[ix + 2] = radius * (0.58 + prand(i * 31 + 17) * 0.88)
    } else {
      // Sparse foreground particles create depth without a brighter cursor response.
      out[ix] = u * radius * 2.34 + wave * radius * 0.1
      out[ix + 1] = v * radius * 1.05 - u * radius * 0.1
      out[ix + 2] = -radius * (0.34 + prand(i * 37 + 23) * 0.72)
    }
  }
}

function buildSphere(out: Float32Array, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const y = 1 - (2 * (i + 0.5)) / count
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const angle = i * GOLDEN_ANGLE
    out[ix] = Math.cos(angle) * r * radius
    out[ix + 1] = y * radius
    out[ix + 2] = Math.sin(angle) * r * radius
  }
}

function buildLattice(out: Float32Array, count: number, radius: number) {
  const side = Math.ceil(Math.sqrt(count))
  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const gx = i % side
    const gz = Math.floor(i / side)
    out[ix] = (gx / (side - 1) - 0.5) * radius * 2.7
    out[ix + 1] = Math.sin(gx * 0.32) * Math.cos(gz * 0.27) * radius * 0.06
    out[ix + 2] = (gz / (side - 1) - 0.5) * radius * 2.7
  }
}

function buildStrata(out: Float32Array, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const layer = i % 5
    const r = radius * 1.02 * Math.sqrt(prand(i * 11 + 3))
    const angle = i * GOLDEN_ANGLE
    out[ix] = Math.cos(angle) * r
    out[ix + 1] = (layer - 2) * radius * 0.41 + Math.sin(angle * 3) * radius * 0.012
    out[ix + 2] = Math.sin(angle) * r
  }
}

/**
 * A point-only spatial frame: 300 independent rails in a 4×4×4 cube lattice,
 * plus restrained blooms at the 125 intersections. The pearls never connect;
 * subdivision and depth alone make the working system legible.
 */
function buildAssembly(out: Float32Array, count: number, radius: number) {
  const cells = 4
  const nodes = cells + 1
  const segmentsPerAxis = cells * nodes * nodes
  const segmentCount = segmentsPerAxis * 3
  const half = radius * 0.88
  const step = (half * 2) / cells
  const railCount = Math.floor(count * 0.9)

  for (let i = 0; i < count; i++) {
    const ix = i * 3

    if (i < railCount) {
      const segment = (i * 137 + 17) % segmentCount
      const axis = Math.floor(segment / segmentsPerAxis)
      const localSegment = segment % segmentsPerAxis
      const cell = localSegment % cells
      const nodeA = Math.floor(localSegment / cells) % nodes
      const nodeB = Math.floor(localSegment / (cells * nodes))
      const along = 0.08 + prand(i * 43 + 7) * 0.84
      const axialJitter = (prand(i * 47 + 11) - 0.5) * radius * 0.004
      const transverseA = (prand(i * 53 + 13) - 0.5) * radius * 0.012
      const transverseB = (prand(i * 59 + 17) - 0.5) * radius * 0.012
      const moving = -half + (cell + along) * step + axialJitter
      const fixedA = -half + nodeA * step
      const fixedB = -half + nodeB * step

      if (axis === 0) {
        out[ix] = moving
        out[ix + 1] = fixedA + transverseA
        out[ix + 2] = fixedB + transverseB
      } else if (axis === 1) {
        out[ix] = fixedA + transverseA
        out[ix + 1] = moving
        out[ix + 2] = fixedB + transverseB
      } else {
        out[ix] = fixedA + transverseA
        out[ix + 1] = fixedB + transverseB
        out[ix + 2] = moving
      }
      continue
    }

    const bloomIndex = i - railCount
    const vertex = (bloomIndex * 53 + 11) % (nodes * nodes * nodes)
    const nodeX = vertex % nodes
    const nodeY = Math.floor(vertex / nodes) % nodes
    const nodeZ = Math.floor(vertex / (nodes * nodes))
    const phi = prand(i * 61 + 19) * Math.PI * 2
    const cosTheta = prand(i * 67 + 23) * 2 - 1
    const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta))
    const bloomRadius = radius * (0.014 + prand(i * 71 + 29) * 0.008)

    out[ix] = -half + nodeX * step + Math.cos(phi) * sinTheta * bloomRadius
    out[ix + 1] = -half + nodeY * step + cosTheta * bloomRadius
    out[ix + 2] = -half + nodeZ * step + Math.sin(phi) * sinTheta * bloomRadius
  }
}

const CONSTELLATION_NODES = [
  { x: -1.02, y: -0.08, z: 0.18, r: 0.22 },
  { x: -0.79, y: 0.36, z: -0.28, r: 0.17 },
  { x: -0.56, y: -0.4, z: -0.12, r: 0.19 },
  { x: -0.31, y: 0.1, z: 0.32, r: 0.24 },
  { x: 0.02, y: -0.22, z: -0.34, r: 0.17 },
  { x: 0.16, y: 0.39, z: 0.08, r: 0.2 },
  { x: 0.46, y: 0.05, z: 0.31, r: 0.23 },
  { x: 0.69, y: -0.38, z: 0.02, r: 0.16 },
  { x: 0.83, y: 0.31, z: -0.26, r: 0.18 },
  { x: 1.05, y: -0.04, z: 0.16, r: 0.21 },
] as const

function buildConstellation(out: Float32Array, count: number, radius: number) {
  const perGlobe = Math.ceil(count / CONSTELLATION_NODES.length)
  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const globe = (i * 7 + 3) % CONSTELLATION_NODES.length
    const localIndex = Math.floor(i / CONSTELLATION_NODES.length)
    const node = CONSTELLATION_NODES[globe]
    const y = 1 - (2 * (localIndex + 0.5)) / perGlobe
    const planar = Math.sqrt(Math.max(0, 1 - y * y))
    const angle = localIndex * GOLDEN_ANGLE + globe * 0.61
    const halo = prand(i * 149 + 23) >= 0.86
    const thickness = halo
      ? 1.12 + 0.46 * Math.cbrt(prand(i * 151 + 29))
      : 0.92 + 0.08 * prand(i * 157 + 31)
    const localRadius = node.r * radius * thickness

    out[ix] = node.x * radius + Math.cos(angle) * planar * localRadius
    out[ix + 1] = node.y * radius + y * localRadius
    out[ix + 2] = node.z * radius + Math.sin(angle) * planar * localRadius
  }
}

function buildRecord(out: Float32Array, count: number, radius: number) {
  const planetCount = Math.floor(count * 0.55)
  const shepherdCount = Math.floor(count * 0.04)
  const planetRadius = radius * 0.5
  const ringInner = radius * 0.7
  const ringOuter = radius * 1.26
  const gapStart = radius * 1
  const gapEnd = radius * 1.07

  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const angle = i * GOLDEN_ANGLE
    if (i < planetCount) {
      const y = 1 - (2 * (i + 0.5)) / planetCount
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      out[ix] = Math.cos(angle) * r * planetRadius
      out[ix + 1] = y * planetRadius
      out[ix + 2] = Math.sin(angle) * r * planetRadius
    } else if (i < planetCount + shepherdCount) {
      const r = ringOuter * (1.05 + prand(i * 19 + 11) * 0.1)
      out[ix] = Math.cos(angle) * r
      out[ix + 1] = (prand(i * 23 + 13) - 0.5) * radius * 0.015
      out[ix + 2] = Math.sin(angle) * r
    } else {
      let r = ringInner + (ringOuter - ringInner) * Math.pow(prand(i * 29 + 15), 1.35)
      if (r > gapStart && r < gapEnd) {
        r = prand(i * 31 + 5) < 0.5
          ? gapStart - prand(i * 37 + 7) * radius * 0.02
          : gapEnd + prand(i * 41 + 9) * radius * 0.02
      }
      out[ix] = Math.cos(angle) * r
      out[ix + 1] = (prand(i * 43 + 17) - 0.5) * radius * 0.012
      out[ix + 2] = Math.sin(angle) * r
    }
  }
}

function buildTransitionForces(
  shapes: Float32Array[],
  staggers: Float32Array,
  count: number,
  radius: number,
) {
  const forces: Float32Array[] = []

  for (let transition = 0; transition < HERO_FORMATION_COUNT - 1; transition++) {
    const from = shapes[transition]
    const to = shapes[transition + 1]
    const force = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const mx = (from[ix] + to[ix]) * 0.5
      const my = (from[ix + 1] + to[ix + 1]) * 0.5
      const mz = (from[ix + 2] + to[ix + 2]) * 0.5
      const length = Math.sqrt(mx * mx + my * my + mz * mz) || 1
      const flat = Math.sqrt(mx * mx + mz * mz) || 1

      if (transition === 0) {
        force[ix] = (-mx / length) * radius * 0.08
        force[ix + 1] = (-my / length) * radius * 0.08
        force[ix + 2] = (-mz / length) * radius * 0.08
      } else if (transition === 1) {
        force[ix + 1] = -from[ix + 1] * 0.12
      } else if (transition === 2) {
        force[ix + 1] = ((i % 5) - 2) * radius * 0.04
      } else if (transition === 3) {
        // Strata resolves into the Frame lattice without an ornamental orbit.
        force[ix] = (to[ix] - from[ix]) * 0.012
        force[ix + 1] = (staggers[i] - 0.5) * radius * 0.012
        force[ix + 2] = (to[ix + 2] - from[ix + 2]) * 0.012
      } else if (transition === 4) {
        // The lattice releases outward by destination depth; no burst or swirl.
        const lengthTo = Math.hypot(to[ix], to[ix + 1], to[ix + 2]) || 1
        force[ix] = (to[ix] / lengthTo) * radius * 0.025
        force[ix + 1] = (to[ix + 1] / lengthTo) * radius * 0.018
        force[ix + 2] = (to[ix + 2] / lengthTo) * radius * 0.025
      } else {
        force[ix] = (-mx / flat) * radius * 0.07 - (mz / flat) * radius * 0.025
        force[ix + 1] = -from[ix + 1] * 0.08
        force[ix + 2] = (-mz / flat) * radius * 0.07 + (mx / flat) * radius * 0.025
      }
    }

    forces.push(force)
  }

  return forces
}

export function buildHeroFormationGeometry(count: number, radius: number): HeroFormationGeometry {
  const staggers = new Float32Array(count)
  for (let i = 0; i < count; i++) staggers[i] = prand(i * 23 + 9)

  const builders = [
    buildField,
    buildSphere,
    buildLattice,
    buildStrata,
    buildAssembly,
    buildConstellation,
    buildRecord,
  ]
  const shapes = builders.map((build) => {
    const shape = new Float32Array(count * 3)
    build(shape, count, radius)
    return shape
  })

  return {
    shapes,
    staggers,
    forces: buildTransitionForces(shapes, staggers, count, radius),
  }
}
