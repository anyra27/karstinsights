/**
 * Shared animation constants and Framer Motion variants.
 * Import from here instead of defining inline animation configs.
 */
import type { Variants, Transition } from 'framer-motion'

/* ── Easing Curves ── */

/** Standard easing — used for most transitions */
export const easeStandard = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

/** Overshoot / bounce — for celebrations, quiz feedback, playful entrances */
export const easeEntrance = [0.34, 1.56, 0.64, 1] as [number, number, number, number]

/** Material Design standard — general purpose */
export const easeMaterial = [0.4, 0, 0.2, 1] as [number, number, number, number]

/* ── Duration Tiers ── */

export const duration = {
  micro: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.7,
  ambient: 3.0,
} as const

/* ── Stagger Configs ── */

export const stagger = {
  tight: 0.05,
  normal: 0.08,
  relaxed: 0.15,
} as const

/* ── Reusable Variants ── */

/** Fade + slide up — general entrance animation */
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easeStandard },
  },
}

/** Fade + slide up with custom delay — use `custom` prop for delay value */
export const fadeSlideUpDelayed: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, delay, ease: easeStandard },
  }),
}

/** Scale + fade with custom delay */
export const scaleInDelayed: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay, ease: easeStandard },
  }),
}

/** Fade + slide up with bounce easing — playful entrances */
export const fadeSlideUpBounce: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easeEntrance },
  },
}

/** Scroll-triggered reveal */
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeStandard },
  },
}

/** Stagger container factory */
export function createStaggerContainer(
  staggerDelay: number = stagger.normal,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren },
    },
  }
}

/** Pre-built stagger containers */
export const staggerContainer: Variants = createStaggerContainer(stagger.normal)
export const staggerContainerTight: Variants = createStaggerContainer(stagger.tight)
export const staggerContainerRelaxed: Variants = createStaggerContainer(stagger.relaxed)

/** Stagger child — pairs with stagger containers */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeStandard },
  },
}

/* ── Card & Button Interactions ── */

/** Card hover — subtle elevation lift */
export const cardHover = {
  y: -3,
  boxShadow: '0px 8px 24px rgba(56, 56, 49, 0.08), 0px 24px 56px rgba(56, 56, 49, 0.06)',
  transition: { duration: duration.fast, ease: easeStandard },
}

/** Card hover transition — for use as the `transition` prop alongside whileHover */
export const cardHoverTransition: Transition = {
  duration: duration.fast,
  ease: easeStandard,
}

/** Button hover */
export const buttonHover = {
  scale: 1.015,
  transition: { duration: duration.fast, ease: easeStandard },
}

/** Button tap */
export const buttonTap = {
  scale: 0.98,
  transition: { duration: duration.micro },
}

/* ── Quiz Animations ── */

/** Quiz option tap feedback */
export const answerPop = {
  scale: 0.96,
  transition: { duration: duration.micro },
}

/** Quiz correct answer — scale pulse + warm glow */
export const answerCorrectKeyframes = {
  scale: [1, 1.02, 1],
  boxShadow: [
    '0 0 0 0 rgba(116, 97, 74, 0)',
    '0 0 20px 8px rgba(116, 97, 74, 0.2)',
    '0 0 0 0 rgba(116, 97, 74, 0)',
  ],
  transition: { duration: 0.5, ease: easeStandard },
}

/** Quiz wrong answer — horizontal shake */
export const answerWrongKeyframes = {
  x: [0, -4, 4, -4, 4, 0],
  transition: { duration: 0.4, ease: easeStandard },
}

/** Quiz feedback / explanation entrance — scale with overshoot */
export const feedbackPop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeEntrance },
  },
}

/* ── Page Transitions ── */

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.micro } },
}

/* ── Typewriter & Flow Animations ── */

/** Type reveal — width expansion for code line typing effect */
export const typeReveal: Variants = {
  hidden: { opacity: 0, width: 0 },
  visible: {
    opacity: 1,
    width: '100%',
    transition: { duration: 0.8, ease: easeStandard },
  },
}

/** Pulsing glow — looping ambient box-shadow for icons/accents */
export function pulseGlow(color = 'rgba(116, 97, 74, 0.3)') {
  const dim = color.replace(/[\d.]+\)$/, '0.12)')
  return {
    animate: {
      boxShadow: [
        `0 0 12px ${dim}`,
        `0 0 28px ${color}`,
        `0 0 12px ${dim}`,
      ],
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  }
}

/** Bounce X — subtle horizontal bounce for arrow connectors */
export const bounceX: Variants = {
  animate: {
    x: [0, 4, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

/* ── Utilities ── */

/**
 * Grid cascade delay — items animate diagonally instead of left-to-right.
 * Adapted from google-ai-pd's grid stagger formula.
 */
export function gridCascadeDelay(index: number, cols: number, baseDelay = 0.08): number {
  const row = Math.floor(index / cols)
  const col = index % cols
  return (row + col) * baseDelay
}
