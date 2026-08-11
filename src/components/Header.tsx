import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { nav } from '@/lib/content'
import { DURATION, EASE, transition, usePrefersReducedMotion } from '@/lib/motion'
import { SocialLinks } from './SocialLinks'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  const reduce = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => setOpen(false), [pathname])

  // Le header s'efface en descendant et revient dès qu'on remonte : la page
  // garde toute sa hauteur pendant la lecture, la navigation reste à portée.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (open) return
    setHidden(y > 160 && y > previous)
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Le focus suit l'ouverture/fermeture : premier lien à l'ouverture, retour
  // sur le déclencheur à la fermeture — même logique que la lightbox. Ignoré
  // au montage initial (open démarre à false, rien n'a encore été ouvert).
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) firstLinkRef.current?.focus()
    else if (wasOpen.current) toggleRef.current?.focus()
    wasOpen.current = open
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden && !reduce ? '-100%' : '0%' }}
        transition={transition(DURATION.base)}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-rylix ${
          scrolled || open
            ? 'border-b border-slate/20 bg-navy/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-rylix flex h-16 items-center justify-between md:h-20">
          <Link
            to="/"
            className="font-display text-lg font-extrabold uppercase tracking-[0.18em] text-cream transition-colors duration-300 hover:text-pale md:text-xl"
            aria-label="RYLIX — accueil"
          >
            RYLIX
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-7 lg:gap-9">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="group relative block py-1">
                    {({ isActive }) => (
                      <>
                        <span
                          className={`label transition-colors duration-300 ease-rylix group-hover:text-cream ${
                            isActive ? 'text-cream' : ''
                          }`}
                        >
                          {item.label}
                        </span>
                        {/* Filet qui se trace au survol, et reste tracé sur la page active */}
                        <span
                          aria-hidden
                          className={`absolute -bottom-0.5 left-0 block h-px w-full origin-left
                                    bg-accent transition-transform duration-500 ease-rylix
                                    group-hover:scale-x-100 ${
                                      isActive ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="-mr-2 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-cream transition-transform duration-300 ease-rylix ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-cream transition-transform duration-300 ease-rylix ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Menu mobile plein écran — hors du header pour ne jamais suivre son
        repli au scroll. Fond noir, liens massifs indexés, réseaux en bas :
        même langage que le reste du site (Syne, filets fins, accent rare). */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={transition(reduce ? DURATION.fast : DURATION.slow)}
            className="fixed inset-0 z-40 flex flex-col bg-navy pt-16 md:hidden"
          >
            <nav
              aria-label="Navigation mobile"
              className="container-rylix flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-6"
            >
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <li
                    key={item.to}
                    className="overflow-hidden border-b border-slate/15 first:border-t"
                  >
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: reduce ? 0.2 : DURATION.base,
                        delay: reduce ? 0 : 0.08 + i * 0.06,
                        ease: EASE,
                      }}
                    >
                      <NavLink
                        ref={i === 0 ? firstLinkRef : undefined}
                        to={item.to}
                        className={({ isActive }) =>
                          `group flex items-baseline gap-3 py-4 font-display text-[clamp(1.85rem,8.3vw,2.85rem)]
                         font-extrabold uppercase leading-[0.95] tracking-[-0.03em] ${
                           isActive ? 'text-accent' : 'text-cream'
                         }`
                        }
                      >
                        <span className="font-sans text-xs font-medium tracking-[0.1em] text-fg-muted/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {item.label}
                      </NavLink>
                    </motion.div>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: DURATION.base,
                  delay: reduce ? 0 : 0.08 + nav.length * 0.06,
                }}
                className="mt-10"
              >
                <SocialLinks />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
