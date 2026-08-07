import { useState } from 'react'
import { images, type ImageKey } from '@/lib/images.generated'

type Props = {
  /** Clé du manifeste généré par `npm run images`. */
  imageKey: ImageKey
  alt: string
  /** Attribut sizes — indispensable pour que le navigateur choisisse la bonne variante. */
  sizes: string
  /** Classes appliquées au conteneur (dimensionnement, arrondi, overflow). */
  className?: string
  /** Classes appliquées à l'image elle-même (object-fit, etc.). */
  imgClassName?: string
  /** Le hero est chargé en priorité ; tout le reste est lazy. */
  priority?: boolean
  objectPosition?: string
}

/**
 * Image responsive WebP : srcset multi-largeurs, lazy loading hors hero,
 * et placeholder LQIP flouté sous l'image le temps du chargement.
 * Les dimensions intrinsèques sont portées par le <img> — aucun layout shift.
 */
export function Image({
  imageKey,
  alt,
  sizes,
  className = '',
  imgClassName = 'h-full w-full object-cover',
  priority = false,
  objectPosition,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const img = images[imageKey]

  return (
    // Pas de classe de positionnement ici : l'appelant en fournit une si besoin
    // (`absolute` sur le hero). En ajouter une par défaut entrerait en conflit.
    <span
      className={`block overflow-hidden bg-navy-alt ${className}`}
      style={
        loaded
          ? undefined
          : {
              backgroundImage: `url("${img.placeholder}")`,
              backgroundSize: 'cover',
              backgroundPosition: objectPosition ?? 'center',
            }
      }
    >
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        onLoad={() => setLoaded(true)}
        style={{ objectPosition }}
        className={`photo transition-opacity duration-700 ease-rylix ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </span>
  )
}
