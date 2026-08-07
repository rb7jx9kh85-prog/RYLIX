import { images, type GeneratedImage, type ImageKey } from './images.generated'

export type { GeneratedImage, ImageKey }
export { images }

/**
 * Résout une clé d'image en tolérant les visuels pas encore fournis : le
 * contenu peut référencer `image-3` avant que le fichier n'existe, auquel cas
 * l'interface affiche un cadre vide plutôt que de casser le build.
 *
 * Déposer le fichier dans assets/photos/ puis `npm run images` suffit à
 * l'activer — aucun code à modifier.
 */
export function resolveImage(key: string, fallback?: string): GeneratedImage | null {
  const all = images as Record<string, GeneratedImage>
  return all[key] ?? (fallback ? (all[fallback] ?? null) : null)
}

export function hasImage(key: string): boolean {
  return key in images
}
