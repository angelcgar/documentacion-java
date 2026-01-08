---
title: Garbage Collection
description: Gestión automática de memoria en Java
---

## ¿Qué es Garbage Collection?

El Garbage Collector (GC) libera automáticamente la memoria de objetos que ya no se usan. No necesitas liberar memoria manualmente como en C/C++.

```java
public void metodo() {
    Usuario usuario = new Usuario("Juan");
    // Usar usuario
} // usuario ya no es accesible, será recolectado por el GC
```

---

## Cómo funciona

### Objetos alcanzables

Un objeto es alcanzable si puede ser accedido desde:

1. **Variables locales en el stack**
2. **Campos de objetos alcanzables**
3. **Variables estáticas**

Si un objeto NO es alcanzable, es candidato para recolección.

```java
public class Ejemplo {
    private Usuario usuario;  // Alcanzable mientras Ejemplo esté vivo

    public void metodo() {
        Usuario temp = new Usuario();  // Alcanzable solo dentro del método
    }  // temp ya no es alcanzable después de aquí
}
```

---

## Generaciones

La JVM divide el heap en generaciones:

```
┌─────────────────────────────────────────────────┐
│                    HEAP                         │
├───────────────────────┬─────────────────────────┤
│    Young Generation   │   Old Generation        │
│  ┌─────┬─────┬──────┐ │  (Tenured)             │
│  │Eden │ S0  │  S1  │ │                        │
│  └─────┴─────┴──────┘ │                        │
└───────────────────────┴─────────────────────────┘
```

### Young Generation

Objetos nuevos se crean aquí. Se divide en:

- **Eden**: Donde nacen los objetos
- **Survivor 0 y 1**: Para objetos que sobreviven un GC

### Old Generation (Tenured)

Objetos que han sobrevivido varios GC se mueven aquí.

### Ciclo de vida

```
1. Objeto creado → Eden
2. Minor GC ejecuta → Sobrevivientes → Survivor
3. Varios Minor GC → Survivor → Old Generation
4. Major GC limpia Old Generation
```

---

## Tipos de GC

### Minor GC

Limpia Young Generation (rápido, frecuente).

### Major GC / Full GC

Limpia todo el heap (lento, menos frecuente).

---

## Algoritmos de GC

### Serial GC

GC de un solo thread. Para aplicaciones simples.

```bash
java -XX:+UseSerialGC Main
```

### Parallel GC

Múltiples threads para GC. Mejor throughput.

```bash
java -XX:+UseParallelGC Main
```

### G1 GC (Garbage First)

Balance entre throughput y latencia. **Por defecto desde Java 9**.

```bash
java -XX:+UseG1GC Main
```

Divide el heap en regiones y prioriza las que más basura tienen.

### ZGC

Latencias muy bajas (<1ms). Para aplicaciones de baja latencia.

```bash
java -XX:+UseZGC Main
```

### Shenandoah GC

Similar a ZGC, latencias bajas.

```bash
java -XX:+UseShenandoahGC Main
```

---

## ¿Cuál usar?

- **G1 GC**: Por defecto, bueno para la mayoría de casos.
- **Parallel GC**: Si el throughput es más importante que la latencia.
- **ZGC/Shenandoah**: Si necesitas latencias muy bajas (servicios en tiempo real).

---

## Memory Leaks en Java

Aunque Java tiene GC, pueden ocurrir memory leaks si mantienes referencias a objetos que ya no necesitas.

### Ejemplo: Colecciones que crecen sin límite

```java
public class Cache {
    private Map<String, Object> cache = new HashMap<>();

    public void agregar(String clave, Object valor) {
        cache.put(clave, valor);  // ❌ Nunca se limpia, crece infinitamente
    }
}

// ✅ Mejor: usa un cache con límite o expiración
Cache<String, Object> cache = Caffeine.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build();
```

### Ejemplo: Listeners no removidos

```java
public class UI {
    private List<EventListener> listeners = new ArrayList<>();

    public void addListener(EventListener listener) {
        listeners.add(listener);
    }

    // ❌ Si no se remueven, los listeners nunca se recolectan
}

// ✅ Siempre proporciona un método para remover
public void removeListener(EventListener listener) {
    listeners.remove(listener);
}
```

---

## Optimización de memoria

### Usar objetos inmutables

```java
// ✅ Inmutable, puede reutilizarse
String texto = "Hola";

// ❌ Mutable, crea objetos innecesarios en bucles
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Modifica el mismo objeto
}
```

### Evitar concatenación de Strings en bucles

```java
// ❌ Crea un nuevo String en cada iteración
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i;  // Muy ineficiente
}

// ✅ Usa StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String resultado = sb.toString();
```

### Tamaño inicial de colecciones

```java
// ❌ Crece dinámicamente, realoca memoria
List<String> lista = new ArrayList<>();

// ✅ Si sabes el tamaño, especifícalo
List<String> lista = new ArrayList<>(1000);
```

---

## Monitoreo de GC

### Opciones de JVM

Imprimir información de GC:

```bash
java -Xlog:gc* -Xlog:gc+heap=debug Main
```

### VisualVM

Herramienta gráfica para monitorear la JVM:

```bash
jvisualvm
```

Muestra:

- Uso de memoria (heap)
- Actividad de GC
- Threads
- CPU

---

## Buenas prácticas

1. **No llames `System.gc()` manualmente**: La JVM sabe mejor cuándo ejecutar GC.

2. **Libera referencias grandes**: Si terminas de usar un objeto grande, asigna `null`.

```java
byte[] datosGrandes = leerArchivo();
procesarDatos(datosGrandes);
datosGrandes = null;  // Ayuda al GC
```

3. **Usa weak references para caches**:

```java
Map<String, WeakReference<Objeto>> cache = new WeakHashMap<>();
```

4. **Evita finalizers**: Usa try-with-resources en su lugar.

---

## Próximo paso

Aprende a optimizar el rendimiento de tus aplicaciones Java: [Optimización y rendimiento →](/jvm/optimizacion/)
