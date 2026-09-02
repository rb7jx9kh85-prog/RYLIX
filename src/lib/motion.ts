/**
 * Vocabulaire d'animation du site.
 *
 * Une seule courbe, trois durées. Tout passe par ici pour que les transitions
 * de page, les révélations au scroll et les survols aient exactement le même
 * comportement — l'effet doit se remarquer par sa continuité, pas par son
 * amplitude.
 */
import { useEffect, useState } from 'react'
import type { Transition, Variants } from 'framer-motion'

/** Sortie douce, sans rebond — cohérente avec le ton sobre de la DA. */
export const EASE = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  fast: 0.28,
  base: 0.6,
  slow: 0.95,
} as const

export const transition = (duration: number = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
})

/** Décalage vertical d'entrée, en pixels. */
export const RISE = 22

/**
 * Révélation d'un bloc : le contenu monte derrière un masque, il n'apparaît
 * jamais en fondu seul. `custom` porte le délai (en secondes).
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: transition(DURATION.slow, delay),
  }),
}

/** Variante pour un conteneur qui cadence ses enfants. */
export const staggerVariants = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Enfant d'un conteneur cadencé — utilisé par les titres découpés en mots. */
export const wordVariants: Variants = {
  hidden: { opacity: 0, y: '110%' },
  visible: { opacity: 1, y: '0%', transition: transition(DURATION.slow) },
}

/** Marge de déclenchement commune aux révélations au scroll. */
export const VIEWPORT = { once: true, margin: '-12% 0px -8% 0px' } as const

/**
 * Respecte prefers-reduced-motion et se met à jour si l'utilisateur change le
 * réglage système en cours de visite.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * En dessous du point de rupture `md` de Tailwind (768px). Sert à choisir une
 * mise en scène distincte sur mobile plutôt qu'à rejouer la version bureau en
 * plus petit — un geste de scroll détourné se sent juste sur trackpad, pas au
 * doigt.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 767px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return mobile
}
