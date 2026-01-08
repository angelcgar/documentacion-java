---
title: Gradle
description: Sistema de construcción moderno para proyectos Java
---

## ¿Qué es Gradle?

Gradle es una herramienta de build moderna y flexible. Es más rápido que Maven y usa Groovy o Kotlin DSL en lugar de XML.

---

## Instalación

### Linux/macOS

```bash
# Con SDKMAN
sdk install gradle

# macOS con Homebrew
brew install gradle

# Verificar
gradle -version
```

### Windows

Descarga desde [gradle.org](https://gradle.org/install/) o usa Chocolatey:

```powershell
choco install gradle
```

---

## build.gradle

Archivo de configuración en Groovy DSL.

### Básico

```groovy
plugins {
    id 'java'
}

group = 'com.empresa'
version = '1.0.0'

java {
    sourceCompatibility = '21'
    targetCompatibility = '21'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.guava:guava:32.1.3-jre'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}

test {
    useJUnitPlatform()
}
```

---

## build.gradle.kts (Kotlin DSL)

Alternativa con tipado fuerte:

```kotlin
plugins {
    java
}

group = "com.empresa"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.guava:guava:32.1.3-jre")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

tasks.test {
    useJUnitPlatform()
}
```

---

## Dependencias

### Configuraciones

```groovy
dependencies {
    // Disponible en compile y runtime
    implementation 'com.google.gson:gson:2.10.1'

    // Solo compile, no incluida en runtime
    compileOnly 'org.projectlombok:lombok:1.18.30'

    // Solo runtime
    runtimeOnly 'com.h2database:h2:2.2.224'

    // Solo tests
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}
```

### Excluir dependencias transitivas

```groovy
dependencies {
    implementation('com.example:biblioteca:1.0') {
        exclude group: 'org.slf4j', module: 'slf4j-api'
    }
}
```

---

## Comandos Gradle

### Listar tareas

```bash
gradle tasks
```

### Compilar

```bash
gradle build
```

Compila, ejecuta tests y genera JAR en `build/libs/`.

### Limpiar

```bash
gradle clean
```

### Ejecutar tests

```bash
gradle test
```

### Ejecutar aplicación

```bash
gradle run
```

Requiere plugin `application`:

```groovy
plugins {
    id 'application'
}

application {
    mainClass = 'com.empresa.Main'
}
```

### Build sin tests

```bash
gradle build -x test
```

---

## Gradle Wrapper

Wrapper incluye Gradle en el proyecto. No necesitas instalarlo globalmente.

### Generar wrapper

```bash
gradle wrapper
```

Genera:

```
gradlew         (script para Linux/macOS)
gradlew.bat     (script para Windows)
gradle/
  wrapper/
    gradle-wrapper.jar
    gradle-wrapper.properties
```

### Usar wrapper

```bash
./gradlew build
```

**Ventaja**: Todos los desarrolladores usan la misma versión de Gradle.

---

## Plugins

### Java

```groovy
plugins {
    id 'java'
}
```

### Application

```groovy
plugins {
    id 'application'
}

application {
    mainClass = 'com.empresa.Main'
}
```

### Shadow (Fat JAR)

Empaqueta todas las dependencias en un solo JAR:

```groovy
plugins {
    id 'com.github.johnrengelman.shadow' version '8.1.1'
}

shadowJar {
    archiveBaseName = 'mi-app'
    archiveVersion = '1.0.0'
    archiveClassifier = ''
}
```

Generar:

```bash
gradle shadowJar
```

---

## Multi-proyecto

```
mi-aplicacion/
├── settings.gradle
├── build.gradle
├── core/
│   └── build.gradle
└── web/
    └── build.gradle
```

`settings.gradle`:

```groovy
rootProject.name = 'mi-aplicacion'
include 'core', 'web'
```

`build.gradle` raíz:

```groovy
subprojects {
    apply plugin: 'java'

    repositories {
        mavenCentral()
    }

    java {
        sourceCompatibility = '21'
        targetCompatibility = '21'
    }
}
```

`web/build.gradle`:

```groovy
dependencies {
    implementation project(':core')
}
```

---

## Tareas personalizadas

```groovy
task hola {
    doLast {
        println 'Hola desde Gradle'
    }
}
```

Ejecutar:

```bash
gradle hola
```

Con parámetros:

```groovy
task saludar {
    doLast {
        println "Hola ${project.findProperty('nombre') ?: 'Mundo'}"
    }
}
```

```bash
gradle saludar -Pnombre=Juan
```

---

## Build cache

Acelera builds reutilizando salidas:

```groovy
buildCache {
    local {
        enabled = true
    }
}
```

O en la línea de comandos:

```bash
gradle build --build-cache
```

---

## Gradle vs Maven

| Aspecto              | Maven                          | Gradle                          |
| -------------------- | ------------------------------ | ------------------------------- |
| Configuración        | XML (pom.xml)                  | Groovy/Kotlin DSL               |
| Velocidad            | Más lento                      | Más rápido (incremental builds) |
| Flexibilidad         | Convención sobre configuración | Muy flexible                    |
| Curva de aprendizaje | Más simple                     | Más compleja                    |
| Popularidad          | Muy usado (legacy)             | Creciente (proyectos nuevos)    |

**Recomendación**: Maven para proyectos simples o corporativos. Gradle para proyectos modernos que necesitan flexibilidad.

---

## Buenas prácticas

1. **Usa Gradle Wrapper**: Commitea `gradlew` y `gradle/` al repositorio.
2. **Especifica versiones de plugins**.
3. **Aprovecha el build cache**.
4. **Usa Kotlin DSL para proyectos nuevos** (mejor autocompletado).

---

## Próximo paso

Aprende sobre gestión de dependencias: [Gestión de dependencias →](/herramientas/dependencias/)
