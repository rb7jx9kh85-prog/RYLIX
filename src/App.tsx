import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'

// L'accueil est dans le bundle initial ; les autres pages sont chargées à la demande.
const Music = lazy(() => import('@/pages/Music'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Tour = lazy(() => import('@/pages/Tour'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Réserve la hauteur d'écran pendant le chargement d'une page — évite le saut. */
const Fallback = <div className="min-h-screen" aria-busy="true" />

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="musique"
          element={<Suspense fallback={Fallback}>{<Music />}</Suspense>}
        />
        <Route
          path="galerie"
          element={<Suspense fallback={Fallback}>{<Gallery />}</Suspense>}
        />
        <Route path="tournee" element={<Suspense fallback={Fallback}>{<Tour />}</Suspense>} />
        <Route path="contact" element={<Suspense fallback={Fallback}>{<Contact />}</Suspense>} />
        <Route path="*" element={<Suspense fallback={Fallback}>{<NotFound />}</Suspense>} />
      </Route>
    </Routes>
  )
}
