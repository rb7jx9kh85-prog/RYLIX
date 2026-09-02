import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'

// L'accueil est dans le bundle initial ; les autres pages sont chargées à la demande.
const Music = lazy(() => import('@/pages/Music'))
const Studio = lazy(() => import('@/pages/Studio'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Dates = lazy(() => import('@/pages/Dates'))
const Parcours = lazy(() => import('@/pages/Parcours'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Réserve la hauteur d'écran pendant le chargement d'une page — évite le saut. */
const deferred = (node: ReactNode) => (
  <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>{node}</Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="musique" element={deferred(<Music />)} />
        <Route path="studio" element={deferred(<Studio />)} />
        <Route path="galerie" element={deferred(<Gallery />)} />
        <Route path="dates" element={deferred(<Dates />)} />
        <Route path="parcours" element={deferred(<Parcours />)} />
        <Route path="contact" element={deferred(<Contact />)} />
        {/* Ancienne URL conservée : /tournee a été renommée en /dates. */}
        <Route path="tournee" element={<Navigate to="/dates" replace />} />
        <Route path="*" element={deferred(<NotFound />)} />
      </Route>
    </Routes>
  )
}
