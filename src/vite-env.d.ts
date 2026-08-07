/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL canonique du site en production, sans slash final. Ex. https://rylix.ch */
  readonly VITE_SITE_URL?: string
  /** Identifiant du formulaire Formspree (partie après /f/). Public, pas un secret. */
  readonly VITE_FORMSPREE_ID?: string
  /** Adresse de contact affichée en repli. Optionnelle. */
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
