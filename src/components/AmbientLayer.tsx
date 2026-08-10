import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion'

const BackgroundField = lazy(() => import('./BackgroundField'))

/**
 * Calque d'ambiance 3D, posé derrière le contenu d'une section (position
 * absolute, gérée par l'appelant via `className`). Ne charge three.js que
 * lorsque la section est réellement visible ; absent sous mouvement réduit —
 * purement décoratif, jamais porteur d'information.
 */
export function AmbientLayer({ className = '' }: { className?: string }) {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '25% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce])

  if (reduce) return null

  return (
    <div ref={ref} aria-hidden className={className}>
      {inView && (
        <Suspense fallback={null}>
          <BackgroundField />
        </Suspense>
      )}
    </div>
  )
}
