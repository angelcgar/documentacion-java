---
title: Streams y Programación Funcional
description: API de Streams y programación funcional en Java
---

## ¿Qué son los Streams?

Los Streams (Java 8+) permiten procesar colecciones de datos de forma declarativa y funcional. No son estructuras de datos, son flujos de elementos que se procesan.

```java
List<Integer> numeros = List.of(1, 2, 3, 4, 5);

// Imperativo (antiguo)
int suma = 0;
for (int numero : numeros) {
    if (numero % 2 == 0) {
        suma += numero * 2;
    }
}

// Declarativo con Streams
int suma = numeros.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 2)
    .reduce(0, Integer::sum);
```

---

## Crear Streams

### Desde colecciones

```java
List<String> lista = List.of("a", "b", "c");
Stream<String> stream = lista.stream();
```

### Desde arrays

```java
String[] array = {"a", "b", "c"};
Stream<String> stream = Arrays.stream(array);
```

### Con Stream.of

```java
Stream<String> stream = Stream.of("a", "b", "c");
```

### Streams infinitos

```java
// Generar valores
Stream<Integer> infinito = Stream.generate(() -> 42);

// Iterar
Stream<Integer> numeros = Stream.iterate(0, n -> n + 1);  // 0, 1, 2, 3...
```

### Streams numéricos

```java
IntStream enteros = IntStream.range(1, 10);  // 1 a 9
IntStream enterosInclusivo = IntStream.rangeClosed(1, 10);  // 1 a 10
DoubleStream decimales = DoubleStream.of(1.1, 2.2, 3.3);
```

---

## Operaciones intermedias

Retornan un nuevo Stream. Son **lazy** (no se ejecutan hasta una operación terminal).

### filter

Filtra elementos que cumplen una condición:

```java
List<Integer> numeros = List.of(1, 2, 3, 4, 5, 6);

List<Integer> pares = numeros.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());  // [2, 4, 6]
```

### map

Transforma cada elemento:

```java
List<String> nombres = List.of("ana", "luis", "maría");

List<String> mayusculas = nombres.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());  // ["ANA", "LUIS", "MARÍA"]
```

### flatMap

Aplana streams anidados:

```java
List<List<Integer>> listas = List.of(
    List.of(1, 2),
    List.of(3, 4),
    List.of(5, 6)
);

List<Integer> plano = listas.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());  // [1, 2, 3, 4, 5, 6]
```

### distinct

Elimina duplicados:

```java
List<Integer> numeros = List.of(1, 2, 2, 3, 3, 3, 4);

List<Integer> unicos = numeros.stream()
    .distinct()
    .collect(Collectors.toList());  // [1, 2, 3, 4]
```

### sorted

Ordena elementos:

```java
List<Integer> numeros = List.of(5, 2, 8, 1, 9);

List<Integer> ordenados = numeros.stream()
    .sorted()
    .collect(Collectors.toList());  // [1, 2, 5, 8, 9]

// Con comparador
List<Integer> descendente = numeros.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());  // [9, 8, 5, 2, 1]
```

### limit y skip

```java
List<Integer> numeros = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> primeros = numeros.stream()
    .limit(5)
    .collect(Collectors.toList());  // [1, 2, 3, 4, 5]

List<Integer> sinPrimeros = numeros.stream()
    .skip(3)
    .collect(Collectors.toList());  // [4, 5, 6, 7, 8, 9, 10]
```

### peek

Para debugging, ejecuta una acción sin modificar el stream:

```java
List<Integer> resultado = numeros.stream()
    .filter(n -> n % 2 == 0)
    .peek(n -> System.out.println("Filtrado: " + n))
    .map(n -> n * 2)
    .peek(n -> System.out.println("Mapeado: " + n))
    .collect(Collectors.toList());
```

---

## Operaciones terminales

Ejecutan el stream y retornan un resultado.

### collect

Convierte el stream en una colección:

```java
List<String> lista = stream.collect(Collectors.toList());
Set<String> conjunto = stream.collect(Collectors.toSet());
Map<String, Integer> mapa = stream.collect(
    Collectors.toMap(String::toLowerCase, String::length)
);
```

### forEach

Ejecuta una acción para cada elemento:

```java
numeros.stream()
    .filter(n -> n % 2 == 0)
    .forEach(System.out::println);
```

### count

Cuenta elementos:

```java
long cantidad = numeros.stream()
    .filter(n -> n > 5)
    .count();
```

### reduce

Combina elementos en un solo valor:

```java
// Suma
int suma = numeros.stream()
    .reduce(0, (a, b) -> a + b);

// Con method reference
int suma = numeros.stream()
    .reduce(0, Integer::sum);

// Producto
int producto = numeros.stream()
    .reduce(1, (a, b) -> a * b);

// Concatenar strings
String concatenado = nombres.stream()
    .reduce("", (a, b) -> a + b);
```

### Operaciones de búsqueda

```java
// Encontrar cualquiera
Optional<Integer> cualquiera = numeros.stream()
    .filter(n -> n > 5)
    .findAny();

// Encontrar el primero
Optional<Integer> primero = numeros.stream()
    .filter(n -> n > 5)
    .findFirst();

// Verificar si alguno cumple
boolean hayMayores = numeros.stream()
    .anyMatch(n -> n > 100);

// Verificar si todos cumplen
boolean todosPares = numeros.stream()
    .allMatch(n -> n % 2 == 0);

// Verificar si ninguno cumple
boolean ningunNegativo = numeros.stream()
    .noneMatch(n -> n < 0);
```

### min y max

```java
Optional<Integer> minimo = numeros.stream().min(Integer::compare);
Optional<Integer> maximo = numeros.stream().max(Integer::compare);
```

