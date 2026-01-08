---
title: Tipos de datos
description: Tipos primitivos y de referencia en Java
---

## Tipos primitivos

Java tiene 8 tipos primitivos. Son los tipos más básicos y se almacenan directamente en memoria, no son objetos.

### Enteros

```java
byte b = 127;           // 8 bits: -128 a 127
short s = 32000;        // 16 bits: -32,768 a 32,767
int i = 2147483647;     // 32 bits: -2^31 a 2^31-1
long l = 9223372036854775807L;  // 64 bits: -2^63 a 2^63-1
```

**Uso recomendado**: Usa `int` por defecto. Solo usa los demás si necesitas ahorrar memoria o rangos mayores.

Los literales `long` terminan con `L`:

```java
long grande = 10000000000L;  // ✅ Correcto
long grande = 10000000000;   // ❌ Error de compilación
```

### Decimales

```java
float f = 3.14f;        // 32 bits: precisión ~6-7 dígitos
double d = 3.14159265;  // 64 bits: precisión ~15 dígitos
```

**Uso recomendado**: Usa `double` por defecto. `float` se usa raramente.

Los literales `float` terminan con `f`:

```java
float pi = 3.14f;    // ✅ Correcto
float pi = 3.14;     // ❌ Error: 3.14 es double por defecto
```

### Caracteres

```java
char letra = 'A';
char unicode = '\u0041';  // También 'A'
char numero = '7';
```

Un `char` es un carácter Unicode de 16 bits. Se escribe entre comillas simples.

### Booleanos

```java
boolean verdadero = true;
boolean falso = false;
```

Solo acepta `true` o `false`. No es 0/1 como en C.

---

## Valores por defecto

Si no inicializas un campo de una clase, tiene estos valores por defecto:

```java
public class Defaults {
    byte b;       // 0
    short s;      // 0
    int i;        // 0
    long l;       // 0L
    float f;      // 0.0f
    double d;     // 0.0
    char c;       // '\u0000' (carácter nulo)
    boolean bool; // false
    String str;   // null (tipos de referencia)
}
```

**Importante**: Las variables locales (dentro de métodos) NO tienen valores por defecto. Debes inicializarlas antes de usarlas.

```java
public void metodo() {
    int x;
    System.out.println(x);  // ❌ Error de compilación
}
```

---

## Tipos de referencia

Todo lo que no es un tipo primitivo es un tipo de referencia (objetos).

### String

```java
String nombre = "Juan";
String vacio = "";
String nulo = null;
```

`String` no es un tipo primitivo, es una clase. Pero se comporta de forma especial:

```java
String a = "Hola";
String b = "Hola";
// a y b apuntan al mismo objeto en el String Pool

String c = new String("Hola");
// c es un nuevo objeto en memoria
```

### Arrays

```java
int[] numeros = {1, 2, 3, 4, 5};
String[] nombres = new String[10];
```

Los arrays son objetos, no primitivos.

### Clases

```java
class Persona {
    String nombre;
    int edad;
}

Persona p = new Persona();
```

Cuando asignas un objeto a una variable, la variable almacena una **referencia** (dirección de memoria), no el objeto en sí.

---

## Diferencia entre primitivos y referencias

### Primitivos

```java
int a = 5;
int b = a;  // Copia el valor
b = 10;

System.out.println(a);  // 5 (no cambia)
System.out.println(b);  // 10
```

### Referencias

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;  // Copia la referencia, no el array
arr2[0] = 99;

System.out.println(arr1[0]);  // 99 (¡cambió!)
System.out.println(arr2[0]);  // 99
```

Ambas variables apuntan al mismo array en memoria.

---

## Clases envolventes (Wrapper Classes)

Cada tipo primitivo tiene una clase envolvente:

| Primitivo | Clase envolvente |
| --------- | ---------------- |
| `byte`    | `Byte`           |
| `short`   | `Short`          |
| `int`     | `Integer`        |
| `long`    | `Long`           |
| `float`   | `Float`          |
| `double`  | `Double`         |
| `char`    | `Character`      |
| `boolean` | `Boolean`        |

### ¿Para qué sirven?

1. **Colecciones**: Las colecciones solo aceptan objetos, no primitivos.

```java
List<int> numeros = new ArrayList<>();      // ❌ Error
List<Integer> numeros = new ArrayList<>();  // ✅ Correcto
```

2. **Valores null**: Los primitivos no pueden ser `null`, pero las clases envolventes sí.

```java
int x = null;      // ❌ Error
Integer x = null;  // ✅ Correcto
```

3. **Métodos útiles**:

```java
Integer.parseInt("123");       // Convierte String a int
Integer.toString(123);         // Convierte int a String
Integer.MAX_VALUE;             // Valor máximo de int
Double.isNaN(0.0 / 0.0);       // true
```

### Autoboxing y Unboxing

Java convierte automáticamente entre primitivos y wrappers:

```java
// Autoboxing (primitivo → wrapper)
Integer x = 5;  // Equivalente a: Integer x = Integer.valueOf(5);

