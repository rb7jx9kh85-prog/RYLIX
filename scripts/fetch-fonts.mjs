import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/fonts')
const CSS_OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/styles/fonts.css'
)
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const URL =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..900;1,400..900&display=swap'

const KEEP = ['latin', 'latin-ext'] // ordre = ordre d'écriture des @font-face
const WEIGHT_RANGE = { Archivo: '400 900' }

const css = await (await fetch(URL, { headers: { 'User-Agent': UA } })).text()

await fs.rm(OUT_DIR, { recursive: true, force: true })
await fs.mkdir(OUT_DIR, { recursive: true })

const blocks = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)]
const seen = new Map() // family|subset -> {range, url}

for (const [, subset, block] of blocks) {
  if (!KEEP.includes(subset)) continue
  const family = /font-family:\s*'([^']+)'/.exec(block)[1]
  const key = `${family}|${subset}`
  if (seen.has(key)) continue // Google sert la même variable font pour chaque graisse
  seen.set(key, {
    family,
    subset,
    range: /unicode-range:\s*([^;]+);/.exec(block)[1].trim(),
    url: /url\((https:\/\/[^)]+\.woff2)\)/.exec(block)[1],
  })
}

const faces = [...seen.values()].sort(
  (a, b) => a.family.localeCompare(b.family) || KEEP.indexOf(a.subset) - KEEP.indexOf(b.subset)
)

const out = []
for (const f of faces) {
  const file = `${f.family.toLowerCase()}-${f.subset}.woff2`
  const buf = Buffer.from(
    await (await fetch(f.url, { headers: { 'User-Agent': UA } })).arrayBuffer()
  )
  await fs.writeFile(path.join(OUT_DIR, file), buf)
  console.log(file, buf.length)
  out.push(
    `/* ${f.family} — ${f.subset} */\n@font-face {\n  font-family: '${f.family}';\n  font-style: normal;\n  font-weight: ${WEIGHT_RANGE[f.family]};\n  font-display: swap;\n  src: url('/fonts/${file}') format('woff2');\n  unicode-range: ${f.range};\n}`
  )
}

const header = `/* Police self-hostée — Archivo (Google Fonts, licence SIL Open Font License 1.1).\n   Fichier variable 400-900, sous-ensembles latin + latin-ext uniquement.\n   Aucune requête vers un domaine tiers au runtime. */\n\n`
await fs.mkdir(path.dirname(CSS_OUT), { recursive: true })
await fs.writeFile(CSS_OUT, header + out.join('\n\n') + '\n')
console.log('wrote', CSS_OUT, out.length, 'faces')

/* --------------------------------------------------------------- licences */
// La SIL OFL impose que la licence accompagne les woff2 redistribués : on la
// récupère en même temps que les fichiers plutôt que de la maintenir à la main.

const licenses = ['Polices embarquées dans public/fonts/ — SIL Open Font License 1.1', '']

for (const family of [...new Set(faces.map((f) => f.family))]) {
  const slug = family.toLowerCase()
  const res = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`)
  if (!res.ok) {
    console.warn(`licence introuvable pour ${family} (HTTP ${res.status})`)
    continue
  }
  licenses.push('='.repeat(64), family.toUpperCase(), '='.repeat(64), '', await res.text())
}

await fs.writeFile(path.join(OUT_DIR, 'LICENSE.txt'), licenses.join('\n'))
console.log('wrote', path.join(OUT_DIR, 'LICENSE.txt'))
