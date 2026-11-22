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

const MONTHS = [
  'janvier',
  'fevrier',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'aout',
  'septembre',
  'octobre',
  'novembre',
  'decembre',
]

/**
 * Rang chronologique d'une période saisie à la main dans l'admin (« Septembre
 * 2026 », « sept. 2026 », « Mars », « 2026 »), pour classer le parcours du plus
 * récent au plus ancien. Le mois s'écrit en toutes lettres ou abrégé (au moins
 * trois lettres, sans ambiguïté : « juil. » oui, « jui » non) ; sans année,
 * celle de l'ajout dans l'admin fait foi ; sans mois, l'entrée passe avant les
 * entrées datées de la même année.
 */
export function periodRank(period = '', createdAt?: string): number {
  const text = period
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  const addedIn = createdAt ? new Date(createdAt).getUTCFullYear() : NaN
  const year = Number(text.match(/\b(20\d{2})\b/)?.[1]) || addedIn || new Date().getUTCFullYear()

  let month = -1
  for (const word of text.match(/[a-z]{3,}/g) ?? []) {
    const matches = MONTHS.flatMap((name, i) => (name.startsWith(word) ? [i] : []))
    if (matches.length === 1) {
      month = matches[0]
      break
    }
  }
  return year * 12 + (month === -1 ? 11 : month)
}