---

## Collectors

### Colecciones básicas

```java
List<String> lista = stream.collect(Collectors.toList());
Set<String> conjunto = stream.collect(Collectors.toSet());

// Java 16+
List<String> lista = stream.toList();  // Inmutable
```

### joining

Concatenar strings:

```java
String resultado = List.of("Java", "Python", "JavaScript")
    .stream()
    .collect(Collectors.joining());  // "JavaPythonJavaScript"

String conSeparador = List.of("Java", "Python", "JavaScript")
    .stream()
    .collect(Collectors.joining(", "));  // "Java, Python, JavaScript"

String completo = List.of("Java", "Python", "JavaScript")
    .stream()
    .collect(Collectors.joining(", ", "[", "]"));  // "[Java, Python, JavaScript]"
```

### Agrupamiento

```java
class Persona {
    String nombre;
    int edad;
    String ciudad;
}

List<Persona> personas = ...;

// Agrupar por ciudad
Map<String, List<Persona>> porCiudad = personas.stream()
    .collect(Collectors.groupingBy(Persona::getCiudad));

// Contar por ciudad
Map<String, Long> cantidadPorCiudad = personas.stream()
    .collect(Collectors.groupingBy(
        Persona::getCiudad,
        Collectors.counting()
    ));

// Agrupar y obtener nombres
Map<String, List<String>> nombresPorCiudad = personas.stream()
    .collect(Collectors.groupingBy(
        Persona::getCiudad,
        Collectors.mapping(Persona::getNombre, Collectors.toList())
    ));
```

### Particionamiento

Dividir en dos grupos (true/false):

```java
Map<Boolean, List<Integer>> particion = numeros.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));

List<Integer> pares = particion.get(true);
List<Integer> impares = particion.get(false);
```

### Estadísticas

```java
IntSummaryStatistics stats = numeros.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));

System.out.println("Cantidad: " + stats.getCount());
System.out.println("Suma: " + stats.getSum());
System.out.println("Promedio: " + stats.getAverage());
System.out.println("Mínimo: " + stats.getMin());
System.out.println("Máximo: " + stats.getMax());
```

---

## Optional

Para manejar valores que pueden o no existir:

```java
Optional<String> opcional = Optional.of("valor");
Optional<String> vacio = Optional.empty();
Optional<String> nulleable = Optional.ofNullable(valor);  // null-safe

// Verificar si existe
if (opcional.isPresent()) {
    String valor = opcional.get();
}

// Mejor forma (Java 8+)
opcional.ifPresent(valor -> System.out.println(valor));

// Con valor por defecto
String valor = opcional.orElse("default");
String valor = opcional.orElseGet(() -> "default");
String valor = opcional.orElseThrow(() -> new Exception("No existe"));

// Transformar
Optional<Integer> longitud = opcional.map(String::length);

// Filtrar
Optional<String> filtrado = opcional.filter(s -> s.length() > 5);

// Java 9+
opcional.ifPresentOrElse(
    valor -> System.out.println(valor),
    () -> System.out.println("Vacío")
);
```

---

## Lambdas y Method References

### Lambdas

```java
// Función con un parámetro
Function<String, Integer> longitud = s -> s.length();

// Función con múltiples parámetros
BiFunction<Integer, Integer, Integer> suma = (a, b) -> a + b;

// Con bloque de código
Function<String, String> procesar = s -> {
    String resultado = s.toUpperCase();
    return resultado.trim();
};

// Sin parámetros
Supplier<Integer> random = () -> (int) (Math.random() * 100);

// Sin retorno
Consumer<String> imprimir = s -> System.out.println(s);
```

### Method References

```java
// Método estático
Function<String, Integer> parse = Integer::parseInt;

// Método de instancia de un objeto
String texto = "Hola";
Supplier<Integer> longitud = texto::length;

// Método de instancia de una clase
Function<String, String> mayus = String::toUpperCase;

// Constructor
Supplier<ArrayList<String>> constructor = ArrayList::new;
Function<Integer, ArrayList<String>> conCapacidad = ArrayList::new;
```

---

## Parallel Streams

Para procesamiento paralelo:

```java
long suma = numeros.parallelStream()
    .filter(n -> n % 2 == 0)
    .mapToLong(Integer::longValue)
    .sum();
```

**Cuidado**: Solo úsalos si:

1. El dataset es grande (>10,000 elementos)
2. Las operaciones son costosas
3. Las operaciones son independientes (sin estado compartido)

---

## Buenas prácticas

1. **No modifiques la fuente durante el stream**:

```java
// ❌ Mal
lista.stream().forEach(lista::remove);  // ConcurrentModificationException

// ✅ Bien
List<String> nueva = lista.stream()
    .filter(condicion)
    .collect(Collectors.toList());
```

2. **Evita efectos secundarios en operaciones intermedias**:

```java
// ❌ Mal
List<String> resultado = new ArrayList<>();
stream.filter(condicion).forEach(resultado::add);

// ✅ Bien
List<String> resultado = stream
    .filter(condicion)
    .collect(Collectors.toList());
```

3. **No reutilices streams**:

```java
Stream<String> stream = lista.stream();
stream.forEach(System.out::println);
stream.forEach(System.out::println);  // ❌ IllegalStateException
```

4. **Usa streams para operaciones complejas, no para todo**:

```java
// ❌ Excesivo para algo simple
lista.stream().forEach(System.out::println);

// ✅ Más claro
lista.forEach(System.out::println);
```

---

## Próximo paso

Aprende a organizar tu código en proyectos: [Organización de código →](/proyecto/organizacion/)
