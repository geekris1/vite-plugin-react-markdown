import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'
import Shiki from 'markdown-it-shiki'
import anchor from 'markdown-it-anchor'
import TOC from 'markdown-it-table-of-contents'
import { slugify } from './src/slugify'
import Inspect from 'vite-plugin-inspect'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Markdown({
    wrapperClasses: 'vite-plugin-react-markdown-test',
    wrapperComponentPath: './src/components/wrapperComponent',
    wrapperComponent: true,
    markdownItSetup(md) {
      md.use(Shiki, {
        theme: {
          light: 'vitesse-light',
          dark: 'vitesse-dark',
        },
      })

      md.use(anchor, {
        slugify,
        permalink: anchor.permalink.linkInsideHeader({
          symbol: '#',
          renderAttrs: () => ({ 'aria-hidden': 'true' }),
        }),
      })

      md.use(TOC, {
        includeLevel: [1, 2, 3],
        slugify,
      })
    },
  }), Inspect(), react()],
})

