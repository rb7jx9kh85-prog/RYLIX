import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { release, turntableSection } from '@/lib/content'
import { resolveImage } from '@/lib/images'
import { EASE, usePrefersReducedMotion } from '@/lib/motion'

type PlaybackStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused'

type SpotifyController = {
  play: () => void
  pause: () => void
  togglePlay: () => void
  addListener: (
    event: 'playback_update' | 'ready',
    callback: (e: { data: { isPaused: boolean } }) => void
  ) => void
}

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyController) => void
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
  }
}

const IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1'

/** Le script officiel Spotify n'est chargé qu'une fois, quel que soit le nombre de montages. */
let iframeApiPromise: Promise<SpotifyIframeApi> | null = null
function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (!iframeApiPromise) {
    iframeApiPromise = new Promise((resolve) => {
      const existingApi = (window as { Spotify?: unknown }).Spotify
      if (existingApi) return resolve(existingApi as SpotifyIframeApi)
      window.onSpotifyIframeApiReady = (api) => resolve(api)
      const script = document.createElement('script')
      script.src = IFRAME_API_SRC
      script.async = true
      document.body.appendChild(script)
    })
  }
  return iframeApiPromise
}

const panelVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } },
}

const partVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
}

/**
 * Tourne-disque interactif, juste sous le hero — le bouton central pilote la
 * lecture réelle de Better Days via l'API iFrame officielle de Spotify
 * (le lecteur compact reste visible en dessous : contrôles natifs, et
 * attribution Spotify intacte, on ne fait pas semblant).
 *
 * Le script Spotify n'est chargé, et le contrôleur créé, qu'une fois la
 * section réellement visible — jamais avant, jamais pour rien.
 */
export function TurntableSection() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyController | null>(null)
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '20% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || !mountRef.current) return
    let cancelled = false
    setStatus('loading')

    loadSpotifyIframeApi().then((api) => {
      if (cancelled || !mountRef.current) return
      api.createController(
        mountRef.current,
        { uri: `spotify:track:${release.spotifyTrackId}`, width: '100%', height: '80' },
        (controller) => {
          if (cancelled) return
          controllerRef.current = controller
          controller.addListener('playback_update', (e) => {
            setStatus(e.data.isPaused ? 'paused' : 'playing')
          })
          setStatus('ready')
        }
      )
    })

    return () => {
      cancelled = true
    }
  }, [inView])

  const playing = status === 'playing'
  const cover = resolveImage(release.coverKey)

  const handleToggle = () => {
    controllerRef.current?.togglePlay()
  }

  return (
    <section ref={sectionRef} className="py-lg md:py-xl" aria-labelledby="ecouter">
      <div className="container-rylix">
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          <span className="font-sans text-sm text-accent">01</span>
          <p id="ecouter" className="label">
            {turntableSection.eyebrow}
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:col-span-5"
          >
            <h2 className="text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-cream">
              {release.title}
            </h2>
            <p className="mt-4 max-w-prose text-fg-muted">{turntableSection.hint}</p>

            {/* Lecteur Spotify compact — vrais contrôles, vraie attribution.
                Le bouton du tourne-disque agit sur ce même contrôleur. */}
            <div className="mt-8 overflow-hidden rounded-sm bg-navy-alt">
              <div ref={mountRef} className="min-h-[80px]" />
              {status === 'idle' && (
                <p className="p-4 font-sans text-xs uppercase tracking-[0.1em] text-fg-muted/60">
                  Chargement du lecteur…
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={panelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            className="md:col-span-7"
          >
            <motion.div
              className="relative mx-auto flex max-w-md flex-col items-center gap-8 overflow-hidden
                         rounded-md border border-slate/25 bg-gradient-to-b from-navy-alt/90 to-navy
                         p-8 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)] md:p-12"
            >
              {/* Filet de lumière en haut du panneau — accroche l'œil comme un
                  bord métallique, cohérent avec le reste de la fiche technique. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r
                           from-transparent via-cream/30 to-transparent"
              />
              {/* Plaque signalétique — détail de "vraie machine". */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-6 top-6 flex items-center gap-2
                           font-sans text-[9px] uppercase tracking-[0.18em] text-fg-muted/45 md:left-8 md:top-8"
              >
                <span>RYLIX</span>
                <span className="h-1 w-1 rounded-full bg-slate/50" />
                <span>33⅓ RPM</span>
              </div>

              <motion.div variants={partVariants} className="w-full max-w-[280px]">
                <Deck
                  cover={cover?.src}
                  playing={playing}
                  loading={status === 'loading' || status === 'idle'}
                  reduce={reduce}
                />
              </motion.div>

              <motion.div variants={partVariants} className="flex items-center gap-7">
                <div className="relative shrink-0">
                  {/* Anneau qui respire en lecture */}
                  {playing && !reduce && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-accent/60"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}

                  <motion.button
                    type="button"
                    onClick={handleToggle}
                    disabled={status === 'idle' || status === 'loading'}
                    aria-label={
                      playing ? `Mettre en pause ${release.title}` : `Lire ${release.title}`
                    }
                    whileHover={reduce ? undefined : { scale: 1.08 }}
                    whileTap={reduce ? undefined : { scale: 0.9 }}
                    className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full
                               border border-cream/15 bg-navy text-cream
                               shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-3px_8px_rgba(0,0,0,0.55)]
                               transition-colors duration-500 ease-rylix hover:text-accent
                               disabled:cursor-wait disabled:opacity-40"
                  >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                  </motion.button>

                  {/* Voyant — s'allume en lecture */}
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-navy
                                transition-colors duration-500 ease-rylix ${
                                  playing
                                    ? 'bg-accent shadow-[0_0_8px_2px_rgba(217,255,67,0.55)]'
                                    : 'bg-slate/50'
                                }`}
                  />
                </div>

                <EqualizerBars playing={playing && !reduce} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/**
 * La pochette de Better Days, carrée — plus de plateau ni de bras de lecture.
 * Elle respire légèrement en lecture, ce qui suffit à signaler que ça tourne.
 */
function Deck({
  cover,
  playing,
  loading,
  reduce,
}: {
  cover?: string
  playing: boolean
  loading: boolean
  reduce: boolean
}) {
  return (
    <div className="relative aspect-square w-full max-w-[280px]">
      <motion.div
        animate={reduce ? undefined : { scale: playing ? 1.02 : 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="h-full w-full overflow-hidden rounded-sm border border-slate/25 bg-navy-alt"
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            className="photo h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-navy-alt" />
        )}
      </motion.div>

      {loading && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-navy/50 font-sans text-[10px] uppercase tracking-[0.14em] text-fg-muted/70"
        >
          Connexion…
        </span>
      )}
    </div>
  )
}

/** Barres façon égaliseur — purement décoratives, calées sur l'état de lecture. */
function EqualizerBars({ playing }: { playing: boolean }) {
  const bars = [
    { duration: 0.7, delay: 0 },
    { duration: 0.9, delay: 0.1 },
    { duration: 0.6, delay: 0.05 },
    { duration: 1.05, delay: 0.15 },
  ]

  return (
    <div aria-hidden className="flex h-8 items-end gap-1">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`eq-bar w-1 rounded-full bg-accent ${playing ? 'is-playing' : ''}`}
          style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="ml-0.5 h-5 w-5 fill-current">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <rect x="7" y="5.5" width="3.4" height="13" rx="0.6" />
      <rect x="13.6" y="5.5" width="3.4" height="13" rx="0.6" />
    </svg>
  )
}
