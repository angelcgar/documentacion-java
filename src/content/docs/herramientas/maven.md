---
title: Maven
description: Guía de Maven para gestión de proyectos Java
---

## ¿Qué es Maven?

Maven es una herramienta de gestión de proyectos que:

- **Gestiona dependencias**: Descarga automáticamente bibliotecas
- **Compila proyectos**: Estructura estándar de directorios
- **Ejecuta tests**: Integración con JUnit
- **Empaqueta aplicaciones**: Genera JARs, WARs
- **Gestiona el ciclo de vida**: Build, test, deploy

---

## Instalación

### Linux

```bash
# Ubuntu/Debian
sudo apt install maven

# Arch
sudo pacman -S maven

# Verificar
mvn -version
```

### macOS

```bash
brew install maven
```

### Windows

Descarga desde [maven.apache.org](https://maven.apache.org/download.cgi) y agrega al PATH.

---

## pom.xml

El archivo `pom.xml` (Project Object Model) configura el proyecto.

### POM básico

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.empresa</groupId>
    <artifactId>mi-proyecto</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

---

## Coordenadas Maven

Identifican una dependencia:

- **groupId**: Identifica la organización (`com.empresa`)
- **artifactId**: Nombre del proyecto (`mi-proyecto`)
- **version**: Versión (`1.0.0`)

Juntos forman: `com.empresa:mi-proyecto:1.0.0`

---

## Dependencias

### Agregar dependencia

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Scopes

- **compile** (por defecto): Disponible en compile, test y runtime
- **test**: Solo para tests
- **provided**: Proporcionado por el contenedor (ej: servlets)
- **runtime**: Solo en runtime, no en compile

### Buscar dependencias

[Maven Central](https://search.maven.org/) - Busca bibliotecas y obtén las coordenadas.

Ejemplo: Buscar "jackson" → Copiar dependencia:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

---

## Comandos Maven

### Limpiar

```bash
mvn clean
```

Elimina el directorio `target/`.

### Compilar

```bash
mvn compile
```

Compila el código fuente.

### Ejecutar tests

```bash
mvn test
```

### Empaquetar

```bash
mvn package
```

Genera JAR/WAR en `target/`.

### Instalar localmente

```bash
mvn install
```

Instala el artefacto en el repositorio local (`~/.m2/repository/`).

### Ciclo completo

```bash
mvn clean install
```

---

## Ciclo de vida

Maven tiene 3 ciclos:

### default

```
validate → compile → test → package → verify → install → deploy
```

### clean

```
pre-clean → clean → post-clean
```

### site

```
pre-site → site → post-site → site-deploy
```

Ejecutar una fase ejecuta todas las anteriores.

---

## Plugins

### Plugin de compilación

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>21</source>
                <target>21</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Plugin ejecutable

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
        <mainClass>com.empresa.Main</mainClass>
    </configuration>
</plugin>
```

Ejecutar:

```bash
mvn exec:java
```

### JAR ejecutable

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>com.empresa.Main</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

Genera JAR ejecutable:

```bash
mvn package
java -jar target/mi-proyecto-1.0.0.jar
```

---

## Perfiles

Para diferentes configuraciones (dev, test, prod):

```xml
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <env>development</env>
        </properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <env>production</env>
        </properties>
    </profile>
</profiles>
```

Activar:

```bash
mvn clean install -Pprod
```

---

## Gestión de versiones

### Properties

```xml
<properties>
    <junit.version>5.10.0</junit.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>${junit.version}</version>
    </dependency>
</dependencies>
```

### Dependency Management

En proyectos multi-módulo, centraliza versiones:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Los módulos hijos solo especifican groupId y artifactId.

---

## Repositorios

### Repositorio local

`~/.m2/repository/` - Maven guarda dependencias aquí.

### Maven Central

Repositorio por defecto. No necesita configuración.

### Repositorios personalizados

```xml
<repositories>
    <repository>
        <id>mi-repo</id>
        <url>https://repo.empresa.com/maven</url>
    </repository>
</repositories>
```

---

## Proyecto multi-módulo

```
mi-aplicacion/
├── pom.xml (padre)
├── core/
│   └── pom.xml
└── web/
    └── pom.xml
```

`pom.xml` padre:

```xml
<project>
    <groupId>com.empresa</groupId>
    <artifactId>mi-aplicacion</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>core</module>
        <module>web</module>
    </modules>
</project>
```

`core/pom.xml`:

```xml
<project>
    <parent>
        <groupId>com.empresa</groupId>
        <artifactId>mi-aplicacion</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>core</artifactId>
</project>
```

---

## Buenas prácticas

1. **Usa properties para versiones**: Facilita actualizaciones.
2. **No commitees target/**: Agrega a `.gitignore`.
3. **Especifica versiones exactas**: Evita sorpresas.
4. **Usa dependency management en multi-módulo**.
5. **Mantén pom.xml limpio**: Ordena dependencias alfabéticamente.

---

## Próximo paso

Aprende sobre Gradle: [Gradle →](/herramientas/gradle/)
