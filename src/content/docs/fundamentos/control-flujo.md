---
title: Control de flujo
description: Estructuras de control en Java - condicionales, bucles y manejo de flujo
---

## Condicionales

### if / else

```java
int edad = 18;

if (edad >= 18) {
    System.out.println("Mayor de edad");
} else {
    System.out.println("Menor de edad");
}
```

### if / else if / else

```java
int nota = 85;

if (nota >= 90) {
    System.out.println("Excelente");
} else if (nota >= 70) {
    System.out.println("Bueno");
} else if (nota >= 50) {
    System.out.println("Suficiente");
} else {
    System.out.println("Insuficiente");
}
```

### Operador ternario

```java
int edad = 20;
String categoria = (edad >= 18) ? "Adulto" : "Menor";
```

Equivalente a:

```java
String categoria;
if (edad >= 18) {
    categoria = "Adulto";
} else {
    categoria = "Menor";
}
```

### switch (tradicional)

```java
int dia = 3;
String nombreDia;

switch (dia) {
    case 1:
        nombreDia = "Lunes";
        break;
    case 2:
        nombreDia = "Martes";
        break;
    case 3:
        nombreDia = "Miércoles";
        break;
    default:
        nombreDia = "Otro día";
        break;
}
```

Sin `break`, continúa ejecutando los siguientes casos (fall-through):

```java
switch (mes) {
    case 12:
    case 1:
    case 2:
        System.out.println("Invierno");
        break;
    case 3:
    case 4:
    case 5:
        System.out.println("Primavera");
        break;
}
```

### switch expressions (Java 14+)

Más limpio y sin necesidad de `break`:

```java
int dia = 3;
String nombreDia = switch (dia) {
    case 1 -> "Lunes";
    case 2 -> "Martes";
    case 3 -> "Miércoles";
    case 4 -> "Jueves";
    case 5 -> "Viernes";
    case 6, 7 -> "Fin de semana";
    default -> "Día inválido";
};
```

Con bloques de código:

```java
String resultado = switch (valor) {
    case 1 -> {
        System.out.println("Procesando...");
        yield "Uno";
    }
    case 2 -> "Dos";
    default -> "Otro";
};
```

---

## Bucles

### for

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Iteración: " + i);
}
```

Componentes:

1. **Inicialización**: `int i = 0`
2. **Condición**: `i < 5`
3. **Incremento**: `i++`

Múltiples variables:

```java
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println(i + " " + j);
}
```

### for-each (enhanced for)

Para iterar colecciones o arrays:

```java
int[] numeros = {1, 2, 3, 4, 5};

for (int numero : numeros) {
    System.out.println(numero);
}
```

Con listas:

```java
List<String> nombres = List.of("Ana", "Luis", "María");

for (String nombre : nombres) {
    System.out.println(nombre);
}
```

### while

```java
int contador = 0;

while (contador < 5) {
    System.out.println("Contador: " + contador);
    contador++;
}
```

### do-while

Se ejecuta al menos una vez:

```java
int numero;
Scanner scanner = new Scanner(System.in);

do {
    System.out.print("Ingresa un número positivo: ");
    numero = scanner.nextInt();
} while (numero <= 0);
```

---

## Control de bucles

### break

Sale del bucle inmediatamente:

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Sale del bucle cuando i es 5
    }
    System.out.println(i);  // Imprime 0, 1, 2, 3, 4
}
```

### continue

Salta a la siguiente iteración:

```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // Salta los números pares
    }
    System.out.println(i);  // Imprime 1, 3, 5, 7, 9
}
```

### Labels

Para controlar bucles anidados:

```java
exterior:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break exterior;  // Sale de ambos bucles
        }
        System.out.println(i + ", " + j);
    }
}
```

---

## Pattern Matching

### instanceof con pattern matching (Java 16+)

Antes:

```java
Object obj = "Hola";

if (obj instanceof String) {
    String str = (String) obj;
    System.out.println(str.toUpperCase());
}
```

Ahora:

```java
if (obj instanceof String str) {
    System.out.println(str.toUpperCase());  // str ya está casteado
}
```

### Pattern matching en switch (Java 21+)

```java
Object obj = 123;

String resultado = switch (obj) {
    case Integer i -> "Entero: " + i;
    case String s -> "Texto: " + s;
    case null -> "Es null";
    default -> "Otro tipo";
};
```

Con guardas:

```java
String resultado = switch (obj) {
    case Integer i when i > 0 -> "Positivo";
    case Integer i when i < 0 -> "Negativo";
    case Integer i -> "Cero";
    default -> "No es entero";
};
```

---

## Excepciones y control de flujo

### try-catch

```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: división por cero");
}
```

### try-catch-finally

```java
try {
    // Código que puede fallar
    archivo.leer();
} catch (IOException e) {
    System.out.println("Error al leer archivo");
} finally {
    // Siempre se ejecuta
    archivo.cerrar();
}
```

### try-with-resources

Para recursos que deben cerrarse automáticamente:

```java
try (BufferedReader br = new BufferedReader(new FileReader("archivo.txt"))) {
    String linea = br.readLine();
} catch (IOException e) {
    e.printStackTrace();
}
// br se cierra automáticamente
```

---

## Errores comunes

### Olvidar break en switch

```java
int x = 1;
switch (x) {
    case 1:
        System.out.println("Uno");
        // ❌ Sin break, continúa al siguiente caso
    case 2:
        System.out.println("Dos");
        break;
}
// Imprime: Uno\nDos
```

### Condiciones infinitas

```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    // ❌ Olvidas incrementar i, bucle infinito
}
```

### Comparar objetos con ==

```java
String a = new String("Hola");
String b = new String("Hola");

if (a == b) {  // ❌ Compara referencias, no contenido
    System.out.println("Iguales");
}

if (a.equals(b)) {  // ✅ Compara contenido
    System.out.println("Iguales");
}
```

---

## Buenas prácticas

1. **Usa for-each cuando no necesites el índice**:

```java
// ✅ Mejor
for (String nombre : nombres) {
    System.out.println(nombre);
}

// ❌ Menos claro
for (int i = 0; i < nombres.size(); i++) {
    System.out.println(nombres.get(i));
}
```

2. **Evita bucles anidados profundos**: Extrae a métodos separados.

3. **Prefiere switch expressions sobre switch tradicional** (Java 14+).

4. **No uses break/continue con labels**: Indica código complejo que debería refactorizarse.

5. **Usa Optional en lugar de null checks complejos** (lo veremos en capítulos posteriores).

---

## Próximo paso

Ahora que controlas el flujo de tu programa, es momento de aprender sobre programación orientada a objetos: [POO →](/fundamentos/poo/)
