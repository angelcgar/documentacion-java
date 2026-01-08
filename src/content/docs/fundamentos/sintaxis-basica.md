---
title: Sintaxis básica
description: Sintaxis fundamental de Java y convenciones del lenguaje
---

## Estructura de un archivo Java

Un archivo Java típico tiene esta estructura:

```java
package com.ejemplo.proyecto;

import java.util.List;
import java.util.ArrayList;

public class MiClase {
    // Campos (atributos)
    private int valor;

    // Constructor
    public MiClase(int valor) {
        this.valor = valor;
    }

    // Métodos
    public int getValor() {
        return valor;
    }

    public static void main(String[] args) {
        MiClase instancia = new MiClase(10);
        System.out.println(instancia.getValor());
    }
}
```

Orden recomendado:

1. Declaración del package
2. Imports
3. Declaración de la clase
4. Campos
5. Constructores
6. Métodos

---

## Declaración de variables

### Variables locales

```java
int numero = 10;
String texto = "Hola";
double precio = 19.99;
boolean activo = true;
```

Desde Java 10, puedes usar `var` para inferencia de tipos:

```java
var numero = 10;        // int
var texto = "Hola";     // String
var lista = new ArrayList<String>();  // ArrayList<String>
```

`var` solo funciona cuando el tipo se puede inferir claramente.

### Constantes

```java
final int MAX_INTENTOS = 3;
final String NOMBRE_APP = "MiAplicacion";
```

Por convención, las constantes se escriben en MAYÚSCULAS con guion bajo.

---

## Comentarios

### Comentario de una línea

```java
// Esto es un comentario de una línea
int x = 5;  // También puede ir al final
```

### Comentario de múltiples líneas

```java
/*
 * Esto es un comentario
 * de varias líneas
 */
```

### Comentarios de documentación (Javadoc)

```java
/**
 * Calcula la suma de dos números.
 *
 * @param a primer número
 * @param b segundo número
 * @return la suma de a y b
 */
public int sumar(int a, int b) {
    return a + b;
}
```

---

## Operadores

### Aritméticos

```java
int a = 10, b = 3;

int suma = a + b;         // 13
int resta = a - b;        // 7
int multi = a * b;        // 30
int div = a / b;          // 3 (división entera)
int modulo = a % b;       // 1 (resto)
```

### Incremento y decremento

```java
int x = 5;
x++;      // x = 6 (post-incremento)
++x;      // x = 7 (pre-incremento)
x--;      // x = 6 (post-decremento)
--x;      // x = 5 (pre-decremento)
```

Diferencia entre pre y post:

```java
int a = 5;
int b = a++;  // b = 5, a = 6 (asigna primero, luego incrementa)

int c = 5;
int d = ++c;  // d = 6, c = 6 (incrementa primero, luego asigna)
```

### Comparación

```java
int a = 10, b = 5;

boolean igual = (a == b);        // false
boolean diferente = (a != b);    // true
boolean mayor = (a > b);         // true
boolean menor = (a < b);         // false
boolean mayorIgual = (a >= b);   // true
boolean menorIgual = (a <= b);   // false
```

### Lógicos

```java
boolean a = true, b = false;

boolean and = a && b;   // false (AND)
boolean or = a || b;    // true (OR)
boolean not = !a;       // false (NOT)
```

Evaluación de cortocircuito:

```java
if (usuario != null && usuario.isActivo()) {
    // Si usuario es null, no evalúa isActivo()
}
```

### Asignación

```java
int x = 10;

x += 5;   // x = x + 5  (15)
x -= 3;   // x = x - 3  (12)
x *= 2;   // x = x * 2  (24)
x /= 4;   // x = x / 4  (6)
x %= 4;   // x = x % 4  (2)
```

---

## Strings (cadenas de texto)

### Declaración y concatenación

```java
String nombre = "Juan";
String apellido = "Pérez";

String nombreCompleto = nombre + " " + apellido;  // "Juan Pérez"
```

