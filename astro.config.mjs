import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Documentación de Java',
      social: {
        github: 'https://github.com/angelcgar/documentacion-java',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              link: '/guides/example/',
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
      locales: {
        root: {
          label: "Español",
          lang: "es"
        }
      },
      customCss: [
        './src/styles/css-reset-2024.css'
      ]
    }),
    markdoc(),
  ],
});
