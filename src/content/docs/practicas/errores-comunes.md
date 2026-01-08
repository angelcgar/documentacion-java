---
title: Errores comunes en Java
description: Errores frecuentes en Java y cómo evitarlos
---

## NullPointerException

El error más común en Java.

### Problema

```java
String texto = null;
int longitud = texto.length();  // ❌ NullPointerException
```

### Soluciones

**1. Validar null**:

```java
if (texto != null) {
    int longitud = texto.length();
}
```

**2. Usar Optional**:

```java
Optional<String> textoOpt = Optional.ofNullable(texto);
int longitud = textoOpt.map(String::length).orElse(0);
```

**3. Objects.requireNonNull**:

```java
public void procesar(String texto) {
    Objects.requireNonNull(texto, "texto no puede ser null");
    // Usar texto con seguridad
}
```

---

## Comparar Strings con ==

### Problema

```java
String a = new String("Hola");
String b = new String("Hola");

if (a == b) {  // ❌ false (compara referencias)
    System.out.println("Iguales");
}
```

### Solución

```java
if (a.equals(b)) {  // ✅ true (compara contenido)
    System.out.println("Iguales");
}
```

---

## No cerrar recursos

### Problema

```java
FileReader fr = new FileReader("archivo.txt");
// Si hay excepción, fr nunca se cierra
fr.read();
fr.close();
```

### Solución: try-with-resources

```java
try (FileReader fr = new FileReader("archivo.txt")) {
    fr.read();
}  // Se cierra automáticamente
```

---

## Modificar colecciones durante iteración

### Problema

```java
List<String> lista = new ArrayList<>(List.of("a", "b", "c"));

for (String elemento : lista) {
    if (elemento.equals("b")) {
        lista.remove(elemento);  // ❌ ConcurrentModificationException
    }
}
```

### Soluciones

**1. Iterator**:

```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    if (it.next().equals("b")) {
        it.remove();  // ✅ Correcto
    }
}
```

**2. removeIf** (Java 8+):

```java
lista.removeIf(elemento -> elemento.equals("b"));
```

**3. Crear nueva lista**:

```java
List<String> nueva = lista.stream()
    .filter(e -> !e.equals("b"))
    .collect(Collectors.toList());
```

---

## Concatenar Strings en bucles

### Problema

```java
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // ❌ Muy ineficiente
}
```

Cada `+=` crea un nuevo String.

### Solución: StringBuilder

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // ✅ Eficiente
}
String resultado = sb.toString();
```

---

## Ignorar excepciones

### Problema

```java
try {
    // código que puede fallar
} catch (Exception e) {
    // ❌ Tragar la excepción
}
```

### Solución

```java
try {
    // código
} catch (Exception e) {
    logger.error("Error procesando datos", e);
    // O relanzar: throw new RuntimeException(e);
}
```

---

## Usar tipos raw

### Problema

```java
List lista = new ArrayList();  // ❌ Sin tipo genérico
lista.add("texto");
lista.add(123);
String texto = (String) lista.get(1);  // ❌ ClassCastException
```

### Solución

```java
List<String> lista = new ArrayList<>();  // ✅ Con genéricos
lista.add("texto");
// lista.add(123);  // Error de compilación
```

---

## Olvidar break en switch

### Problema

```java
int dia = 1;
switch (dia) {
    case 1:
        System.out.println("Lunes");
        // ❌ Sin break, continúa al siguiente caso
    case 2:
        System.out.println("Martes");
        break;
}
// Imprime: Lunes\nMartes
```

### Solución

```java
switch (dia) {
    case 1:
        System.out.println("Lunes");
        break;  // ✅
    case 2:
        System.out.println("Martes");
        break;
}
```

O usa switch expressions (Java 14+):

```java
String nombre = switch (dia) {
    case 1 -> "Lunes";  // No necesita break
    case 2 -> "Martes";
    default -> "Otro";
};
```

---

## Autoboxing en bucles

### Problema

```java
// ❌ Crea objetos Integer innecesariamente
Integer suma = 0;
for (int i = 0; i < 1000; i++) {
    suma += i;  // Autoboxing/unboxing en cada iteración
}
```

### Solución

```java
// ✅ Usa tipos primitivos
int suma = 0;
for (int i = 0; i < 1000; i++) {
    suma += i;
}
```

---

## Double para dinero

### Problema

```java
double precio = 0.1;
double total = precio * 10;
System.out.println(total);  // 0.9999999999999999 ❌
```

### Solución: BigDecimal

```java
BigDecimal precio = new BigDecimal("0.1");
BigDecimal total = precio.multiply(new BigDecimal("10"));
System.out.println(total);  // 1.0 ✅
```

---

## No sobrescribir equals y hashCode

### Problema

```java
class Persona {
    String nombre;
    int edad;
}

Persona p1 = new Persona("Juan", 25);
Persona p2 = new Persona("Juan", 25);

System.out.println(p1.equals(p2));  // false ❌
```

### Solución

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Persona)) return false;
    Persona otra = (Persona) obj;
    return edad == otra.edad && Objects.equals(nombre, otra.nombre);
}

@Override
public int hashCode() {
    return Objects.hash(nombre, edad);
}
```

O usa records (Java 14+):

```java
record Persona(String nombre, int edad) { }
// equals, hashCode, toString generados automáticamente
```

---

## No usar interfaces

### Problema

```java
// ❌ Acoplamiento fuerte
ArrayList<String> lista = new ArrayList<>();
```

### Solución

```java
// ✅ Programa contra la interfaz
List<String> lista = new ArrayList<>();
```

Permite cambiar la implementación fácilmente:

```java
List<String> lista = new LinkedList<>();  // Cambio sin afectar el resto
```

---

## Static mutable state

### Problema

```java
public class Contador {
    public static int contador = 0;  // ❌ Estado compartido mutable

    public static void incrementar() {
        contador++;  // No thread-safe
    }
}
```

### Solución

```java
public class Contador {
    private final AtomicInteger contador = new AtomicInteger(0);

    public void incrementar() {
        contador.incrementAndGet();  // Thread-safe
    }

    public int getContador() {
        return contador.get();
    }
}
```

---

## Buenas prácticas para evitar errores

1. **Usa Optional para valores que pueden ser null**
2. **Valida parámetros al inicio de métodos**
3. **Cierra recursos con try-with-resources**
4. **Usa tipos genéricos siempre**
5. **Evita estado mutable compartido**
6. **Escribe tests unitarios**

---

## Próximo paso

Aprende principios de código limpio: [Clean Code →](/practicas/clean-code/)
