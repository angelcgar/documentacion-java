import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'Documentación de Java',
    social: {
      github: 'https://github.com/angelcgar/documentacion-java'
    },
    sidebar: [{
      label: 'Empieza aqui',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Introducción',
        link: '/guides/introduction/'
      }, {
        label: 'Instalacion',
        link: '/guides/install/'
      }, {
        label: 'Instalación',
        link: '/guides/example/'
      }]
    }, {
      label: 'Reference',
      autogenerate: {
        directory: 'reference'
      }
    }],
    locales: {
      root: {
        label: "Español",
        lang: "es"
      }
    },
    customCss: ['./src/styles/css-reset-2024.css', './src/tailwind.css'],
  }), markdoc(), tailwind({applyBaseStyles: false})],
  experimental: {
    security: {
      csrfProtection: {
        origin: true
      }
    }
  }
});
