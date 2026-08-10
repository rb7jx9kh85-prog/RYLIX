import { socials, type SocialName } from '@/lib/content'

const paths: Record<SocialName, string> = {
  Instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
  TikTok:
    'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.66a5.66 5.66 0 0 0-.77-.05A5.66 5.66 0 1 0 15.52 15V8.9a7.35 7.35 0 0 0 4.31 1.38V7.2a4.29 4.29 0 0 1-3.23-1.38Z',
  YouTube:
    'M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z',
  Spotify:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.21c3.81-.87 7.08-.5 9.72 1.11.29.18.38.56.21.85Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.36.23.48.71.25 1.07Zm.11-2.84C14.7 8.94 9.44 8.77 6.36 9.7a.93.93 0 1 1-.54-1.79c3.54-1.07 9.35-.87 13.03 1.32a.93.93 0 1 1-.95 1.6Z',
}

type Props = {
  /** `inline` : icônes discrètes (footer). `list` : icône + handle (page contact). */
  variant?: 'inline' | 'list'
  className?: string
}

export function SocialLinks({ variant = 'inline', className = '' }: Props) {
  if (variant === 'list') {
    return (
      <ul className={`flex flex-col ${className}`}>
        {socials.map((s) => (
          <li key={s.name} className="border-t border-slate/20 last:border-b">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-4 py-4 transition-colors duration-200 ease-rylix"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-5 w-5 shrink-0 fill-slate transition-all duration-300 ease-rylix
                           group-hover:fill-pale group-hover:scale-110"
              >
                <path d={paths[s.name]} />
              </svg>
              <span className="font-medium text-cream transition-colors duration-200 group-hover:text-pale">
                {s.name}
              </span>
              <span className="ml-auto font-sans text-sm text-fg-muted/70">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            className="block transition-transform duration-300 ease-rylix hover:-translate-y-0.5 hover:scale-110"
          >
            <span className="sr-only">
              {s.name} — {s.handle}
            </span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-[18px] w-[18px] fill-slate transition-colors duration-200 hover:fill-pale"
            >
              <path d={paths[s.name]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
