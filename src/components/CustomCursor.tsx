import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/motion'
import { useMediaQuery } from '@/lib/useMediaQuery'

/**
 * Curseur personnalisé — un point qui suit le pointeur, se change en anneau
 * sur les liens et boutons, et affiche un mot (« Voir », « Écouter »…) sur
 * les cibles qui portent `data-cursor-label`.
 *
 * Une seule paire de listeners délégués sur `document` : pas de handler par
 * cible, donc aucun coût supplémentaire tant qu'on ne survole rien. Le
 * curseur système reste affiché — celui-ci n'est qu'un calque additionnel,
 * jamais requis pour comprendre l'interface (souris fine + hover uniquement,
 * absent au clavier, au toucher et sous mouvement réduit).
 */
export function CustomCursor() {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = usePrefersReducedMotion()
  const active = canHover && !reduce

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  const [state, setState] = useState<{ mode: 'idle' | 'link' | 'label'; label: string }>({
    mode: 'idle',
    label: '',
  })
  const [visible, setVisible] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (!active) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      const el = target?.closest<HTMLElement>('a, button, [data-cursor]')
      if (!el) return
      const label = el.dataset.cursorLabel
      const next = label ? { mode: 'label' as const, label } : { mode: 'link' as const, label: '' }
      if (stateRef.current.mode !== next.mode || stateRef.current.label !== next.label) {
        setState(next)
      }
    }

    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null
      if (related?.closest('a, button, [data-cursor]')) return
      setState({ mode: 'idle', label: '' })
    }

    const onLeaveWindow = () => setVisible(false)

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    document.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerleave', onLeaveWindow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!active) return null

  const size = state.mode === 'label' ? 84 : state.mode === 'link' ? 44 : 10

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center rounded-full bg-cream"
      >
        {state.mode === 'label' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            className="whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-navy"
          >
            {state.label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
