import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// import markdoc from '@astrojs/markdoc';

// import service from 'astro/assets/services/squoosh';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Documentación de Java',
      customCss: ['./src/styles/css-reset-2024.css'],
      locales: {
        root: {
          label: "Español",
          lang: "es"
        }
      },
      sidebar: [
        {
          label: 'Introducción',
          items: [
            {
              label: 'Bienvenida',
              link: '/introduccion/bienvenida/'
            },
            {
              label: 'Instalación',
              link: '/introduccion/instalacion/'
            },
            {
              label: 'Primer programa',
              link: '/introduccion/primer-programa/'
            }
          ]
        },
        {
          label: 'Fundamentos del Lenguaje',
          items: [
            {
              label: 'Sintaxis básica',
              link: '/fundamentos/sintaxis-basica/'
            },
            {
              label: 'Tipos de datos',
              link: '/fundamentos/tipos-datos/'
            },
            {
              label: 'Control de flujo',
              link: '/fundamentos/control-flujo/'
            },
            {
              label: 'Programación orientada a objetos',
              link: '/fundamentos/poo/'
            },
            {
              label: 'Excepciones',
              link: '/fundamentos/excepciones/'
            },
            {
              label: 'Colecciones',
              link: '/fundamentos/colecciones/'
            },
            {
              label: 'Streams y programación funcional',
              link: '/fundamentos/streams/'
            }
          ]
        },
        {
          label: 'Estructura de un Proyecto',
          items: [
            {
              label: 'Organización de código',
              link: '/proyecto/organizacion/'
            },
            {
              label: 'Packages y módulos',
              link: '/proyecto/packages-modulos/'
            },
            {
              label: 'Estructura de directorios',
              link: '/proyecto/estructura-directorios/'
            }
          ]
        },
        {
          label: 'JVM y Cómo Funciona',
          items: [
            {
              label: '¿Qué es la JVM?',
              link: '/jvm/que-es/'
            },
            {
              label: 'Compilación y ejecución',
              link: '/jvm/compilacion/'
            },
            {
              label: 'Garbage Collection',
              link: '/jvm/garbage-collection/'
            },
            {
              label: 'Optimización y rendimiento',
              link: '/jvm/optimizacion/'
            }
          ]
        },
        {
          label: 'Herramientas y Dependencias',
          items: [
            {
              label: 'Maven',
              link: '/herramientas/maven/'
            },
            {
              label: 'Gradle',
              link: '/herramientas/gradle/'
            },
            {
              label: 'Gestión de dependencias',
              link: '/herramientas/dependencias/'
            },
            {
              label: 'IDEs modernos',
              link: '/herramientas/ides/'
            }
          ]
        },
        {
          label: 'Buenas Prácticas',
          items: [
            {
              label: 'Convenciones de código',
              link: '/practicas/convenciones/'
            },
            {
              label: 'Patrones de diseño comunes',
              link: '/practicas/patrones/'
            },
            {
              label: 'Errores comunes en Java',
              link: '/practicas/errores-comunes/'
            },
            {
              label: 'Clean Code en Java',
              link: '/practicas/clean-code/'
            }
          ]
        },
        {
          label: 'Testing en Java',
          items: [
            {
              label: 'Introducción al testing',
              link: '/testing/introduccion/'
            },
            {
              label: 'JUnit',
              link: '/testing/junit/'
            },
            {
              label: 'Mockito',
              link: '/testing/mockito/'
            },
            {
              label: 'Testing de integración',
              link: '/testing/integracion/'
            }
          ]
        },
        {
          label: 'Java en Backend Moderno',
          items: [
            {
              label: 'Spring Boot',
              link: '/backend/spring-boot/'
            },
            {
              label: 'APIs REST',
              link: '/backend/rest-apis/'
            },
            {
              label: 'Bases de datos',
              link: '/backend/bases-datos/'
            },
            {
              label: 'Arquitectura moderna',
              link: '/backend/arquitectura/'
            }
          ]
        },
        {
          label: 'Kotlin Multiplatform',
          items: [
            {
              label: '¿Qué es KMP?',
              link: '/kmp/que-es/'
            },
            {
              label: 'KMP para desarrolladores Java',
              link: '/kmp/para-java-devs/'
            },
            {
              label: 'Cuándo usar KMP',
              link: '/kmp/cuando-usar/'
            }
          ]
        }
      ],
      social: {
        github: 'https://github.com/angelcgar/documentacion-java'
      },
      // pagefind: true,
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: '/favicon.svg',
          }
        }
      ]
    }),
  ],
  trailingSlash: 'always',
  scopedStyleStrategy: 'where',
  compressHTML: true,
  markdown: {
    smartypants: false
  },
  // image: {service: sharpImageService()},
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
