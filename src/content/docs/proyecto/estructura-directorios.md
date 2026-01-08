---
title: Estructura de directorios
description: Estructura estándar de directorios en proyectos Java
---

## Estructura estándar (Maven/Gradle)

```
mi-proyecto/
├── src/
│   ├── main/
│   │   ├── java/              # Código fuente
│   │   │   └── com/empresa/proyecto/
│   │   ├── resources/         # Recursos (configs, archivos estáticos)
│   │   └── webapp/            # Archivos web (solo proyectos web)
│   └── test/
│       ├── java/              # Tests
│       └── resources/         # Recursos para tests
├── target/                     # Compilados (Maven)
├── build/                      # Compilados (Gradle)
├── pom.xml                     # Maven
├── build.gradle                # Gradle
├── .gitignore
└── README.md
```

---

## src/main/java

Contiene todo el código fuente de producción.

```
src/main/java/
└── com/empresa/proyecto/
    ├── Main.java
    ├── config/
    │   └── AppConfig.java
    ├── modelo/
    │   ├── Usuario.java
    │   └── Pedido.java
    ├── servicio/
    │   ├── UsuarioServicio.java
    │   └── PedidoServicio.java
    ├── repositorio/
    │   └── UsuarioRepositorio.java
    └── util/
        └── StringUtil.java
```

---

## src/main/resources

Archivos de configuración y recursos no compilables.

```
src/main/resources/
├── application.properties      # Configuración principal
├── application-dev.properties  # Configuración para desarrollo
├── application-prod.properties # Configuración para producción
├── logback.xml                 # Configuración de logging
├── db/
│   ├── migration/              # Scripts de migración (Flyway)
│   │   ├── V1__crear_tablas.sql
│   │   └── V2__agregar_indices.sql
│   └── seed/                   # Datos iniciales
│       └── usuarios.sql
├── templates/                  # Plantillas (Thymeleaf, FreeMarker)
│   └── email.html
└── static/                     # Archivos estáticos (web)
    ├── css/
    ├── js/
    └── images/
```

---

## src/test/java

Tests unitarios y de integración.

```
src/test/java/
└── com/empresa/proyecto/
    ├── servicio/
    │   ├── UsuarioServicioTest.java
    │   └── PedidoServicioTest.java
    ├── repositorio/
    │   └── UsuarioRepositorioTest.java
    └── integracion/
        └── ApiIntegrationTest.java
```

Convención: misma estructura de packages que `main/java`, con sufijo `Test`.

---

## src/test/resources

Recursos para tests.

```
src/test/resources/
├── application-test.properties
├── test-data.sql
└── mocks/
    └── usuario-mock.json
```

---

## target/ o build/

Directorios generados automáticamente. **No subir a Git**.

### Maven (target/)

```
target/
├── classes/                    # .class compilados
├── test-classes/              # Tests compilados
├── mi-proyecto-1.0.jar        # JAR generado
└── surefire-reports/          # Reportes de tests
```

### Gradle (build/)

```
build/
├── classes/
├── libs/
│   └── mi-proyecto-1.0.jar
└── reports/
    └── tests/
```

---

## Archivos de configuración

### pom.xml (Maven)

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
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### build.gradle (Gradle)

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
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}

test {
    useJUnitPlatform()
}
```

---

## .gitignore

```gitignore
# Compilados
target/
build/
*.class
*.jar
*.war

# IDEs
.idea/
.vscode/
*.iml
*.ipr
*.iws

# Sistema operativo
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Configuración local
application-local.properties
```

---

## README.md

```markdown
# Mi Proyecto

Descripción breve del proyecto.

## Requisitos

- Java 21
- Maven 3.9+

## Compilar

```bash
mvn clean install
```

## Ejecutar

```bash
java -jar target/mi-proyecto-1.0.jar
```

## Tests

```bash
mvn test
```
```

---

## Proyecto web (Spring Boot)

```
mi-web-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/empresa/webapp/
│   │   │       ├── Application.java
│   │   │       ├── config/
│   │   │       ├── controlador/
│   │   │       ├── servicio/
│   │   │       ├── repositorio/
│   │   │       └── modelo/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── static/
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── images/
│   │       └── templates/
│   │           └── index.html
│   └── test/
├── pom.xml
└── README.md
```

---

## Proyecto multi-módulo

```
mi-aplicacion/
├── core/                       # Módulo de lógica de negocio
│   ├── src/
│   └── pom.xml
├── api/                        # Módulo de API REST
│   ├── src/
│   └── pom.xml
├── web/                        # Módulo web
│   ├── src/
│   └── pom.xml
├── common/                     # Utilidades compartidas
│   ├── src/
│   └── pom.xml
├── pom.xml                     # POM padre
└── README.md
```

`pom.xml` padre:

```xml
<project>
    <groupId>com.empresa</groupId>
    <artifactId>mi-aplicacion</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>common</module>
        <module>core</module>
        <module>api</module>
        <module>web</module>
    </modules>
</project>
```

---

## Buenas prácticas

1. **Sigue la estructura estándar**: Facilita que otros entiendan tu proyecto.

2. **No mezcles src y bin/target**: Usa las carpetas de compilados generadas.

3. **Separa tests de producción**: `src/main` vs `src/test`.

4. **Configura .gitignore**: No subas `target/`, `build/`, o archivos del IDE.

5. **README claro**: Instrucciones de compilación, ejecución y contribución.

---

## Próximo paso

Entiende cómo funciona la JVM: [¿Qué es la JVM? →](/jvm/que-es/)
