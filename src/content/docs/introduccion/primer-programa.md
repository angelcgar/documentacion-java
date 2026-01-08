---
title: Primer programa en Java
description: Crea y ejecuta tu primer programa en Java
---

## Hola Mundo

El programa más básico en Java:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola, mundo");
    }
}
```

### Desglosando el código

- `public class HolaMundo`: Define una clase pública llamada `HolaMundo`.
- `public static void main(String[] args)`: Método principal que ejecuta el programa.
- `System.out.println()`: Imprime texto en la consola.

### Guardar y ejecutar

1. Guarda el código en un archivo llamado `HolaMundo.java` (el nombre debe coincidir con el nombre de la clase).
2. Compila: `javac HolaMundo.java`
3. Ejecuta: `java HolaMundo`

Deberías ver: `Hola, mundo`

---

## Cómo funciona

1. **Compilación**: `javac` convierte el código fuente `.java` en bytecode `.class`.
2. **Ejecución**: La JVM (Java Virtual Machine) ejecuta el bytecode.

El bytecode es independiente de la plataforma. Puedes compilar en Windows y ejecutar en Linux sin cambios.

---

## Anatomía de un programa Java

Todo programa Java necesita al menos:

1. **Una clase**: Todo el código debe estar dentro de una clase.
2. **El método main**: Punto de entrada del programa.

```java
public class MiPrograma {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

Conceptos clave:

- `public`: La clase es accesible desde cualquier lugar.
- `static`: El método pertenece a la clase, no a instancias.
- `void`: No retorna ningún valor.
- `String[] args`: Argumentos de línea de comandos (opcional, pero siempre se incluye).

---

## Trabajar con argumentos

Puedes pasar argumentos al programa desde la línea de comandos:

```java
public class Saludo {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("Hola, " + args[0]);
        } else {
            System.out.println("Hola, mundo");
        }
    }
}
```

Ejecuta:

```bash
javac Saludo.java
java Saludo Juan
```

Salida: `Hola, Juan`

---

## Variables y tipos básicos

```java
public class Variables {
    public static void main(String[] args) {
        int edad = 25;
        double altura = 1.75;
        String nombre = "María";
        boolean esEstudiante = true;

        System.out.println(nombre + " tiene " + edad + " años");
        System.out.println("Altura: " + altura + " metros");
        System.out.println("¿Es estudiante? " + esEstudiante);
    }
}
```

Tipos primitivos comunes:

- `int`: Números enteros
- `double`: Números decimales
- `boolean`: true o false
- `char`: Un solo carácter

Tipo de referencia:

- `String`: Cadenas de texto (no es primitivo, es un objeto)

---

## Operaciones básicas

```java
public class Calculadora {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println("Suma: " + (a + b));
        System.out.println("Resta: " + (a - b));
        System.out.println("Multiplicación: " + (a * b));
        System.out.println("División: " + (a / b));
        System.out.println("Módulo: " + (a % b));
    }
}
```

Nota: La división entre enteros trunca el resultado. `10 / 3` es `3`, no `3.333...`

Para obtener decimales, usa `double`:

```java
double resultado = 10.0 / 3.0;  // 3.3333333333333335
```

---

## Condicionales

```java
public class Mayor {
    public static void main(String[] args) {
        int edad = 18;

        if (edad >= 18) {
            System.out.println("Eres mayor de edad");
        } else {
            System.out.println("Eres menor de edad");
        }
    }
}
```

---

## Bucles

### For

```java
public class Contador {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Número: " + i);
        }
    }
}
```

### While

```java
public class ContadorWhile {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println("Número: " + i);
            i++;
        }
    }
}
```

---

## Métodos

Puedes crear métodos para organizar tu código:

```java
public class Calculadora {
    public static void main(String[] args) {
        int resultado = sumar(5, 3);
        System.out.println("Resultado: " + resultado);
    }

    public static int sumar(int a, int b) {
        return a + b;
    }
}
```

Conceptos:

- `static`: El método pertenece a la clase, no a instancias.
- `int`: Tipo de retorno.
- `sumar`: Nombre del método.
- `(int a, int b)`: Parámetros.
- `return`: Devuelve un valor.

---

## Errores comunes

### El nombre del archivo no coincide con la clase

```java
// Archivo: Programa.java
public class MiPrograma {  // ❌ Error
    // ...
}
```

El nombre del archivo debe ser `MiPrograma.java`.

### Olvidar el método main

```java
public class Prueba {
    // ❌ Sin método main
}
```

Si intentas ejecutar esta clase: `Error: Main method not found`

### Usar minúsculas en el comando java

```bash
javac HolaMundo.java  # ✅ Compila HolaMundo.java
java HolaMundo.class  # ❌ Error: no uses .class
java HolaMundo        # ✅ Ejecuta la clase HolaMundo
```

---

## Buenas prácticas desde el inicio

1. **Nombres de clases**: PascalCase (`MiClase`, no `mi_clase` o `miclase`)
2. **Nombres de métodos y variables**: camelCase (`miVariable`, no `mi_variable`)
3. **Constantes**: MAYÚSCULAS con guion bajo (`MAX_VALOR`)
4. **Indentación**: Usa espacios o tabs de forma consistente
5. **Comentarios**: Solo cuando sea necesario, el código debe ser legible por sí mismo

---

## Próximo paso

Has escrito tus primeros programas en Java. Ahora profundiza en los fundamentos del lenguaje: [Sintaxis básica →](/fundamentos/sintaxis-basica/)
