import { useEffect, useState } from 'react'
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

  return (
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

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={transition(DURATION.base)}
            className="overflow-hidden md:hidden"
          >
            <nav aria-label="Navigation mobile" className="container-rylix pb-10 pt-2">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <li key={item.to} className="overflow-hidden border-b border-slate/15">
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: reduce ? 0.2 : DURATION.base,
                        delay: reduce ? 0 : 0.05 + i * 0.05,
                        ease: EASE,
                      }}
                    >
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `block py-4 font-display text-h3 font-bold uppercase tracking-wide ${
                            isActive ? 'text-pale' : 'text-cream'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.base, delay: 0.05 + nav.length * 0.05 }}
                className="mt-8"
              >
                <SocialLinks />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
