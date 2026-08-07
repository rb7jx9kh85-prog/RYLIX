/**
 * Pipeline images — `npm run images`
 *
 * Lit les sources dans assets/photos/, produit des WebP responsive dans
 * public/images/ et régénère src/lib/images.generated.ts (dimensions, srcset,
 * placeholder LQIP en base64 pour éviter tout layout shift).
 *
 * Pour ajouter une photo : la déposer dans assets/photos/ puis relancer le script.
 * Le nom de fichier (sans extension) devient la clé utilisée dans src/lib/content.ts.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'assets/photos')
const OUT_DIR = path.join(ROOT, 'public/images')
const MANIFEST = path.join(ROOT, 'src/lib/images.generated.ts')

const WIDTHS = [480, 768, 1200, 1920]
const QUALITY = 78

const isImage = (f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)

const files = (await fs.readdir(SRC_DIR).catch(() => [])).filter(isImage).sort()
if (files.length === 0) {
  console.error(`Aucune image dans ${path.relative(ROOT, SRC_DIR)}`)
  process.exit(1)
}

await fs.rm(OUT_DIR, { recursive: true, force: true })
await fs.mkdir(OUT_DIR, { recursive: true })

const entries = []

for (const file of files) {
  const slug = path.basename(file, path.extname(file))
  const input = path.join(SRC_DIR, file)
  const image = sharp(input).rotate() // applique l'orientation EXIF
  const meta = await image.metadata()

  const widths = WIDTHS.filter((w) => w <= meta.width)
  if (widths.length === 0 || widths.at(-1) !== Math.min(meta.width, WIDTHS.at(-1))) {
    widths.push(Math.min(meta.width, WIDTHS.at(-1)))
  }

  const sources = []
  for (const w of [...new Set(widths)].sort((a, b) => a - b)) {
    const name = `${slug}-${w}.webp`
    await sharp(input)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(path.join(OUT_DIR, name))
    sources.push({ w, url: `/images/${name}` })
  }

  // LQIP : miniature floutée inlinée, affichée le temps du chargement
  const lqip = await sharp(input)
    .rotate()
    .resize({ width: 16 })
    .blur(1.2)
    .webp({ quality: 32 })
    .toBuffer()

  const largest = sources.at(-1)
  entries.push({
    slug,
    width: meta.width,
    height: meta.height,
    src: largest.url,
    srcSet: sources.map((s) => `${s.url} ${s.w}w`).join(', '),
    placeholder: `data:image/webp;base64,${lqip.toString('base64')}`,
  })

  const bytes = await Promise.all(
    sources.map((s) => fs.stat(path.join(OUT_DIR, path.basename(s.url))).then((st) => st.size))
  )
  console.log(
    `${slug}  ${meta.width}x${meta.height}  ->  ${sources.length} variantes  ${(
      bytes.reduce((a, b) => a + b, 0) / 1024
    ).toFixed(0)} Ko`
  )
}

const body = `// Généré par scripts/optimize-images.mjs — ne pas éditer à la main.
// Régénérer avec : npm run images

export type GeneratedImage = {
  src: string
  srcSet: string
  width: number
  height: number
  placeholder: string
}

export const images = {
${entries
  .map(
    (e) => `  '${e.slug}': {
    src: '${e.src}',
    srcSet: '${e.srcSet}',
    width: ${e.width},
    height: ${e.height},
    placeholder: '${e.placeholder}',
  },`
  )
  .join('\n')}
} satisfies Record<string, GeneratedImage>

export type ImageKey = keyof typeof images
`

await fs.writeFile(MANIFEST, body)
console.log(`\n${entries.length} image(s) -> ${path.relative(ROOT, MANIFEST)}`)
