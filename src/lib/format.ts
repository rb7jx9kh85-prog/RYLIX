const dateFormatter = new Intl.DateTimeFormat('fr-CH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortFormatter = new Intl.DateTimeFormat('fr-CH', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
})

/** « 31 juillet 2026 » */
export function formatReleaseDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`))
}

/** « 29 août » — pour la liste des dates. */
export function formatShortDate(iso: string): string {
  return shortFormatter.format(new Date(`${iso}T00:00:00Z`)).replace('.', '')
}

export function getYear(iso: string): string {
  return iso.slice(0, 4)
}

/** Une date est passée dès le lendemain (comparaison en jours UTC). */
export function isUpcoming(iso: string, now: Date = new Date()): boolean {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return new Date(`${iso}T00:00:00Z`).getTime() >= today
}
