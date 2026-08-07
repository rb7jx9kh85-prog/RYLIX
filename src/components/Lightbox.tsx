import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { images, type ImageKey } from '@/lib/images.generated'

export type LightboxItem = { key: ImageKey; alt: string }

type Props = {
  items: LightboxItem[]
  /** Index affiché, ou null si la lightbox est fermée. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * Lightbox custom, sans dépendance : navigation clavier, focus piégé,
 * fermeture au clic sur le fond ou sur Échap.
 */
export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const open = index !== null
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onNavigate((index + delta + items.length) % items.length)
    },
    [index, items.length, onNavigate]
  )

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      restoreFocus.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Tab') {
        // Une seule zone focusable : on garde le focus sur le bouton de fermeture.
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, go])

  const item = index === null ? null : items[index]

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-cream transition-colors hover:text-pale md:right-8 md:top-8"
          >
            <span className="sr-only">Fermer</span>
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 stroke-current" fill="none">
              <path d="M5 5l14 14M19 5L5 19" strokeWidth="1.25" />
            </svg>
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-cream/70 transition-colors hover:text-cream md:left-6"
              >
                <span className="sr-only">Image précédente</span>
                <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 stroke-current" fill="none">
                  <path d="M15 4l-8 8 8 8" strokeWidth="1.25" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-cream/70 transition-colors hover:text-cream md:right-6"
              >
                <span className="sr-only">Image suivante</span>
                <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 stroke-current" fill="none">
                  <path d="M9 4l8 8-8 8" strokeWidth="1.25" />
                </svg>
              </button>
            </>
          )}

          <motion.figure
            key={item.key}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-5xl flex-col gap-4"
          >
            <img
              src={images[item.key].src}
              srcSet={images[item.key].srcSet}
              sizes="(max-width: 768px) 92vw, 80vw"
              width={images[item.key].width}
              height={images[item.key].height}
              alt={item.alt}
              className="photo max-h-[78vh] w-auto object-contain"
            />
            <figcaption className="text-center text-sm text-fg-muted/70">
              {item.alt}
              {items.length > 1 && (
                <span className="ml-3 tabular-nums text-fg-muted/70">
                  {(index ?? 0) + 1} / {items.length}
                </span>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
