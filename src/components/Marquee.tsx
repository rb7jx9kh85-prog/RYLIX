import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { marquee } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/motion'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Bandeau défilant en boucle — vitesse et sens réagissent au scroll : on
 * accélère en descendant, la piste ralentit puis repart en sens inverse si on
 * remonte. Base : dérive continue via useAnimationFrame, poussée par la
 * vélocité de scroll lissée. Le déplacement est un pourcentage de la largeur
 * de la piste (deux copies du contenu) — jamais de layout, transform GPU
 * uniquement.
 *
 * Sous prefers-reduced-motion : aucune dérive, la piste reste immobile.
 */
export function Marquee() {
  const reduce = usePrefersReducedMotion()
  const baseX = useMotionValue(0)
  const direction = useRef(1)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-1500, 1500], [-4, 4], { clamp: true })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_t, delta) => {
    if (reduce) return
    let moveBy = direction.current * 6 * (delta / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    moveBy += direction.current * moveBy * Math.abs(factor)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div aria-hidden className="overflow-hidden border-y border-slate/20 py-5 md:py-7">
      <motion.div
        style={{ x: reduce ? '0%' : x }}
        className="flex w-max shrink-0 items-center gap-10 md:gap-16"
      >
        {[0, 1].map((rep) => (
          <ul
            key={rep}
            className="flex shrink-0 items-center gap-10 md:gap-16"
            aria-hidden={rep === 1}
          >
            {marquee.map((label, i) => (
              <li
                key={`${rep}-${label}-${i}`}
                className="flex shrink-0 items-center gap-10 whitespace-nowrap font-display text-[clamp(1.5rem,4vw,2.75rem)]
                           font-extrabold uppercase leading-none tracking-[-0.01em] text-cream/90 md:gap-16"
              >
                {label}
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  )
}
