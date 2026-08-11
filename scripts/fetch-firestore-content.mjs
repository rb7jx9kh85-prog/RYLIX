// Récupère le contenu éditorial (dates, parcours, galerie) depuis Firestore
// (projet admin-rylix, lecture publique) et génère src/lib/content.generated.ts.
//
// Lancé automatiquement avant chaque `npm run build` / `npm run dev` (voir
// package.json), et manuellement via `npm run content`.
//
// Utilise l'API REST Firestore en lecture anonyme (autorisée par les règles
// de sécurité du projet) : aucune clé, aucun SDK Firebase nécessaire ici —
// ce script ne tourne jamais dans le navigateur.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'admin-rylix'
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

function fromFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue
  if (value.integerValue !== undefined) return Number(value.integerValue)
  if (value.doubleValue !== undefined) return value.doubleValue
  if (value.booleanValue !== undefined) return value.booleanValue
  if (value.nullValue !== undefined) return null
  if (value.mapValue !== undefined) return fromFirestoreFields(value.mapValue.fields ?? {})
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values ?? []).map(fromFirestoreValue)
  }
  return null
}

function fromFirestoreFields(fields) {
  const out = {}
  for (const [key, value] of Object.entries(fields ?? {})) {
    out[key] = fromFirestoreValue(value)
  }
  return out
}

async function fetchCollection(collectionId, orderBy) {
  const url = new URL(`${BASE_URL}/${collectionId}`)
  if (orderBy) url.searchParams.set('orderBy', orderBy)

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Firestore a répondu ${res.status} pour la collection "${collectionId}"`)
  }
  const data = await res.json()
  return (data.documents ?? []).map((doc) => fromFirestoreFields(doc.fields))
}

/** Ne garde que les champs connus, et omet les champs optionnels vides. */
function pick(obj, keys) {
  const out = {}
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') out[key] = obj[key]
  }
  return out
}

async function main() {
  let tourDates = []
  let parcours = []
  let gallery = []

  try {
    const [datesRaw, parcoursRaw, galerieRaw] = await Promise.all([
      fetchCollection('dates', 'date'),
      fetchCollection('parcours', 'createdAt desc'),
      fetchCollection('galerie', 'createdAt desc'),
    ])

    tourDates = datesRaw.map((d) => pick(d, ['date', 'city', 'venue', 'ticketUrl']))
    parcours = parcoursRaw.map((p) => pick(p, ['title', 'role', 'location', 'period', 'url']))
    gallery = galerieRaw.map((g) => pick(g, ['key', 'alt', 'span']))
  } catch (err) {
    console.warn(
      `[fetch-firestore-content] Impossible de récupérer le contenu Firestore (${err.message}). ` +
        'Le site sera construit avec des listes vides pour dates/parcours/galerie.',
    )
  }

  const out = `// Généré par scripts/fetch-firestore-content.mjs — ne pas éditer à la main.
// Régénérer avec : npm run content (automatique avant chaque build/dev).

import type { TourDate, ParcoursEntry, GalleryPhoto } from './content'

export const tourDates: TourDate[] = ${JSON.stringify(tourDates, null, 2)}

export const parcours: ParcoursEntry[] = ${JSON.stringify(parcours, null, 2)}

export const gallery: GalleryPhoto[] = ${JSON.stringify(gallery, null, 2)}
`

  const target = fileURLToPath(new URL('../src/lib/content.generated.ts', import.meta.url))
  writeFileSync(target, out)
  console.log(
    `[fetch-firestore-content] ${tourDates.length} date(s), ${parcours.length} entrée(s) parcours, ${gallery.length} photo(s) de galerie.`,
  )
}

main()
