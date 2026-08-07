/**
 * Génère les assets de marque — `npm run brand`
 *
 *  - public/favicon.svg          monogramme R (Syne 800, tracé vectorisé)
 *  - public/favicon-32.png       repli pour les navigateurs sans favicon SVG
 *  - public/apple-touch-icon.png 180x180
 *  - public/og/rylix-og.jpg      1200x630, photo + logotype RYLIX
 *
 * Les tracés proviennent de assets/syne-glyphs.json (Syne wght 800, upm 1000,
 * hauteur de capitale 640). Aucune police n'est requise au rendu : tout est
 * vectorisé, donc l'icône et l'image OG sont identiques partout.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'public')

const NAVY = '#10151a'
const CREAM = '#e8e4d8'
const CAP = 640 // hauteur de capitale dans l'unité de la police
const LETTER_SPACING = 90 // interlettrage, en unités de police

const font = JSON.parse(await fs.readFile(path.join(ROOT, 'assets/syne-glyphs.json'), 'utf8'))
// Syne s'élargit fortement avec la graisse : le logotype utilise le 800,
// le monogramme le 700 (proportions quasi carrées, plus lisibles en 32px).
const glyphs = font.weights['800']

/**
 * Compose un mot en <path> SVG. Renvoie le markup et la largeur totale
 * dans l'unité de la police (y monte, baseline à 0).
 */
function word(text) {
  let x = 0
  const parts = []
  for (const ch of text) {
    const g = glyphs[ch]
    if (!g) throw new Error(`Glyphe manquant : ${ch}`)
    parts.push(`<path d="${g.d}" transform="translate(${x} 0)"/>`)
    x += g.adv + LETTER_SPACING
  }
  return { markup: parts.join(''), width: x - LETTER_SPACING }
}

/* ------------------------------------------------------------------ favicon */

const R = font.weights['700'].R
const [rx0, , rx1, ry1] = R.bbox // bornes réelles du tracé, hors approches latérales
const rWidth = rx1 - rx0
const SIZE = 64
const scale = (SIZE * 0.62) / Math.max(rWidth, ry1)
const tx = (SIZE - rWidth * scale) / 2 - rx0 * scale
const ty = (SIZE + ry1 * scale) / 2

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${NAVY}"/>
  <g fill="${CREAM}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)} -${scale.toFixed(5)})">
    <path d="${R.d}"/>
  </g>
</svg>
`

await fs.writeFile(path.join(PUBLIC, 'favicon.svg'), faviconSvg)
const faviconBuf = Buffer.from(faviconSvg)
await sharp(faviconBuf, { density: 384 })
  .resize(32, 32)
  .png()
  .toFile(path.join(PUBLIC, 'favicon-32.png'))
await sharp(faviconBuf, { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(path.join(PUBLIC, 'apple-touch-icon.png'))
console.log('favicon.svg / favicon-32.png / apple-touch-icon.png')

/* ----------------------------------------------------------------- image OG */

const OG_W = 1200
const OG_H = 630
const COVER = path.join(ROOT, 'assets/photos/better-days-cover.png')

// Composition : fond navy, logotype vectorisé à gauche, pochette à droite.
// Pas de texte hors Syne vectorisé — le rendu ne dépend d'aucune police système.
const COVER_SIZE = 430
const COVER_X = OG_W - COVER_SIZE - 80
const COVER_Y = (OG_H - COVER_SIZE) / 2

const cover = await sharp(COVER).resize(COVER_SIZE, COVER_SIZE, { fit: 'cover' }).toBuffer()

const logo = word('RYLIX')
const logoX = 80
const GUTTER = 64
// Le logotype occupe toute la colonne de gauche, sans jamais toucher la pochette.
const logoScale = (COVER_X - logoX - GUTTER) / logo.width
const logoW = logo.width * logoScale
const logoBaseline = OG_H / 2 + (CAP * logoScale) / 2

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="${NAVY}"/>
  <g fill="${CREAM}" transform="translate(${logoX} ${logoBaseline}) scale(${logoScale.toFixed(5)} -${logoScale.toFixed(5)})">
    ${logo.markup}
  </g>
  <rect x="${logoX}" y="${(logoBaseline + 40).toFixed(0)}" width="${logoW.toFixed(0)}" height="1" fill="#4a6572"/>
</svg>
`

await fs.mkdir(path.join(PUBLIC, 'og'), { recursive: true })
await sharp(Buffer.from(background))
  .composite([{ input: cover, top: Math.round(COVER_Y), left: COVER_X }])
  .jpeg({ quality: 88, progressive: true })
  .toFile(path.join(PUBLIC, 'og/rylix-og.jpg'))

console.log(`og/rylix-og.jpg  (logotype ${logoW.toFixed(0)}px de large)`)
