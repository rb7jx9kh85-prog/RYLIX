import { useEffect, useState } from 'react'

/**
 * Lit une collection publique Firestore (dates, parcours) via l'API REST, à
 * chaque chargement de page : le site reflète l'admin sans nouveau build.
 *
 * Pas de SDK Firebase ni de clé d'API côté client : les règles Firestore
 * autorisent déjà la lecture anonyme de ces collections, l'identifiant du
 * projet suffit pour les adresser.
 */
const DOCUMENTS_URL =
  'https://firestore.googleapis.com/v1/projects/admin-rylix/databases/(default)/documents'

type FirestoreValue = {
  stringValue?: string
  timestampValue?: string
  integerValue?: string
  doubleValue?: number
  booleanValue?: boolean
}

type FirestoreDocument = { fields?: Record<string, FirestoreValue> }

function decode(fields: Record<string, FirestoreValue> = {}) {
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(fields)) {
    if (value.stringValue !== undefined) out[key] = value.stringValue.trim()
    else if (value.timestampValue !== undefined) out[key] = value.timestampValue
    else if (value.integerValue !== undefined) out[key] = Number(value.integerValue)
    else if (value.doubleValue !== undefined) out[key] = value.doubleValue
    else if (value.booleanValue !== undefined) out[key] = value.booleanValue
  }
  return out
}

export function useFirestoreCollection<T>(
  collectionName: string,
  orderByField: string,
  orderDirection: 'asc' | 'desc' = 'asc'
): { items: T[]; loading: boolean } {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const orderBy = orderDirection === 'desc' ? `${orderByField} desc` : orderByField
    const url = `${DOCUMENTS_URL}/${collectionName}?pageSize=100&orderBy=${encodeURIComponent(orderBy)}`

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ documents?: FirestoreDocument[] }>
      })
      .then((body) => {
        setItems((body.documents ?? []).map((doc) => decode(doc.fields) as T))
        setLoading(false)
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return
        console.warn(`[useFirestoreCollection] ${collectionName} : ${err.message}`)
        setLoading(false)
      })

    return () => controller.abort()
  }, [collectionName, orderByField, orderDirection])

  return { items, loading }
}
