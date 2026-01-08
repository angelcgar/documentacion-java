---
title: Clean Code en Java
description: Principios de código limpio aplicados a Java
---

## ¿Qué es Clean Code?

Código que es fácil de leer, entender y mantener. No se trata de que funcione, sino de que sea **comprensible**.

---

## Principios SOLID

### Single Responsibility (Responsabilidad única)

Una clase debe tener una sola razón para cambiar.

```java
// ❌ Hace demasiado
public class Usuario {
    public void guardarEnBaseDatos() { }
    public void enviarEmail() { }
    public void generarReporte() { }
}

// ✅ Una responsabilidad por clase
public class Usuario {
    private String nombre;
    private String email;
}

public class UsuarioRepositorio {
    public void guardar(Usuario usuario) { }
}

public class EmailServicio {
    public void enviar(Usuario usuario, String mensaje) { }
}
```

### Open/Closed (Abierto/Cerrado)

Abierto para extensión, cerrado para modificación.

```java
// ✅ Extensible sin modificar código existente
public interface FiguraGeometrica {
    double calcularArea();
}

public class Circulo implements FiguraGeometrica {
    private double radio;

    @Override
    public double calcularArea() {
        return Math.PI * radio * radio;
    }
}

// Agregar nueva figura sin modificar código existente
public class Cuadrado implements FiguraGeometrica {
    private double lado;

    @Override
    public double calcularArea() {
        return lado * lado;
    }
}
```

### Liskov Substitution (Sustitución de Liskov)

Los subtipos deben poder reemplazar a sus tipos base.

```java
// ❌ Viola LSP
public class Ave {
    public void volar() { }
}

public class Pinguino extends Ave {
    @Override
    public void volar() {
        throw new UnsupportedOperationException();  // ❌
    }
}

// ✅ Diseño correcto
public interface Ave { }

public interface AveVoladora extends Ave {
    void volar();
}

public class Aguila implements AveVoladora {
    @Override
    public void volar() { }
}

public class Pinguino implements Ave {
    // No implementa volar
}
```

### Interface Segregation (Segregación de interfaces)

Interfaces específicas son mejores que una general.

```java
// ❌ Interfaz grande
public interface Trabajador {
    void trabajar();
    void comer();
    void dormir();
}

// ✅ Interfaces pequeñas y específicas
public interface Trabajable {
    void trabajar();
}

public interface Alimentable {
    void comer();
}

public class Empleado implements Trabajable, Alimentable {
    @Override
    public void trabajar() { }

    @Override
    public void comer() { }
}
```

### Dependency Inversion (Inversión de dependencias)

Depende de abstracciones, no de concreciones.

```java
// ❌ Depende de implementación concreta
public class UsuarioServicio {
    private MySQLUsuarioRepositorio repositorio = new MySQLUsuarioRepositorio();
}

// ✅ Depende de abstracción
public interface UsuarioRepositorio {
    Usuario buscar(Long id);
}

public class UsuarioServicio {
    private final UsuarioRepositorio repositorio;

    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }
}
```

---

## Nombres significativos

### Variables

```java
// ❌ Nombres crípticos
int d;
List<String> lst1;

// ✅ Nombres descriptivos
int diasDesdeCreacion;
List<String> usuariosActivos;
```

### Métodos

```java
// ❌ Vago
public void procesar() { }
public void hacer() { }

// ✅ Específico
public void validarDatosUsuario() { }
public void enviarNotificacionEmail() { }
```

---

## Funciones pequeñas

Una función debe hacer **una cosa** y hacerla bien.

