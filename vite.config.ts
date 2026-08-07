import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const ROUTES = ['/', '/musique', '/galerie', '/tournee', '/contact']

/**
 * Émet robots.txt et sitemap.xml dans dist/ à partir de VITE_SITE_URL, pour que
 * le domaine réel n'ait à être renseigné qu'à un seul endroit.
 */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'rylix-seo-files',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n'),
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...ROUTES.map((route) =>
            [
              '  <url>',
              `    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>`,
              `    <lastmod>${today}</lastmod>`,
              `    <priority>${route === '/' ? '1.0' : '0.7'}</priority>`,
              '  </url>',
            ].join('\n')
          ),
          '</urlset>',
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'https://rylix.ch').replace(/\/$/, '')

  return {
    plugins: [react(), seoFiles(siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})
