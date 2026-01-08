---
title: Optimización y rendimiento
description: Optimizar aplicaciones Java para mejor rendimiento
---

## Principios de optimización

1. **Primero hazlo funcionar, luego hazlo rápido**: No optimices prematuramente.
2. **Mide antes de optimizar**: Usa profilers para identificar cuellos de botella.
3. **Optimiza lo que importa**: El 80% del tiempo se gasta en el 20% del código.

---

## Profiling

### Herramientas

**JProfiler**: Profiler comercial completo.

**VisualVM**: Gratuito, incluido con el JDK.

```bash
jvisualvm
```

**Java Flight Recorder**: Built-in desde Java 11.

```bash
java -XX:StartFlightRecording=duration=60s,filename=recording.jfr Main
```

Analizar:

```bash
jcmd <pid> JFR.dump filename=recording.jfr
```

---

## Optimización de código

### Evita crear objetos innecesarios

```java
// ❌ Crea un nuevo String en cada iteración
for (int i = 0; i < 1000; i++) {
    String texto = "Iteración " + i;
}

// ✅ Reutiliza StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.setLength(0);
    sb.append("Iteración ").append(i);
}
```

### Usa tipos primitivos cuando sea posible

```java
// ❌ Autoboxing en bucles (crea objetos)
List<Integer> lista = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    lista.add(i);  // Autoboxing: int → Integer
}

// ✅ Array primitivo si no necesitas una List
int[] array = new int[1000];
for (int i = 0; i < 1000; i++) {
    array[i] = i;
}
```

### Lazy initialization

Solo crea objetos cuando se necesitan:

```java
public class Servicio {
    private RecursoGrande recurso;

    public RecursoGrande getRecurso() {
        if (recurso == null) {
            recurso = new RecursoGrande();  // Solo se crea cuando se usa
        }
        return recurso;
    }
}
```

---

## Optimización de colecciones

### Especifica capacidad inicial

```java
// ❌ Crece dinámicamente
List<String> lista = new ArrayList<>();

// ✅ Evita realocaciones
List<String> lista = new ArrayList<>(1000);
```

### Elige la colección correcta

```java
// ❌ Buscar en lista: O(n)
List<String> lista = new ArrayList<>();
if (lista.contains("valor")) { }

// ✅ Buscar en set: O(1)
Set<String> conjunto = new HashSet<>();
if (conjunto.contains("valor")) { }
```

### Usa arrays para colecciones pequeñas y fijas

```java
// ❌ Overhead de ArrayList para pocos elementos
List<String> valores = new ArrayList<>(List.of("a", "b", "c"));

// ✅ Array directo
String[] valores = {"a", "b", "c"};
```

---

## Optimización de Strings

### StringBuilder en bucles

```java
// ❌ Muy ineficiente
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += "valor" + i;
}

// ✅ StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("valor").append(i);
}
String resultado = sb.toString();
```

### String pool

```java
// ✅ Reutiliza Strings del pool
String a = "Hola";
String b = "Hola";  // Misma referencia

// ❌ Crea nuevos objetos
String c = new String("Hola");  // Nuevo objeto innecesario
```

---

## Optimización de I/O

### Buffering

```java
// ❌ Lento: lee byte por byte
try (FileReader fr = new FileReader("archivo.txt")) {
    int c;
    while ((c = fr.read()) != -1) {
        // procesar
    }
}

// ✅ Usa buffer
try (BufferedReader br = new BufferedReader(new FileReader("archivo.txt"))) {
    String linea;
    while ((linea = br.readLine()) != null) {
        // procesar
    }
}
```

### NIO para archivos grandes

```java
// Files.readAllLines carga todo en memoria
List<String> lineas = Files.readAllLines(Path.of("archivo.txt"));

// ✅ Stream procesa línea por línea
try (Stream<String> stream = Files.lines(Path.of("archivo.txt"))) {
    stream.forEach(linea -> procesar(linea));
}
```

---

## Optimización de bases de datos

### Batch operations

```java
// ❌ Un INSERT por vez
for (Usuario usuario : usuarios) {
    statement.executeUpdate("INSERT INTO usuarios VALUES (...)");
}

// ✅ Batch
PreparedStatement ps = connection.prepareStatement("INSERT INTO usuarios VALUES (?, ?)");
for (Usuario usuario : usuarios) {
    ps.setString(1, usuario.getNombre());
    ps.setString(2, usuario.getEmail());
    ps.addBatch();
}
ps.executeBatch();
```

### Connection pooling

```java
// ❌ Crear conexión para cada petición
Connection conn = DriverManager.getConnection(url);
// usar conexión
conn.close();

// ✅ Pool de conexiones (HikariCP, por ejemplo)
HikariDataSource dataSource = new HikariDataSource();
dataSource.setJdbcUrl(url);
dataSource.setMaximumPoolSize(10);
Connection conn = dataSource.getConnection();  // Reutiliza conexiones
```

---

## Caché

### Caché en memoria

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

Cache<String, Usuario> cache = Caffeine.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build();

// Buscar en cache primero
Usuario usuario = cache.get(id, k -> buscarEnBaseDatos(id));
```

### Memoization

```java
public class Fibonacci {
    private Map<Integer, Long> cache = new HashMap<>();

    public long calcular(int n) {
        if (n <= 1) return n;
        return cache.computeIfAbsent(n, k -> calcular(n - 1) + calcular(n - 2));
    }
}
```

---

## Paralelismo

### Parallel Streams

```java
List<Integer> numeros = // lista grande

// Procesamiento paralelo
long suma = numeros.parallelStream()
    .filter(n -> n % 2 == 0)
    .mapToLong(Integer::longValue)
    .sum();
```

**Cuidado**: Solo úsalo si:

- El dataset es grande (>10,000 elementos)
- Las operaciones son costosas
- No hay estado compartido

### CompletableFuture

Para operaciones asíncronas:

```java
CompletableFuture<Usuario> futureUsuario =
    CompletableFuture.supplyAsync(() -> buscarUsuario(id));

CompletableFuture<Pedidos> futurePedidos =
    CompletableFuture.supplyAsync(() -> buscarPedidos(id));

// Esperar ambos resultados
Usuario usuario = futureUsuario.join();
Pedidos pedidos = futurePedidos.join();
```

---

## Configuración de JVM

### Ajustar heap

```bash
# Heap inicial y máximo
java -Xms2g -Xmx4g Main
```

### Elegir Garbage Collector

```bash
# G1 (por defecto)
java -XX:+UseG1GC Main

# ZGC para baja latencia
java -XX:+UseZGC Main
```

### Habilitar optimizaciones

```bash
# Tiered compilation (por defecto)
java -XX:+TieredCompilation Main

# Escape analysis
java -XX:+DoEscapeAnalysis Main
```

---

## Buenas prácticas

1. **Mide siempre**: No asumas dónde está el problema.
2. **Optimiza algoritmos, no código**: Un mejor algoritmo es más efectivo que micro-optimizaciones.
3. **Evita optimización prematura**: Primero claridad, luego rendimiento.
4. **Considera el trade-off**: A veces más memoria = más velocidad.

---

## Próximo paso

Aprende a gestionar dependencias con Maven: [Maven →](/herramientas/maven/)
