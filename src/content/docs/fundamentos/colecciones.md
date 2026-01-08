---
title: Colecciones
description: Framework de colecciones de Java - List, Set, Map y más
---

## ¿Qué son las colecciones?

Las colecciones son estructuras de datos que agrupan múltiples elementos. Java proporciona el Java Collections Framework con interfaces y clases listas para usar.

---

## Jerarquía de colecciones

```
Collection
├── List (ordenadas, permiten duplicados)
│   ├── ArrayList
│   ├── LinkedList
│   └── Vector (obsoleta, usar ArrayList)
├── Set (no ordenadas, sin duplicados)
│   ├── HashSet
│   ├── LinkedHashSet (mantiene orden de inserción)
│   └── TreeSet (ordenada)
└── Queue (colas)
    ├── LinkedList
    └── PriorityQueue

Map (no extiende Collection)
├── HashMap
├── LinkedHashMap
└── TreeMap
```

---

## List

### ArrayList

Array dinámico. Acceso rápido por índice, inserción lenta en medio.

```java
List<String> nombres = new ArrayList<>();

// Agregar elementos
nombres.add("Ana");
nombres.add("Luis");
nombres.add("María");

// Acceder por índice
String primero = nombres.get(0);  // "Ana"

// Modificar
nombres.set(1, "Carlos");  // Reemplaza "Luis"

// Eliminar
nombres.remove(0);  // Elimina "Ana"
nombres.remove("María");  // Elimina por valor

// Tamaño
int tamaño = nombres.size();

// Verificar si está vacío
if (nombres.isEmpty()) {
    System.out.println("Lista vacía");
}

// Contiene elemento
if (nombres.contains("Carlos")) {
    System.out.println("Carlos está en la lista");
}
```

Iterar:

```java
// For-each
for (String nombre : nombres) {
    System.out.println(nombre);
}

// Con índice
for (int i = 0; i < nombres.size(); i++) {
    System.out.println(nombres.get(i));
}

// Iterator
Iterator<String> it = nombres.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// forEach con lambda (Java 8+)
nombres.forEach(nombre -> System.out.println(nombre));
nombres.forEach(System.out::println);  // Method reference
```

### LinkedList

Lista doblemente enlazada. Inserción/eliminación rápida, acceso lento por índice.

```java
List<String> lista = new LinkedList<>();

lista.add("Primero");
lista.add("Segundo");

// También implementa Deque (cola de doble extremo)
LinkedList<String> deque = new LinkedList<>();
deque.addFirst("Inicio");
deque.addLast("Final");
String primero = deque.removeFirst();
String ultimo = deque.removeLast();
```

### ¿ArrayList o LinkedList?

- **ArrayList**: Usa por defecto. Mejor para acceso aleatorio.
- **LinkedList**: Solo si insertas/eliminas mucho en medio de la lista.

---

## Set

Sin duplicados, no mantiene orden (excepto LinkedHashSet y TreeSet).

### HashSet

```java
Set<String> conjunto = new HashSet<>();

conjunto.add("Java");
conjunto.add("Python");
conjunto.add("Java");  // No se agrega (duplicado)

System.out.println(conjunto.size());  // 2

// Verificar existencia
if (conjunto.contains("Java")) {
    System.out.println("Contiene Java");
}

// Eliminar
conjunto.remove("Python");

// Iterar
for (String lenguaje : conjunto) {
    System.out.println(lenguaje);
}
```

### LinkedHashSet

Mantiene el orden de inserción:

```java
Set<String> conjunto = new LinkedHashSet<>();
conjunto.add("Tercero");
conjunto.add("Primero");
conjunto.add("Segundo");

// Itera en el orden de inserción
```

### TreeSet

Ordena elementos automáticamente:

```java
Set<Integer> numeros = new TreeSet<>();
numeros.add(5);
numeros.add(1);
numeros.add(3);

System.out.println(numeros);  // [1, 3, 5]
```

---

## Map

Asocia claves con valores. Las claves no pueden duplicarse.

### HashMap

```java
Map<String, Integer> edades = new HashMap<>();

// Agregar pares clave-valor
edades.put("Juan", 25);
edades.put("María", 30);
edades.put("Carlos", 28);

// Obtener valor
int edadJuan = edades.get("Juan");  // 25

// Si no existe, retorna null
Integer edadPedro = edades.get("Pedro");  // null

// getOrDefault
int edad = edades.getOrDefault("Pedro", 0);  // 0

// Verificar si existe clave
if (edades.containsKey("María")) {
    System.out.println("María existe");
}

// Verificar si existe valor
if (edades.containsValue(25)) {
    System.out.println("Alguien tiene 25 años");
}

// Eliminar
edades.remove("Carlos");

// Tamaño
int tamaño = edades.size();
```

Iterar:

```java
// Por entradas (clave-valor)
for (Map.Entry<String, Integer> entry : edades.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Solo claves
for (String nombre : edades.keySet()) {
    System.out.println(nombre);
}

// Solo valores
for (Integer edad : edades.values()) {
    System.out.println(edad);
}

// Con forEach (Java 8+)
edades.forEach((nombre, edad) ->
    System.out.println(nombre + ": " + edad)
);
```