```java
// ❌ Función larga que hace muchas cosas
public void procesarPedido(Pedido pedido) {
    // Validar pedido
    if (pedido == null) throw new IllegalArgumentException();
    if (pedido.getItems().isEmpty()) throw new IllegalArgumentException();

    // Calcular total
    double total = 0;
    for (Item item : pedido.getItems()) {
        total += item.getPrecio() * item.getCantidad();
    }
    pedido.setTotal(total);

    // Aplicar descuento
    if (pedido.getCliente().esPremium()) {
        total *= 0.9;
    }

    // Guardar en base de datos
    repositorio.guardar(pedido);

    // Enviar email
    emailServicio.enviar(pedido.getCliente().getEmail(), "Pedido procesado");
}

// ✅ Funciones pequeñas y específicas
public void procesarPedido(Pedido pedido) {
    validarPedido(pedido);
    calcularTotal(pedido);
    guardarPedido(pedido);
    notificarCliente(pedido);
}

private void validarPedido(Pedido pedido) {
    Objects.requireNonNull(pedido, "Pedido no puede ser null");
    if (pedido.getItems().isEmpty()) {
        throw new IllegalArgumentException("Pedido sin items");
    }
}

private void calcularTotal(Pedido pedido) {
    double total = pedido.getItems().stream()
        .mapToDouble(item -> item.getPrecio() * item.getCantidad())
        .sum();

    if (pedido.getCliente().esPremium()) {
        total *= 0.9;
    }

    pedido.setTotal(total);
}
```

---

## DRY (Don't Repeat Yourself)

No repitas código.

```java
// ❌ Duplicación
public double calcularPrecioA(double precio) {
    double impuesto = precio * 0.21;
    return precio + impuesto;
}

public double calcularPrecioB(double precio) {
    double impuesto = precio * 0.21;
    return precio + impuesto;
}

// ✅ Sin duplicación
public double calcularPrecioConImpuesto(double precio) {
    double impuesto = precio * 0.21;
    return precio + impuesto;
}
```

---

## Evita comentarios obvios

El código debe ser autoexplicativo.

```java
// ❌ Comentarios innecesarios
// Obtiene el nombre del usuario
public String getNombre() {
    return nombre;  // Retorna nombre
}

// ✅ Código claro sin comentarios
public String getNombre() {
    return nombre;
}
```

Comenta el **por qué**, no el **qué**:

```java
// ✅ Explica decisiones no obvias
// Usamos un timeout de 30 segundos porque la API externa
// puede tardar hasta 25 segundos en responder bajo carga
public static final int TIMEOUT_SEGUNDOS = 30;
```

---

## Manejo de errores

### Usa excepciones, no códigos de error

```java
// ❌ Códigos de error
public int dividir(int a, int b) {
    if (b == 0) return -1;  // ¿-1 es error o resultado válido?
    return a / b;
}

// ✅ Excepciones
public int dividir(int a, int b) {
    if (b == 0) {
        throw new IllegalArgumentException("No se puede dividir por cero");
    }
    return a / b;
}
```

### No retornes null

```java
// ❌ Retorna null
public Usuario buscarUsuario(Long id) {
    // ...
    return null;  // Obliga al llamador a verificar null
}

// ✅ Usa Optional
public Optional<Usuario> buscarUsuario(Long id) {
    // ...
    return Optional.ofNullable(usuario);
}
```

---

## Inmutabilidad

Objetos inmutables son más seguros.

```java
// ✅ Clase inmutable
public final class Punto {
    private final int x;
    private final int y;

    public Punto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }

    // Para "modificar", retorna nuevo objeto
    public Punto mover(int dx, int dy) {
        return new Punto(x + dx, y + dy);
    }
}

// O usa records
public record Punto(int x, int y) {
    public Punto mover(int dx, int dy) {
        return new Punto(x + dx, y + dy);
    }
}
```

---

## Evita números mágicos

```java
// ❌ Números mágicos
if (usuario.getEdad() > 18) {
    // ...
}

// ✅ Constantes con nombre
private static final int EDAD_MINIMA = 18;

if (usuario.getEdad() > EDAD_MINIMA) {
    // ...
}
```

---

## Composición sobre herencia

```java
// ❌ Herencia para reutilización
public class Stack extends ArrayList {
    public void push(Object value) {
        add(value);
    }
}

// ✅ Composición
public class Stack {
    private List<Object> items = new ArrayList<>();

    public void push(Object value) {
        items.add(value);
    }

    public Object pop() {
        return items.remove(items.size() - 1);
    }
}
```

---

## Tests como documentación

El código de test documenta cómo usar tu código.

```java
@Test
public void deberiaCalcularDescuentoPremium() {
    Usuario usuario = new Usuario("Juan", true);  // premium
    Pedido pedido = new Pedido(100.0);

    double total = pedido.calcularTotal(usuario);

    assertEquals(90.0, total);  // 10% de descuento
}
```

---

## Próximo paso

Aprende a escribir tests efectivos: [Introducción al testing →](/testing/introduccion/)
