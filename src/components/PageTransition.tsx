import { useRef, type ElementType, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import {
  DURATION,
  EASE,
  RISE,
  VIEWPORT,
  revealVariants,
  staggerVariants,
  transition,
  usePrefersReducedMotion,
  wordVariants,
} from '@/lib/motion'

/**
 * Entrée de page — fondu court et léger décalage vertical. Volontairement
 * discrète : c'est le contenu qui doit se remarquer, pas la transition.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : DURATION.base, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Révélation au scroll, jouée une seule fois. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = usePrefersReducedMotion()

  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.2, delay }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={revealVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}

/**
 * Titre révélé mot à mot : chaque mot monte depuis sous une ligne de masque.
 * Le texte reste un seul nœud lisible pour les lecteurs d'écran.
 */
export function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.05,
  as: Tag = 'span',
  id,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: ElementType
  id?: string
}) {
  const reduce = usePrefersReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return (
      <Tag className={className} id={id}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag className={className} id={id}>
      <motion.span
        aria-hidden
        className="inline"
        variants={staggerVariants(stagger, delay)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            // overflow-hidden découpe le mot pendant sa montée ; le padding
            // évite de rogner les jambages et les accents.
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span variants={wordVariants} className="inline-block">
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
      <span className="sr-only">{text}</span>
    </Tag>
  )
}

/**
 * Translation liée au scroll. `distance` est le déplacement total en pixels sur
 * toute la traversée de l'élément dans la fenêtre.
 */
export function useParallax(
  ref: React.RefObject<HTMLElement>,
  distance: number
): MotionValue<number> {
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 })
  return useTransform(smooth, [0, 1], reduce ? [0, 0] : [distance / 2, -distance / 2])
}

/** Conteneur qui applique une parallaxe verticale à son contenu. */
export function Parallax({
  children,
  distance = 60,
  className = '',
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const y = useParallax(ref, distance)

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

/** Filet horizontal qui se trace de gauche à droite quand il entre à l'écran. */
export function RuleReveal({ className = '' }: { className?: string }) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.hr
      className={`h-px w-full origin-left border-0 bg-slate/25 ${className}`}
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={transition(DURATION.slow)}
    />
  )
}

export { RISE }
