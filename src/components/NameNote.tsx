import { motion } from 'framer-motion'
import { artistName, site } from '@/lib/content'
import { EASE, VIEWPORT, usePrefersReducedMotion } from '@/lib/motion'

/**
 * Origine du nom d'artiste — petite case citée, en bas de la section Explorer.
 *
 * Rien n'est affiché tant que la citation n'est pas écrite : une case vide
 * vaudrait moins que pas de case du tout.
 */
export function NameNote() {
  const reduce = usePrefersReducedMotion()
  if (!artistName.quote) return null

  return (
    <div className="container-rylix relative z-10 mt-8 md:mt-10">
      <motion.figure
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
        className="m-0 max-w-xl rounded-sm border border-slate/25 bg-navy-alt/40 p-5 md:p-6"
      >
        <figcaption className="label mb-3 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-6 shrink-0 bg-accent"
          />
          {artistName.eyebrow}
        </figcaption>

        <blockquote className="m-0">
          <p className="m-0 text-sm leading-relaxed text-cream/90 md:text-base">
            « {artistName.quote} »
          </p>
        </blockquote>

        <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.16em] text-fg-muted/70">
          {site.name}
        </p>
      </motion.figure>
    </div>
  )
}
