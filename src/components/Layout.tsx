import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { ScrollProgress } from './ScrollProgress'

/** Remet la page en haut à chaque navigation (React Router ne le fait pas). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-sm focus:bg-cream focus:px-4 focus:py-2 focus:font-medium focus:text-navy"
      >
        Aller au contenu
      </a>
      <ScrollProgress />
      <Header />
      <main id="contenu" className="min-h-screen">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}
