// Généré par scripts/optimize-images.mjs — ne pas éditer à la main.
// Régénérer avec : npm run images

export type GeneratedImage = {
  src: string
  srcSet: string
  width: number
  height: number
  placeholder: string
}

export const images = {
  'better-days-cover': {
    src: '/images/better-days-cover-1000.webp',
    srcSet: '/images/better-days-cover-480.webp 480w, /images/better-days-cover-768.webp 768w, /images/better-days-cover-1000.webp 1000w',
    width: 1000,
    height: 1000,
    placeholder: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQABAAA8BmJbACdAENUrhIoAD+5yGIbos8+PlpDU7ieTctV+cU/dvd08C48XDbjOxlBOEWQAA=',
  },
  'rylix-portrait-valais': {
    src: '/images/rylix-portrait-valais-1920.webp',
    srcSet: '/images/rylix-portrait-valais-480.webp 480w, /images/rylix-portrait-valais-768.webp 768w, /images/rylix-portrait-valais-1200.webp 1200w, /images/rylix-portrait-valais-1920.webp 1920w',
    width: 2624,
    height: 3936,
    placeholder: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAwCdASoQABgAPwlyr0+rpyQiMAgBcCEJQBYdg9CuxWiopKYC4AD8Wpm3lqhfe9y7jLss/wIYIpdDHfmbtwAA',
  },
} satisfies Record<string, GeneratedImage>

export type ImageKey = keyof typeof images
