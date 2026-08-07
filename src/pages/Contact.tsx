import { useState, type FormEvent } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { SocialLinks } from '@/components/SocialLinks'
import { contactEmail, formspreeEndpoint } from '@/lib/content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const configured = formspreeEndpoint !== ''

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!configured) return
    const form = e.currentTarget
    const data = new FormData(form)

    // Champ piège anti-spam : rempli uniquement par les robots.
    if (data.get('_gotcha')) return

    setStatus('sending')
    setError('')

    try {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null
        throw new Error(body?.errors?.[0]?.message ?? "L'envoi a échoué.")
      }

      form.reset()
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : "L'envoi a échoué.")
    }
  }

  const field =
    'w-full rounded-sm border border-slate/40 bg-navy-alt px-4 py-3 text-cream placeholder:text-fg-muted/40 transition-colors duration-200 ease-rylix focus:border-pale focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <>
      <Seo
        title="Contact"
        description="Contacter RYLIX — bookings, collaborations, presse. Instagram, TikTok, YouTube, Spotify."
      />

      <PageHeader eyebrow="Contact" title="Écrire">
        <p>Bookings, collaborations, presse.</p>
      </PageHeader>

      <section className="container-rylix pb-lg md:pb-xl">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Formulaire */}
          <Reveal className="md:col-span-7">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="label">
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  disabled={!configured}
                  className={field}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={!configured}
                  className={field}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  disabled={!configured}
                  className={`${field} resize-y`}
                />
              </div>

              {/* Honeypot — masqué visuellement et pour les lecteurs d'écran */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  className="btn"
                  disabled={!configured || status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi…' : 'Envoyer'}
                </button>

                <p aria-live="polite" className="text-sm">
                  {status === 'sent' && <span className="text-accent">Message envoyé.</span>}
                  {status === 'error' && <span className="text-pale">{error}</span>}
                </p>
              </div>
            </form>

            {!configured && (
              <p className="mt-6 text-sm text-fg-muted/70">
                Formulaire momentanément indisponible — écrire via les réseaux.
                {import.meta.env.DEV && (
                  <span className="mt-2 block text-pale/70">
                    (dev : définir <code>VITE_FORMSPREE_ID</code> pour l'activer)
                  </span>
                )}
              </p>
            )}

            {contactEmail && (
              <p className="mt-8 text-sm text-fg-muted/70">
                Ou par email :{' '}
                <a href={`mailto:${contactEmail}`} className="link-quiet">
                  {contactEmail}
                </a>
              </p>
            )}
          </Reveal>

          {/* Réseaux */}
          <Reveal delay={0.08} className="md:col-span-5">
            <h2 className="label mb-4">Réseaux</h2>
            <SocialLinks variant="list" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
