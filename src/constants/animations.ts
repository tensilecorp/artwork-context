/** Shared framer-motion animation variants used across pages */

export const EASE_GALLERY = [0.25, 0.4, 0.25, 1] as const

export const fade = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.15, ease: EASE_GALLERY },
  }),
}

export const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: EASE_GALLERY },
  }),
}

/** Slightly quicker variant used in compact views (Upload, modals) */
export const fadeQuick = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_GALLERY } },
}

export const slideUpQuick = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_GALLERY } },
}
