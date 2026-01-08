---
title: ¿Qué es la JVM?
description: Introducción a la Java Virtual Machine y su funcionamiento
---

## La Java Virtual Machine

La JVM (Java Virtual Machine) es el motor que ejecuta programas Java. Es la razón por la que Java es **"Write Once, Run Anywhere"** (escribe una vez, ejecuta en cualquier lugar).

---

## Cómo funciona Java

```
Código fuente (.java)
      ↓
   Compilador (javac)
      ↓
   Bytecode (.class)
      ↓
      JVM
      ↓
Instrucciones nativas del sistema operativo
```

### 1. Compilación

```bash
javac MiPrograma.java
```

El compilador `javac` convierte código Java en **bytecode** (`.class`), un formato intermedio independiente de la plataforma.

### 2. Ejecución

```bash
java MiPrograma
```

La JVM lee el bytecode y lo ejecuta.

---

## ¿Por qué bytecode?

El bytecode es un código intermedio que:

1. **Es independiente del sistema operativo**: El mismo `.class` funciona en Windows, Linux, macOS.
2. **Puede optimizarse en tiempo de ejecución**: La JVM analiza el código mientras se ejecuta y lo optimiza.
3. **Proporciona seguridad**: La JVM valida el bytecode antes de ejecutarlo.

---

## Componentes de la JVM

```
┌─────────────────────────────────────────┐
│           Java Virtual Machine          │
├─────────────────────────────────────────┤
│  Class Loader Subsystem                 │
│  (Carga clases .class)                  │
├─────────────────────────────────────────┤
│  Runtime Data Areas                     │
│  ┌──────────┬──────────┬──────────┐     │
│  │  Heap    │  Stack   │  Method  │     │
│  │  (objetos)│ (métodos)│  Area    │     │
│  └──────────┴──────────┴──────────┘     │
├─────────────────────────────────────────┤
│  Execution Engine                       │
│  ┌──────────┬──────────────────────┐    │
│  │Interpreter│  JIT Compiler        │    │
│  └──────────┴──────────────────────┘    │
├─────────────────────────────────────────┤
│  Garbage Collector                      │
│  (Gestión automática de memoria)        │
└─────────────────────────────────────────┘
```

### Class Loader

Carga clases en memoria cuando se necesitan, no todas al inicio.

```java
// La clase Usuario no se carga hasta que se usa
public void metodo() {
    Usuario usuario = new Usuario();  // Aquí se carga Usuario.class
}
```

### Runtime Data Areas

**Heap**: Memoria para objetos. Compartida entre todos los threads.

```java
Usuario usuario = new Usuario();  // Objeto creado en el heap
```

**Stack**: Pila de ejecución de cada thread. Almacena variables locales y llamadas a métodos.

```java
public void metodo() {
    int x = 5;  // Variable local en el stack
}
```

**Method Area**: Metadatos de clases (estructura, métodos, campos).

**Program Counter (PC)**: Instrucción actual del thread.

**Native Method Stack**: Para métodos nativos (código C/C++).

### Execution Engine

**Interpreter**: Ejecuta bytecode línea por línea (lento).

**JIT Compiler**: Compila bytecode a código nativo en tiempo de ejecución para partes del código que se ejecutan frecuentemente (rápido).

La JVM decide automáticamente qué código compilar con JIT basándose en análisis en tiempo de ejecución.

---

## JRE vs JDK

### JRE (Java Runtime Environment)

Para **ejecutar** aplicaciones Java. Incluye:

- JVM
- Bibliotecas estándar

### JDK (Java Development Kit)

Para **desarrollar** aplicaciones Java. Incluye:

- JRE (JVM + bibliotecas)
- Compilador (`javac`)
- Herramientas de desarrollo (debugger, `jar`, etc.)

```
┌──────────────────────────┐
│          JDK             │
│  ┌────────────────────┐  │
│  │       JRE          │  │
│  │  ┌──────────────┐  │  │
│  │  │     JVM      │  │  │
│  │  └──────────────┘  │  │
│  └────────────────────┘  │
│  + javac, jar, etc.      │
└──────────────────────────┘
```

---

## Implementaciones de JVM

### Oracle HotSpot

JVM oficial de Oracle. La más usada.

### OpenJDK HotSpot

Versión open source de HotSpot.

### GraalVM

JVM moderna con:

- Mejor rendimiento (compilador Graal)
- Imágenes nativas (compilación AOT)
- Soporte para otros lenguajes (Python, Ruby, JavaScript)

### Eclipse OpenJ9

JVM de IBM/Eclipse. Usa menos memoria que HotSpot.

---

## Versiones de Java

### Versiones LTS (Long Term Support)

- **Java 8** (2014): Lambdas, Streams. Aún muy usada.
- **Java 11** (2018): Módulos, var, nuevas APIs.
- **Java 17** (2021): Records, sealed classes, pattern matching.
- **Java 21** (2023): Virtual threads, sequenced collections.

### Release schedule

- Nueva versión cada 6 meses
- LTS cada 3 años (aproximadamente)

**Recomendación 2026**: Usa Java 21 para proyectos nuevos. Java 17 sigue siendo válido.

---

## Ventajas de la JVM

1. **Portabilidad**: El mismo bytecode funciona en cualquier sistema con JVM.
2. **Gestión automática de memoria**: Garbage collector.
3. **Optimización en tiempo de ejecución**: JIT compiler.
4. **Seguridad**: Validación de bytecode, sandbox.
5. **Madurez**: Décadas de optimizaciones y mejoras.

---

## Lenguajes en la JVM

La JVM no solo ejecuta Java. También:

- **Kotlin**: Lenguaje moderno compatible 100% con Java
- **Scala**: Funcional y orientado a objetos
- **Groovy**: Dinámico y scripteable
- **Clojure**: Lisp funcional

Todos compilan a bytecode y pueden usar bibliotecas Java.

---

## Próximo paso

Aprende cómo funciona la compilación y ejecución en Java: [Compilación y ejecución →](/jvm/compilacion/)