### Métodos comunes

```java
String texto = "Hola Mundo";

int longitud = texto.length();              // 10
char caracter = texto.charAt(0);            // 'H'
String minuscula = texto.toLowerCase();     // "hola mundo"
String mayuscula = texto.toUpperCase();     // "HOLA MUNDO"
boolean contiene = texto.contains("Mundo"); // true
String reemplazo = texto.replace("o", "0"); // "H0la Mund0"
String[] partes = texto.split(" ");         // ["Hola", "Mundo"]
```

### Comparación de strings

```java
String a = "Hola";
String b = "Hola";

// ❌ Incorrecto (compara referencias, no contenido)
if (a == b) { }

// ✅ Correcto (compara contenido)
if (a.equals(b)) { }

// Ignorar mayúsculas/minúsculas
if (a.equalsIgnoreCase("hola")) { }
```

### String interpolation (Text Blocks en Java 15+)

```java
String nombre = "Juan";
int edad = 25;

// Antes
String mensaje = "Hola, me llamo " + nombre + " y tengo " + edad + " años";

// Con String.format
String mensaje = String.format("Hola, me llamo %s y tengo %d años", nombre, edad);

// Con Text Blocks (Java 15+)
String json = """
    {
        "nombre": "%s",
        "edad": %d
    }
    """.formatted(nombre, edad);
```

---

## Arrays (arreglos)

### Declaración

```java
// Declarar con tamaño
int[] numeros = new int[5];  // [0, 0, 0, 0, 0]

// Declarar con valores
int[] numeros = {1, 2, 3, 4, 5};
String[] nombres = {"Ana", "Luis", "María"};
```

### Acceso y modificación

```java
int[] numeros = {10, 20, 30, 40, 50};

int primero = numeros[0];     // 10
numeros[2] = 99;              // {10, 20, 99, 40, 50}
int tamaño = numeros.length;  // 5
```

### Iterar arrays

```java
int[] numeros = {1, 2, 3, 4, 5};

// For tradicional
for (int i = 0; i < numeros.length; i++) {
    System.out.println(numeros[i]);
}

// For-each (recomendado)
for (int numero : numeros) {
    System.out.println(numero);
}
```

### Arrays multidimensionales

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

int valor = matriz[1][2];  // 6
```

---

## Convenciones de nombres

### Clases e interfaces

```java
public class MiClase { }
public interface MiInterfaz { }
```

PascalCase: cada palabra empieza con mayúscula.

### Métodos y variables

```java
int miVariable = 10;
public void miMetodo() { }
```

camelCase: primera palabra en minúscula, resto con mayúscula inicial.

### Constantes

```java
public static final int MAX_VALOR = 100;
public static final String NOMBRE_APLICACION = "MiApp";
```

MAYÚSCULAS con guion bajo.

### Packages

```java
package com.empresa.proyecto.modulo;
```

Todo en minúsculas, separado por puntos.

---

## Alcance de variables

```java
public class Ejemplo {
    private int campoClase = 10;  // Accesible en toda la clase

    public void metodo() {
        int variableLocal = 5;  // Solo accesible en este método

        if (variableLocal > 0) {
            int variableBloque = 3;  // Solo accesible en este if
        }

        // variableBloque no es accesible aquí
    }
}
```

---

## Palabras clave reservadas

No puedes usar estas palabras como nombres de variables o clases:

```
abstract   continue   for          new         switch
assert     default    goto         package     synchronized
boolean    do         if           private     this
break      double     implements   protected   throw
byte       else       import       public      throws
case       enum       instanceof   return      transient
catch      extends    int          short       try
char       final      interface    static      void
class      finally    long         strictfp    volatile
const      float      native       super       while
```

---

## Próximo paso

Ahora que conoces la sintaxis básica, profundiza en los tipos de datos: [Tipos de datos →](/fundamentos/tipos-datos/)
