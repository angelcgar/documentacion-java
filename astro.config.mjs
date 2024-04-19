import { defineConfig, sharpImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';

import tailwind from "@astrojs/tailwind";
import service from 'astro/assets/services/squoosh';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Documentación de Java',
      customCss: ['./src/styles/css-reset-2024.css', './src/tailwind.css'],
      locales: {
        root: {
          label: "Español",
          lang: "es"
        }
      },
      sidebar: [
        {
          label: 'Empieza aqui',
          items: [
          // Each item here is one entry in the navigation menu.
          {
            label: 'Cómo empezar',
            link: '/guides/introduction/'
          }, {
            label: 'Instalación',
            link: '/guides/install/'
          }, {
            label: 'Instalación',
            link: '/guides/example/'
          }]
        },
        {
        label: 'Reference',
        autogenerate: {
          directory: 'reference'
        }
        }
      ],
      social: {
        github: 'https://github.com/angelcgar/documentacion-java'
      },
      pagefind: false,
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: '/favicon.svg',
          }
        }
      ]
    }), markdoc(), tailwind({applyBaseStyles: false})
  ],
  trailingSlash: 'always',
  scopedStyleStrategy: 'where',
  compressHTML: false,
  markdown: {
    smartypants: false
  },
  image: {service: sharpImageService()},
  experimental: {
    security: {
      csrfProtection: {
        origin: true
      }
    },
    contentCollectionCache: true,
    directRenderScript: true
  }
});
