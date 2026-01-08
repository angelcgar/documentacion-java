---
title: Packages y módulos
description: Sistema de packages y módulos en Java
---

## Packages

Los packages organizan clases relacionadas y evitan conflictos de nombres.

### Declarar un package

```java
package com.empresa.proyecto.modelo;

public class Usuario {
    // clase Usuario en el package especificado
}
```

### Estructura de directorios

```
src/main/java/
└── com/
    └── empresa/
        └── proyecto/
            └── modelo/
                └── Usuario.java
```

El package `com.empresa.proyecto.modelo` corresponde al directorio `com/empresa/proyecto/modelo/`.

---

## Import

### Import específico

```java
import java.util.List;
import java.util.ArrayList;

public class Ejemplo {
    List<String> lista = new ArrayList<>();
}
```

### Import con wildcard

```java
import java.util.*;  // Importa todas las clases de java.util

public class Ejemplo {
    List<String> lista = new ArrayList<>();
    Map<String, Integer> mapa = new HashMap<>();
}
```

**Nota**: El wildcard no importa subpackages. `java.util.*` no importa `java.util.stream.*`.

### Import static

Para importar miembros estáticos:

```java
import static java.lang.Math.PI;
import static java.lang.Math.pow;

public class Circulo {
    public double area(double radio) {
        return PI * pow(radio, 2);  // Sin Math.PI y Math.pow
    }
}
```

---

## Packages estándar

### java.lang

Se importa automáticamente. Contiene:

- `String`, `Object`, `System`
- `Integer`, `Double`, `Boolean` (wrappers)
- `Math`
- `Thread`
- Excepciones básicas

```java
// No necesita import
String texto = "Hola";
System.out.println(texto);
```

### java.util

Colecciones y utilidades:

```java
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
```

### java.io

Entrada/salida:

```java
import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
```

### java.nio

I/O moderno (New I/O):

```java
import java.nio.file.Path;
import java.nio.file.Files;
```

---

## Java Module System (JPMS)

Introducido en Java 9 para organizar aplicaciones grandes.

### ¿Qué es un módulo?

Un módulo es un grupo de packages relacionados con dependencias explícitas.

### module-info.java

Define un módulo:

```java
module com.empresa.proyecto {
    // Exporta packages (visibles para otros módulos)
    exports com.empresa.proyecto.api;
    exports com.empresa.proyecto.modelo;

    // Requiere otros módulos
    requires java.sql;
    requires java.logging;

    // Requiere módulos transitivos
    requires transitive java.desktop;

    // Abre packages para reflexión (frameworks)
    opens com.empresa.proyecto.modelo to com.fasterxml.jackson.databind;
}
```

### Estructura con módulos

```
mi-proyecto/
├── src/
│   ├── module-info.java
│   └── com/empresa/proyecto/
│       ├── Main.java
│       ├── api/
│       └── modelo/
└── pom.xml
```

---

## Visibilidad con módulos

### Sin módulos (classpath)

- `public`: visible para todo
- `protected`: package + subclases
- default: solo el package
- `private`: solo la clase

### Con módulos (module path)

Un package solo es visible si está **exportado** en `module-info.java`:

```java
module com.empresa.proyecto {
    exports com.empresa.proyecto.api;  // ✅ Visible
    // com.empresa.proyecto.interno NO exportado ❌ No visible fuera del módulo
}
```

---

## Módulos estándar

Java SE se divide en módulos:

- `java.base`: Módulo base (se incluye automáticamente)
- `java.sql`: JDBC
- `java.xml`: XML
- `java.logging`: Logging
- `java.desktop`: AWT, Swing

Ver todos los módulos:

```bash
java --list-modules
```

---

## Unnamed Module

Código sin `module-info.java` se ejecuta en el "unnamed module". Puede leer todos los módulos pero no puede ser leído por módulos nombrados.

---

## Multi-module projects

Proyecto dividido en múltiples módulos:

```
mi-aplicacion/
├── core/
│   ├── src/
│   │   ├── module-info.java
│   │   └── com/empresa/core/
│   └── pom.xml
├── api/
│   ├── src/
│   │   ├── module-info.java
│   │   └── com/empresa/api/
│   └── pom.xml
└── web/
    ├── src/
    │   ├── module-info.java
    │   └── com/empresa/web/
    └── pom.xml
```

`api/module-info.java`:

```java
module com.empresa.api {
    requires com.empresa.core;  // Depende del módulo core
    exports com.empresa.api;
}
```

---

## Buenas prácticas

1. **Usa packages significativos**: `com.empresa.proyecto.usuario`, no `com.empresa.proyecto.package1`.

2. **Evita dependencias cíclicas entre packages**.

3. **No uses el package por defecto** (sin declaración de package).

4. **Imports específicos sobre wildcards** (más claro).

5. **Módulos solo para proyectos grandes**: Proyectos pequeños no los necesitan.

---

## Próximo paso

Aprende sobre la estructura de directorios de un proyecto Java: [Estructura de directorios →](/proyecto/estructura-directorios/)