// Unboxing (wrapper → primitivo)
int y = x;      // Equivalente a: int y = x.intValue();
```

Cuidado con null:

```java
Integer x = null;
int y = x;  // ❌ NullPointerException
```

---

## Conversión de tipos (Casting)

### Conversión implícita (widening)

No pierde información, se hace automáticamente:

```java
int x = 100;
long y = x;      // ✅ Automático (int → long)
double z = x;    // ✅ Automático (int → double)
```

Orden de jerarquía:

```
byte → short → int → long → float → double
       char  ↗
```

### Conversión explícita (narrowing)

Puede perder información, requiere casting manual:

```java
double x = 9.99;
int y = (int) x;  // y = 9 (pierde decimales)

int a = 300;
byte b = (byte) a;  // b = 44 (overflow)
```

### Conversión entre String y números

```java
// String → número
int num = Integer.parseInt("123");
double dec = Double.parseDouble("3.14");

// número → String
String str = String.valueOf(123);
String str = Integer.toString(123);
String str = "" + 123;  // Forma rápida pero menos clara
```

---

## Tipos especiales

### var (inferencia de tipos, Java 10+)

```java
var nombre = "Juan";           // String
var edad = 25;                 // int
var lista = new ArrayList<>(); // ArrayList (tipo raw, ¡cuidado!)
var precio = 19.99;            // double
```

Restricciones:

```java
var x;          // ❌ Error: debe inicializarse
var x = null;   // ❌ Error: no se puede inferir el tipo
```

Úsalo solo cuando el tipo sea obvio. No abuses de `var`.

### final

Hace que una variable sea constante:

```java
final int MAX = 100;
MAX = 200;  // ❌ Error de compilación
```

Para referencias, el objeto puede cambiar, pero no la referencia:

```java
final List<String> lista = new ArrayList<>();
lista.add("Hola");  // ✅ Correcto (modificas el objeto)
lista = new ArrayList<>();  // ❌ Error (cambias la referencia)
```

---

## Record Classes (Java 14+)

Para crear clases inmutables de datos de forma concisa:

```java
public record Persona(String nombre, int edad) { }

// Equivalente a:
public class Persona {
    private final String nombre;
    private final int edad;

    public Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    public String nombre() { return nombre; }
    public int edad() { return edad; }

    // + equals, hashCode, toString generados automáticamente
}
```

Uso:

```java
Persona p = new Persona("Juan", 25);
System.out.println(p.nombre());  // "Juan"
```

---

## BigInteger y BigDecimal

Para números muy grandes o cálculos financieros precisos:

```java
import java.math.BigInteger;
import java.math.BigDecimal;

// BigInteger (enteros sin límite)
BigInteger grande = new BigInteger("12345678901234567890");
BigInteger resultado = grande.add(new BigInteger("100"));

// BigDecimal (decimales precisos)
BigDecimal precio = new BigDecimal("19.99");
BigDecimal impuesto = new BigDecimal("0.21");
BigDecimal total = precio.multiply(impuesto.add(BigDecimal.ONE));
```

No uses `double` para dinero, usa `BigDecimal`.

---

## Buenas prácticas

1. **Usa `int` y `double` por defecto**: Solo cambia si tienes una razón específica.
2. **Evita `float`**: Casi siempre es mejor `double`.
3. **Usa wrappers solo cuando sea necesario**: Los primitivos son más eficientes.
4. **Evita null cuando sea posible**: Usa `Optional` en su lugar (lo veremos más adelante).
5. **Para dinero, usa `BigDecimal`**: Nunca `double`.

---

## Próximo paso

Ahora que conoces los tipos de datos, aprende a controlar el flujo de tu programa: [Control de flujo →](/fundamentos/control-flujo/)
