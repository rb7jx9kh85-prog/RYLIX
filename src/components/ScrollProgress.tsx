import { motion, useScroll, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/motion'

/**
 * Filet d'avancement en haut de page — un seul pixel, couleur accent.
 * Donne un repère de position sans ajouter d'élément d'interface.
 */
export function ScrollProgress() {
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.25 })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent/70"
    />
  )
}
