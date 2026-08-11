import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Reveal, SplitText } from './PageTransition'
import { sound } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/motion'

// Chunk séparé : three.js + react-three-fiber ne pèsent que si cette section
// est réellement atteinte, et jamais sous mouvement réduit.
const VinylScene = lazy(() => import('./VinylScene'))

/**
 * Section son / studio — la scène 3D (vinyle, sillons, poussière en
 * suspension) partage l'écran avec le statement éditorial. Le canvas n'est
 * monté qu'une fois la section réellement visible, jamais avant : pas de
 * coût WebGL payé pour une section qu'on ne voit peut-être jamais.
 *
 * Sous prefers-reduced-motion, un disque statique dessiné en CSS prend le
 * relais — même identité visuelle, aucune animation, aucun WebGL.
 */
export function VinylSection() {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduce || inView) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '15% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce, inView])

  return (
    <section className="py-lg md:py-xl" aria-labelledby="le-son">
      <div className="container-rylix grid items-center gap-12 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-sans text-sm text-accent">03</span>
            <Reveal>
              <p id="le-son" className="label">
                {sound.eyebrow}
              </p>
            </Reveal>
          </div>

          <h2 className="text-balance break-words font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            {sound.title.map((line, i) => (
              <SplitText
                key={line}
                as="span"
                text={line}
                delay={0.06 + i * 0.08}
                className="block text-[clamp(1.75rem,5.5vw,3.25rem)]"
              />
            ))}
          </h2>

          <Reveal delay={0.1 + sound.title.length * 0.08} className="mt-8 max-w-prose">
            <p className="text-lg leading-relaxed text-fg-muted">{sound.body}</p>
          </Reveal>
        </div>

        <div
          ref={ref}
          aria-hidden
          className="relative aspect-square w-full overflow-hidden rounded-sm border border-slate/20 bg-navy-alt/40 md:col-span-5"
        >
          {reduce ? (
            <StaticDisc />
          ) : (
            inView && (
              <Suspense fallback={<StaticDisc />}>
                <VinylScene />
              </Suspense>
            )
          )}
        </div>
      </div>
    </section>
  )
}

/** Repli statique — même silhouette, zéro animation, zéro WebGL. */
function StaticDisc() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative aspect-square w-[62%] rounded-full border border-pale/15"
        style={{
          background:
            'repeating-radial-gradient(circle, rgba(200,203,188,0.12) 0px, rgba(200,203,188,0.12) 1px, transparent 1px, transparent 7px), #1a1c17',
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        <span className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy" />
      </div>
    </div>
  )
}
