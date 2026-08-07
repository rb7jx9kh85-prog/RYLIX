import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from './motion'

/**
 * Défilement amorti (Lenis) : le scroll conserve un peu d'inertie, ce qui rend
 * les effets liés au scroll continus au lieu de saccadés.
 *
 * Désactivé si l'utilisateur demande moins d'animations — on retombe alors sur
 * le défilement natif du navigateur, sans aucune interception.
 */
export function useSmoothScroll(): void {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      // Même famille de courbe que le reste du site, en version amortie.
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Le tactile garde son défilement natif : plus fiable et plus attendu.
      syncTouch: false,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])
}
