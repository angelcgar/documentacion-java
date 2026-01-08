---
title: Gestión de dependencias
description: Cómo gestionar dependencias en proyectos Java
---

## ¿Qué son las dependencias?

Las dependencias son bibliotecas externas que tu proyecto necesita. En lugar de copiar JARs manualmente, Maven/Gradle las descargan automáticamente.

---

## Repositorios

### Maven Central

El repositorio por defecto. Contiene la mayoría de bibliotecas open source.

- URL: [search.maven.org](https://search.maven.org/)
- No requiere configuración

### JCenter (obsoleto)

Repositorio de Bintray. **Ya no se mantiene**. Migra a Maven Central.

### Repositorios personalizados

Empresas suelen tener repositorios propios (Nexus, Artifactory).

**Maven**:

```xml
<repositories>
    <repository>
        <id>empresa-repo</id>
        <url>https://repo.empresa.com/maven</url>
    </repository>
</repositories>
```

**Gradle**:

```groovy
repositories {
    maven {
        url 'https://repo.empresa.com/maven'
    }
}
```

---

## Declarar dependencias

### Maven

```xml
<dependencies>
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
        <version>32.1.3-jre</version>
    </dependency>
</dependencies>
```

### Gradle

```groovy
dependencies {
    implementation 'com.google.guava:guava:32.1.3-jre'
}
```

---

## Scopes / Configuraciones

### Maven scopes

- **compile** (default): Siempre disponible
- **provided**: Proporcionado por el entorno (ej: servlets)
- **runtime**: Solo en ejecución
- **test**: Solo para tests
- **system**: Dependencia local (evitar)

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

### Gradle configuraciones

- **implementation**: Compile y runtime (no transitiva)
- **api**: Compile y runtime (transitiva)
- **compileOnly**: Solo compile
- **runtimeOnly**: Solo runtime
- **testImplementation**: Solo tests

```groovy
dependencies {
    implementation 'com.google.gson:gson:2.10.1'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}
```

---

## Dependencias transitivas

Si `A` depende de `B`, y `B` depende de `C`, entonces `A` también obtiene `C` (transitivamente).

```
Tu proyecto → Jackson → jackson-core
                     → jackson-databind
```

Ver el árbol de dependencias:

**Maven**:

```bash
mvn dependency:tree
```

**Gradle**:

```bash
gradle dependencies
```

---

## Conflictos de versiones

### Problema

```
Tu proyecto → Biblioteca A → Guava 30.0
           → Biblioteca B → Guava 32.0
```

¿Qué versión se usa?

**Maven**: La más cercana en el árbol (o la primera declarada).

**Gradle**: La versión más reciente por defecto.

### Solución: Forzar versión

**Maven**:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>32.1.3-jre</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**Gradle**:

```groovy
configurations.all {
    resolutionStrategy {
        force 'com.google.guava:guava:32.1.3-jre'
    }
}
```

---

## Excluir dependencias

Si no necesitas una dependencia transitiva:

**Maven**:

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>biblioteca</artifactId>
    <version>1.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

**Gradle**:

```groovy
dependencies {
    implementation('com.example:biblioteca:1.0') {
        exclude group: 'org.slf4j', module: 'slf4j-api'
    }
}
```

---

## Versionado

### Semantic Versioning

`MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones compatibles

Ejemplo: `2.5.3`

### Rangos de versiones

**Maven**:

```xml
<version>[1.0,2.0)</version>  <!-- 1.0 ≤ versión < 2.0 -->
<version>[1.0,)</version>     <!-- versión ≥ 1.0 -->
```

**Gradle**:

```groovy
implementation 'com.example:biblioteca:1.+'  // Última 1.x
implementation 'com.example:biblioteca:latest.release'
```

**Cuidado**: Rangos dinámicos pueden causar builds no reproducibles. Usa versiones fijas.

---

## BOM (Bill of Materials)

Para gestionar versiones de múltiples dependencias relacionadas.

**Maven**:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.2.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Ahora no necesitas especificar versiones de Spring:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**Gradle**:

```groovy
dependencies {
    implementation platform('org.springframework.boot:spring-boot-dependencies:3.2.0')
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

---

## Dependencias locales

### Archivo JAR local

**Maven**:

```xml
<dependency>
    <groupId>com.empresa</groupId>
    <artifactId>biblioteca-local</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/libs/biblioteca.jar</systemPath>
</dependency>
```

**Gradle**:

```groovy
dependencies {
    implementation files('libs/biblioteca.jar')
}
```

---

## Caché local

### Maven

`~/.m2/repository/` - Guarda todas las dependencias descargadas.

Limpiar:

```bash
mvn dependency:purge-local-repository
```

### Gradle

`~/.gradle/caches/` - Cache de dependencias y builds.

Limpiar:

```bash
gradle clean --no-build-cache
rm -rf ~/.gradle/caches/
```

---

## Análisis de dependencias

### Ver dependencias obsoletas

**Maven**:

```bash
mvn versions:display-dependency-updates
```

**Gradle**:

```bash
gradle dependencyUpdates
```

(Requiere plugin: `com.github.ben-manes.versions`)

### Detectar vulnerabilidades

**OWASP Dependency-Check**:

**Maven**:

```bash
mvn org.owasp:dependency-check-maven:check
```

**Gradle**:

```groovy
plugins {
    id 'org.owasp.dependencycheck' version '8.4.0'
}
```

```bash
gradle dependencyCheckAnalyze
```

---

## Buenas prácticas

1. **Usa versiones fijas**: Evita `LATEST` o rangos dinámicos.
2. **Mantén dependencias actualizadas**: Pero con cuidado, prueba antes de actualizar.
3. **Minimiza dependencias**: Solo agrega lo que realmente necesitas.
4. **Revisa dependencias transitivas**: Usa `dependency:tree` o `gradle dependencies`.
5. **Audita vulnerabilidades**: Usa herramientas como OWASP Dependency-Check.

---

## Próximo paso

Aprende sobre IDEs modernos para Java: [IDEs →](/herramientas/ides/)
