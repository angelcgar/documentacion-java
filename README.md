# 📚 Documentación Moderna de Java

> Guía completa de Java en español para la comunidad hispanohablante. Desde fundamentos hasta arquitecturas modernas de backend.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Starlight](https://img.shields.io/badge/Starlight-Docs-blueviolet)](https://starlight.astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- **Español neutro y profesional**: Sin jerga regional, accesible para toda la comunidad hispana
- **Java moderno**: Enfocado en Java 17 y 21 (versiones LTS)
- **Práctico, no teórico**: Ejemplos reales con código ejecutable
- **No solo para principiantes**: Desde fundamentos hasta arquitecturas avanzadas
- **Ejemplos comparativos**: Código incorrecto ❌ vs correcto ✅
- **Temas actuales**: Spring Boot, REST APIs, Testing, Microservicios
- **Kotlin Multiplatform**: Capítulo complementario para explorar KMP

## 📖 Contenido

### 1. Introducción
- Bienvenida y contexto
- Instalación en Linux, Windows y macOS
- Tu primer programa en Java

### 2. Fundamentos del Lenguaje
- Sintaxis básica y operadores
- Tipos de datos (primitivos y objetos)
- Control de flujo (if, switch, loops)
- Programación Orientada a Objetos
- Manejo de excepciones
- Colecciones (List, Set, Map)
- Streams y programación funcional

### 3. Estructura de un Proyecto
- Organización del código por capas
- Packages y módulos (JPMS)
- Estructura de directorios (Maven/Gradle)

### 4. JVM y Cómo Funciona
- Arquitectura de la JVM
- Compilación y bytecode
- Garbage Collection
- Optimización y rendimiento

### 5. Herramientas y Dependencias
- Maven: pom.xml, ciclo de vida, plugins
- Gradle: build scripts, Kotlin DSL
- Gestión de dependencias
- IDEs modernos (IntelliJ, VS Code, Eclipse)

### 6. Buenas Prácticas
- Convenciones de código
- Patrones de diseño (Singleton, Factory, Builder, etc.)
- Errores comunes y cómo evitarlos
- Clean Code y principios SOLID

### 7. Testing en Java
- Introducción al testing (unitarios, integración, E2E)
- JUnit 5: assertions, lifecycle, tests parametrizados
- Mockito: mocks, stubs, verificaciones
- Tests de integración con Spring Boot y TestContainers

### 8. Java en Backend Moderno
- Spring Boot: configuración, inyección de dependencias
- REST APIs: endpoints, validación, manejo de errores
- Bases de datos: JPA, Hibernate, Spring Data
- Arquitectura: capas, DTOs, microservicios

### 9. Kotlin Multiplatform
- Introducción a KMP (complemento, no foco principal)
- KMP para desarrolladores Java
- Cuándo usar KMP vs Java puro

## 🚀 Desarrollo Local

### Requisitos

- **Node.js**: v18+ o v20+
- **pnpm**: v10.0.0 (o npm/yarn)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/angelcgar/documentacion-java.git
cd documentacion-java

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev             # Servidor de desarrollo con hot reload

# Producción
pnpm build           # Compilar para producción
pnpm preview         # Previsualizar build de producción

# Calidad de código
pnpm astro check     # Verificar errores en Astro
```

## 🛠️ Stack Tecnológico

- **[Astro](https://astro.build)**: Framework estático rápido y moderno
- **[Starlight](https://starlight.astro.build)**: Tema de documentación de Astro
- **[TailwindCSS](https://tailwindcss.com)**: Utilidades CSS
- **[TypeScript](https://www.typescriptlang.org)**: Type safety
- **[MDX](https://mdxjs.com)**: Markdown con componentes React

## 📁 Estructura del Proyecto

```
documentacion-java/
├── src/
│   ├── content/
│   │   └── docs/              # Archivos de documentación (.md, .mdx)
│   │       ├── index.mdx      # Página principal
│   │       ├── introduccion/  # Sección de introducción
│   │       ├── fundamentos/   # Fundamentos de Java
│   │       ├── proyecto/      # Estructura de proyectos
│   │       ├── jvm/           # JVM y compilación
│   │       ├── herramientas/  # Maven, Gradle, IDEs
│   │       ├── practicas/     # Buenas prácticas
│   │       ├── testing/       # Testing con JUnit/Mockito
│   │       ├── backend/       # Spring Boot y APIs REST
│   │       └── kmp/           # Kotlin Multiplatform
│   ├── assets/                # Imágenes y recursos
│   ├── components/            # Componentes Astro/React
│   └── styles/                # Estilos globales
├── public/                    # Archivos estáticos
├── astro.config.mjs           # Configuración de Astro
├── package.json
└── tsconfig.json
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si encuentras errores, typos, o quieres mejorar el contenido:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/mejora-xyz`)
3. Commit tus cambios (`git commit -m 'Mejora en sección XYZ'`)
4. Push a la rama (`git push origin feature/mejora-xyz`)
5. Abre un Pull Request

### Guías de Contribución

- **Español neutro**: Evita regionalismos (usa "ordenador" o "computadora" de forma intercambiable, "aplicación" en vez de "app")
- **Código formateado**: Usa ejemplos con formato correcto y comentarios claros
- **Ejemplos prácticos**: Prefiere código ejecutable sobre teoría abstracta
- **Java moderno**: Enfócate en Java 17/21, menciona features antiguas solo si es relevante

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🌟 Reconocimientos

- [Astro](https://astro.build) por el framework increíble
- [Starlight](https://starlight.astro.build) por el tema de documentación
- La comunidad de Java hispanohablante

## 📬 Contacto

- **Autor**: Angel García
- **GitHub**: [@angelcgar](https://github.com/angelcgar)
- **Repositorio**: [documentacion-java](https://github.com/angelcgar/documentacion-java)

---

**⭐ Si esta documentación te resulta útil, considera darle una estrella al repositorio**
