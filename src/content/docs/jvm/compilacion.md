---
title: Compilación y ejecución
description: Proceso de compilación y ejecución de programas Java
---

## El proceso completo

```
1. Escribir código (.java)
        ↓
2. Compilar (javac)
        ↓
3. Bytecode (.class)
        ↓
4. Ejecutar (java)
        ↓
5. JVM carga y ejecuta
```

---

## Compilación

### Compilar un archivo

```bash
javac HolaMundo.java
```

Genera `HolaMundo.class` (bytecode).

### Compilar múltiples archivos

```bash
javac Archivo1.java Archivo2.java Archivo3.java
```

O con wildcard:

```bash
javac *.java
```

### Especificar directorio de salida

```bash
javac -d bin src/HolaMundo.java
```

Genera los `.class` en el directorio `bin/`.

### Especificar classpath

Para incluir dependencias:

```bash
javac -cp libs/biblioteca.jar src/Main.java
```

---

## Ejecución

### Ejecutar una clase

```bash
java HolaMundo
```

**Nota**: Sin extensión `.class`.

### Especificar classpath

```bash
java -cp bin:libs/biblioteca.jar HolaMundo
```

En Windows usa `;` en lugar de `:`:

```cmd
java -cp bin;libs\biblioteca.jar HolaMundo
```

### Con archivos JAR

```bash
java -jar miapp.jar
```

---

## Bytecode

### Ver bytecode

```bash
javap -c HolaMundo.class
```

Ejemplo:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola");
    }
}
```

Bytecode:

```
public static void main(java.lang.String[]);
  Code:
     0: getstatic     #7   // Field java/lang/System.out
     3: ldc           #13  // String Hola
     5: invokevirtual #15  // Method println
     8: return
```

Instrucciones:

- `getstatic`: Obtiene campo estático (`System.out`)
- `ldc`: Carga constante ("Hola")
- `invokevirtual`: Llama método (`println`)
- `return`: Retorna

---

## JIT Compiler

### Interpretación vs Compilación

**Interpreter**: Ejecuta bytecode línea por línea (lento, pero inicia rápido).

**JIT Compiler**: Compila bytecode a código nativo en tiempo de ejecución (rápido).

La JVM empieza con el interpreter y detecta "hot spots" (código que se ejecuta frecuentemente) para compilarlos con JIT.

### Niveles de compilación

**C1 (Client Compiler)**: Compilación rápida, optimización básica.

**C2 (Server Compiler)**: Compilación lenta, optimización agresiva.

**Tiered Compilation** (por defecto): Combina C1 y C2.

```
Inicio → Interpreter → C1 → C2
         (rápido)     (medio) (optimizado)
```

---

## Optimizaciones de la JVM

### Inlining

Reemplaza llamadas a métodos por el código del método:

```java
// Código original
public int sumar(int a, int b) {
    return a + b;
}

public void calcular() {
    int resultado = sumar(3, 5);
}

// Optimizado (inlining)
public void calcular() {
    int resultado = 3 + 5;
}
```

### Dead Code Elimination

Elimina código que nunca se ejecuta:

```java
public void metodo() {
    if (false) {
        // Este código se elimina
    }
}
```

### Loop Unrolling

Desenrolla bucles para reducir overhead:

```java
// Código original
for (int i = 0; i < 4; i++) {
    System.out.println(i);
}

// Optimizado
System.out.println(0);
System.out.println(1);
System.out.println(2);
System.out.println(3);
```

### Escape Analysis

Determina si un objeto escapa del ámbito de un método. Si no escapa, puede allocarlo en el stack en lugar del heap (más rápido).

---

## Opciones de JVM

### Ajustar memoria

```bash
java -Xmx2g -Xms512m Main
```

- `-Xmx2g`: Máximo 2GB de heap
- `-Xms512m`: Inicial 512MB de heap

### Configurar GC

```bash
java -XX:+UseG1GC Main
```

- `UseG1GC`: Usa G1 Garbage Collector
- `UseZGC`: Usa ZGC (baja latencia)

### Imprimir información de JIT

```bash
java -XX:+PrintCompilation Main
```

Muestra qué métodos se compilan con JIT.

---

## Crear un JAR

### JAR ejecutable

Crear:

```bash
jar cfe miapp.jar Main Main.class Utilidades.class
```

- `c`: Crear
- `f`: Especificar archivo
- `e`: Punto de entrada (clase Main)

Ejecutar:

```bash
java -jar miapp.jar
```

### Manifest

`MANIFEST.MF`:

```
Manifest-Version: 1.0
Main-Class: Main
```

---

## Herramientas

### javac

Compilador de Java.

### java

Lanza la JVM para ejecutar programas.

### javap

Desensambla bytecode.

### jar

Crea y manipula archivos JAR.

### jshell (Java 9+)

REPL para experimentar:

```bash
jshell
|  Welcome to JShell
jshell> int x = 5;
x ==> 5
jshell> x * 2
$2 ==> 10
```

---

## Próximo paso

Aprende sobre el Garbage Collector: [Garbage Collection →](/jvm/garbage-collection/)
