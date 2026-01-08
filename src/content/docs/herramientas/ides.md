---
title: IDEs modernos para Java
description: Entornos de desarrollo integrados para programar en Java
---

## ¿Qué es un IDE?

Un IDE (Integrated Development Environment) es un editor avanzado con herramientas integradas:

- Autocompletado inteligente
- Refactoring automático
- Debugging visual
- Integración con build tools (Maven/Gradle)
- Control de versiones (Git)

---

## IntelliJ IDEA

El IDE más popular para Java.

### Versiones

**Community**: Gratuita, open source. Suficiente para la mayoría.

**Ultimate**: De pago. Incluye:

- Soporte para Spring, Jakarta EE
- Herramientas de bases de datos
- Profiler integrado
- Soporte para JavaScript frameworks

### Instalación

**Linux**:

```bash
# Snap
sudo snap install intellij-idea-community --classic

# O descarga desde jetbrains.com
```

**macOS**:

```bash
brew install --cask intellij-idea-ce
```

**Windows**: Descarga desde [jetbrains.com/idea](https://www.jetbrains.com/idea/)

### Atajos útiles

| Acción           | Windows/Linux      | macOS         |
| ---------------- | ------------------ | ------------- |
| Buscar archivo   | `Ctrl+Shift+N`     | `Cmd+Shift+O` |
| Buscar clase     | `Ctrl+N`           | `Cmd+O`       |
| Buscar símbolo   | `Ctrl+Alt+Shift+N` | `Cmd+Alt+O`   |
| Autocompletar    | `Ctrl+Space`       | `Ctrl+Space`  |
| Refactorizar     | `Ctrl+Alt+Shift+T` | `Ctrl+T`      |
| Formatear código | `Ctrl+Alt+L`       | `Cmd+Alt+L`   |
| Renombrar        | `Shift+F6`         | `Shift+F6`    |
| Ejecutar         | `Shift+F10`        | `Ctrl+R`      |
| Debug            | `Shift+F9`         | `Ctrl+D`      |

---

## Eclipse

IDE clásico, gratuito y open source.

### Instalación

Descarga desde [eclipse.org](https://www.eclipse.org/downloads/)

Elige "Eclipse IDE for Java Developers".

### Ventajas

- Completamente gratuito
- Ecosistema maduro de plugins
- Liviano comparado con IntelliJ

### Desventajas

- UI menos moderna
- Autocompletado menos inteligente
- Configuración más manual

---

## Visual Studio Code

Editor ligero con extensiones para Java.

### Instalación

Descarga desde [code.visualstudio.com](https://code.visualstudio.com/)

### Extensiones esenciales

1. **Extension Pack for Java** (Microsoft)
   - Language Server
   - Debugger
   - Test Runner
   - Maven/Gradle support

2. **Spring Boot Extension Pack** (opcional, si usas Spring)

### Instalación de extensiones

1. Abre VS Code
2. `Ctrl+Shift+X` → Busca "Extension Pack for Java"
3. Instala

### ¿Cuándo usar VS Code?

- Proyectos pequeños
- Si ya usas VS Code para otros lenguajes
- Recursos limitados (menos RAM que IntelliJ/Eclipse)

---

## NetBeans

IDE oficial de Oracle, gratuito.

### Instalación

Descarga desde [netbeans.apache.org](https://netbeans.apache.org/)

### Ventajas

- Excelente soporte para Maven
- Herramientas de GUI (Swing)
- Profiler integrado

Menos usado que IntelliJ o Eclipse actualmente.

---

## Comparación

| IDE           | Costo                               | Popularidad | Facilidad | Rendimiento |
| ------------- | ----------------------------------- | ----------- | --------- | ----------- |
| IntelliJ IDEA | Community gratis / Ultimate de pago | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐      | ⭐⭐⭐⭐        |
| Eclipse       | Gratis                              | ⭐⭐⭐⭐        | ⭐⭐⭐       | ⭐⭐⭐⭐        |
| VS Code       | Gratis                              | ⭐⭐⭐         | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐       |
| NetBeans      | Gratis                              | ⭐⭐          | ⭐⭐⭐       | ⭐⭐⭐         |

---

## Recomendación

### Para desarrollo profesional

**IntelliJ IDEA Community**: Mejor experiencia, autocompletado inteligente, refactoring poderoso.

### Para principiantes

**VS Code**: Más simple, menos abrumador.

### Para proyectos corporativos legacy

**Eclipse**: Aún muy usado en empresas establecidas.

---

## Características esenciales

### Autocompletado inteligente

Sugiere métodos, clases y variables relevantes.

```java
String texto = "Hola";
texto.  // Aparece lista de métodos: length(), toUpperCase(), etc.
```

### Refactoring

**Renombrar**: Cambia el nombre de una variable/método en todo el proyecto.

**Extraer método**: Convierte código seleccionado en un método.

**Cambiar firma**: Modifica parámetros de un método y actualiza todas las llamadas.

### Debugging

- Breakpoints: Detén la ejecución en una línea
- Step Over: Siguiente línea
- Step Into: Entra en un método
- Inspeccionar variables: Ve valores en tiempo real

### Integración con build tools

Ejecuta comandos Maven/Gradle desde el IDE:

- `mvn clean install`
- `gradle build`

### Control de versiones

Git integrado:

- Commit
- Push/Pull
- Ver diferencias
- Resolver conflictos

---

## Plugins útiles

### IntelliJ IDEA

- **Lombok**: Genera getters/setters automáticamente
- **SonarLint**: Detecta code smells
- **Rainbow Brackets**: Colores para brackets anidados
- **GitToolBox**: Mejoras para Git

### VS Code

- **Checkstyle**: Verifica estilo de código
- **Java Test Runner**: Ejecuta tests unitarios
- **Spring Boot Dashboard**: Gestiona aplicaciones Spring

---

## Configuración recomendada

### IntelliJ IDEA

1. **File → Settings → Editor → General → Auto Import**
   - Marca "Add unambiguous imports on the fly"
   - Marca "Optimize imports on the fly"

2. **File → Settings → Editor → Code Style → Java**
   - Tab size: 4
   - Indent: 4
   - Continuation indent: 8

3. **File → Settings → Build, Execution, Deployment → Compiler**
   - Marca "Build project automatically"

---

## Próximo paso

Aprende buenas prácticas para escribir código limpio: [Convenciones de código →](/practicas/convenciones/)
