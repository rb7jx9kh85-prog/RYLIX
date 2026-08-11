import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, type OrderByDirection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Écoute une collection Firestore en direct : le contenu affiché (dates,
 * parcours, galerie) reflète l'admin sans nouveau build du site.
 */
export function useFirestoreCollection<T>(
  collectionName: string,
  orderByField: string,
  orderDirection: OrderByDirection = 'asc',
): { items: T[]; loading: boolean } {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(orderByField, orderDirection))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((d) => d.data() as T))
        setLoading(false)
      },
      (err) => {
        console.warn(`[useFirestoreCollection] ${collectionName} : ${err.message}`)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [collectionName, orderByField, orderDirection])

  return { items, loading }
}
