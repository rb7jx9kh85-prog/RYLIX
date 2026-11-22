import type { Credit } from '@/lib/content'

/**
 * Nom d'un auteur, suivi de son studio ou de sa structure quand il y en a une.
 * Le lien est porté par la structure, pas par le nom de la personne.
 */
export function CreditName({ credit }: { credit: Credit }) {
  return (
    <>
      {credit.name}
      {credit.org && (
        <>
          ,{' '}
          <a href={credit.org.url} target="_blank" rel="noreferrer noopener" className="link-quiet">
            {credit.org.name}
          </a>
        </>
      )}
    </>
  )
}