Métodos útiles (Java 8+):

```java
// putIfAbsent: solo agrega si no existe
edades.putIfAbsent("Pedro", 35);

// computeIfAbsent: calcula el valor si no existe
Map<String, List<String>> mapa = new HashMap<>();
mapa.computeIfAbsent("grupo1", k -> new ArrayList<>()).add("elemento");

// merge: combina valores
edades.merge("Juan", 1, (viejo, nuevo) -> viejo + nuevo);  // Incrementa
```

### LinkedHashMap

Mantiene orden de inserción:

```java
Map<String, Integer> mapa = new LinkedHashMap<>();
```

### TreeMap

Ordena por claves:

```java
Map<String, Integer> mapa = new TreeMap<>();
mapa.put("Zebra", 1);
mapa.put("Apple", 2);
mapa.put("Banana", 3);

// Itera en orden alfabético: Apple, Banana, Zebra
```

---

## Queue

### LinkedList como Queue

```java
Queue<String> cola = new LinkedList<>();

// Agregar elementos
cola.offer("Primero");
cola.offer("Segundo");
cola.offer("Tercero");

// Ver el primero sin eliminarlo
String primero = cola.peek();  // "Primero"

// Eliminar y obtener el primero
String eliminado = cola.poll();  // "Primero"

// Si está vacía, peek() y poll() retornan null
```

### PriorityQueue

Cola con prioridad (min-heap por defecto):

```java
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.offer(1);
pq.offer(3);

System.out.println(pq.poll());  // 1 (el menor)
System.out.println(pq.poll());  // 3
System.out.println(pq.poll());  // 5
```

Con comparador personalizado:

```java
Queue<String> pq = new PriorityQueue<>(
    (a, b) -> b.length() - a.length()  // Por longitud, descendente
);
```

---

## Deque (Double-Ended Queue)

Cola de doble extremo:

```java
Deque<String> deque = new ArrayDeque<>();

// Agregar al inicio y final
deque.addFirst("Primero");
deque.addLast("Último");

// Eliminar del inicio y final
String primero = deque.removeFirst();
String ultimo = deque.removeLast();

// Usar como pila (LIFO)
deque.push("Elemento");
String top = deque.pop();
```

---

## Operaciones útiles

### Ordenar listas

```java
List<Integer> numeros = Arrays.asList(5, 2, 8, 1, 9);

// Orden natural
Collections.sort(numeros);

// Con comparador
numeros.sort((a, b) -> b - a);  // Descendente

// O con Comparator
numeros.sort(Comparator.reverseOrder());
```

### Buscar en listas ordenadas

```java
List<Integer> numeros = Arrays.asList(1, 2, 5, 8, 9);
int indice = Collections.binarySearch(numeros, 5);  // 2
```

### Copiar colecciones

```java
// Copia superficial
List<String> copia = new ArrayList<>(original);

// Inmutable
List<String> inmutable = List.copyOf(original);
```

### Convertir array a lista

```java
String[] array = {"uno", "dos", "tres"};

// Lista de tamaño fijo (no se puede agregar/eliminar)
List<String> lista1 = Arrays.asList(array);

// Lista mutable
List<String> lista2 = new ArrayList<>(Arrays.asList(array));

// Java 9+
List<String> lista3 = List.of("uno", "dos", "tres");  // Inmutable
```

---

## Colecciones inmutables (Java 9+)

```java
List<String> lista = List.of("uno", "dos", "tres");
Set<String> conjunto = Set.of("a", "b", "c");
Map<String, Integer> mapa = Map.of("uno", 1, "dos", 2);

// No se pueden modificar
lista.add("cuatro");  // ❌ UnsupportedOperationException
```

---

## Comparar objetos personalizados

### Comparable

```java
public class Persona implements Comparable<Persona> {
    private String nombre;
    private int edad;

    @Override
    public int compareTo(Persona otra) {
        return Integer.compare(this.edad, otra.edad);
    }
}

List<Persona> personas = new ArrayList<>();
Collections.sort(personas);  // Usa compareTo
```

### Comparator

```java
List<Persona> personas = new ArrayList<>();

// Por nombre
personas.sort(Comparator.comparing(Persona::getNombre));

// Por edad
personas.sort(Comparator.comparing(Persona::getEdad));

// Por múltiples criterios
personas.sort(
    Comparator.comparing(Persona::getEdad)
              .thenComparing(Persona::getNombre)
);
```

---

## Buenas prácticas

1. **Programa contra la interfaz, no la implementación**:

```java
// ✅ Bueno
List<String> lista = new ArrayList<>();

// ❌ Menos flexible
ArrayList<String> lista = new ArrayList<>();
```

2. **Especifica la capacidad inicial si conoces el tamaño**:

```java
List<String> lista = new ArrayList<>(1000);  // Evita realocaciones
```

3. **Usa colecciones inmutables cuando sea posible**:

```java
List<String> constantes = List.of("UNO", "DOS", "TRES");
```

4. **Cuidado con null en colecciones**:

```java
// HashSet, HashMap permiten null
// TreeSet, TreeMap no permiten null
```

---

## Próximo paso

Aprende sobre programación funcional y Streams: [Streams →](/fundamentos/streams/)
