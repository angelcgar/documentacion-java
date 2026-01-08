---
title: Patrones de diseño comunes
description: Patrones de diseño más utilizados en Java
---

## ¿Qué son los patrones de diseño?

Soluciones probadas a problemas comunes en el diseño de software. No son código específico, sino plantillas para resolver problemas.

---

## Singleton

Asegura que una clase tenga solo una instancia.

### Implementación

```java
public class Configuracion {
    private static Configuracion instancia;

    private Configuracion() {
        // Constructor privado
    }

    public static synchronized Configuracion getInstancia() {
        if (instancia == null) {
            instancia = new Configuracion();
        }
        return instancia;
    }
}
```

### Thread-safe con enum (recomendado)

```java
public enum Configuracion {
    INSTANCIA;

    public void cargarConfiguracion() {
        // Lógica de configuración
    }
}

// Uso
Configuracion.INSTANCIA.cargarConfiguracion();
```

### Cuándo usar

- Loggers
- Configuración de aplicación
- Conexiones a bases de datos (pool)

---

## Factory

Crea objetos sin exponer la lógica de creación.

```java
public interface Transporte {
    void entregar();
}

public class Camion implements Transporte {
    @Override
    public void entregar() {
        System.out.println("Entrega por tierra");
    }
}

public class Barco implements Transporte {
    @Override
    public void entregar() {
        System.out.println("Entrega por mar");
    }
}

public class TransporteFactory {
    public static Transporte crearTransporte(String tipo) {
        return switch (tipo) {
            case "tierra" -> new Camion();
            case "mar" -> new Barco();
            default -> throw new IllegalArgumentException("Tipo inválido");
        };
    }
}

// Uso
Transporte transporte = TransporteFactory.crearTransporte("tierra");
transporte.entregar();
```

---

## Builder

Construye objetos complejos paso a paso.

```java
public class Usuario {
    private final String nombre;  // Obligatorio
    private final String email;   // Obligatorio
    private final int edad;       // Opcional
    private final String telefono; // Opcional

    private Usuario(Builder builder) {
        this.nombre = builder.nombre;
        this.email = builder.email;
        this.edad = builder.edad;
        this.telefono = builder.telefono;
    }

    public static class Builder {
        private final String nombre;
        private final String email;
        private int edad;
        private String telefono;

        public Builder(String nombre, String email) {
            this.nombre = nombre;
            this.email = email;
        }

        public Builder edad(int edad) {
            this.edad = edad;
            return this;
        }

        public Builder telefono(String telefono) {
            this.telefono = telefono;
            return this;
        }

        public Usuario build() {
            return new Usuario(this);
        }
    }
}

// Uso
Usuario usuario = new Usuario.Builder("Juan", "juan@email.com")
    .edad(25)
    .telefono("555-1234")
    .build();
```

---

## Strategy

Define una familia de algoritmos intercambiables.

```java
public interface EstrategiaPago {
    void pagar(double monto);
}

public class PagoTarjeta implements EstrategiaPago {
    @Override
    public void pagar(double monto) {
        System.out.println("Pagando " + monto + " con tarjeta");
    }
}

public class PagoPaypal implements EstrategiaPago {
    @Override
    public void pagar(double monto) {
        System.out.println("Pagando " + monto + " con PayPal");
    }
}

public class CarritoCompras {
    private EstrategiaPago estrategiaPago;

    public void setEstrategiaPago(EstrategiaPago estrategia) {
        this.estrategiaPago = estrategia;
    }

    public void checkout(double monto) {
        estrategiaPago.pagar(monto);
    }
}

// Uso
CarritoCompras carrito = new CarritoCompras();
carrito.setEstrategiaPago(new PagoTarjeta());
carrito.checkout(100.0);
```

---

## Observer

Define dependencias entre objetos para notificar cambios.

```java
public interface Observador {
    void actualizar(String mensaje);
}

public class Usuario implements Observador {
    private String nombre;

    public Usuario(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public void actualizar(String mensaje) {
        System.out.println(nombre + " recibió: " + mensaje);
    }
}

public class Notificador {
    private List<Observador> observadores = new ArrayList<>();

    public void agregar(Observador observador) {
        observadores.add(observador);
    }

    public void notificar(String mensaje) {
        for (Observador obs : observadores) {
            obs.actualizar(mensaje);
        }
    }
}

// Uso
Notificador notificador = new Notificador();
notificador.agregar(new Usuario("Juan"));
notificador.agregar(new Usuario("María"));
notificador.notificar("¡Nuevo mensaje!");
```

---

## Decorator

Agrega funcionalidad a objetos dinámicamente.

```java
public interface Cafe {
    double getCosto();
    String getDescripcion();
}

public class CafeSimple implements Cafe {
    @Override
    public double getCosto() {
        return 2.0;
    }

    @Override
    public String getDescripcion() {
        return "Café simple";
    }
}

public abstract class CafeDecorador implements Cafe {
    protected Cafe cafe;

    public CafeDecorador(Cafe cafe) {
        this.cafe = cafe;
    }
}

public class ConLeche extends CafeDecorador {
    public ConLeche(Cafe cafe) {
        super(cafe);
    }

    @Override
    public double getCosto() {
        return cafe.getCosto() + 0.5;
    }

    @Override
    public String getDescripcion() {
        return cafe.getDescripcion() + ", con leche";
    }
}

// Uso
Cafe cafe = new CafeSimple();
cafe = new ConLeche(cafe);
System.out.println(cafe.getDescripcion() + ": $" + cafe.getCosto());
```

---

## Dependency Injection

No es un patrón GoF, pero es fundamental en Java moderno.

```java
// ❌ Sin DI: acoplamiento fuerte
public class UsuarioServicio {
    private UsuarioRepositorio repositorio = new UsuarioRepositorio();
}

// ✅ Con DI: acoplamiento débil
public class UsuarioServicio {
    private final UsuarioRepositorio repositorio;

    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }
}

// Uso (inyección manual)
UsuarioRepositorio repo = new UsuarioRepositorio();
UsuarioServicio servicio = new UsuarioServicio(repo);
```

En Spring, se hace automáticamente:

```java
@Service
public class UsuarioServicio {
    private final UsuarioRepositorio repositorio;

    @Autowired  // Opcional en constructores únicos
    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }
}
```

---

## Cuándo usar cada patrón

| Patrón        | Problema que resuelve                    |
| ------------- | ---------------------------------------- |
| **Singleton** | Necesitas exactamente una instancia      |
| **Factory**   | Creación de objetos compleja o variable  |
| **Builder**   | Objetos con muchos parámetros opcionales |
| **Strategy**  | Múltiples algoritmos intercambiables     |
| **Observer**  | Notificar cambios a múltiples objetos    |
| **Decorator** | Agregar funcionalidad dinámicamente      |

---

## Antipatrones

Patrones que debes **evitar**:

### God Object

```java
// ❌ Una clase que hace todo
public class Sistema {
    public void crearUsuario() { }
    public void enviarEmail() { }
    public void procesarPago() { }
    public void generarReporte() { }
    // 50 métodos más...
}
```

### Spaghetti Code

Código sin estructura clara, con muchos goto (o equivalentes).

### Copypaste Programming

Duplicar código en lugar de reutilizarlo.

---

## Próximo paso

Aprende errores comunes en Java y cómo evitarlos: [Errores comunes →](/practicas/errores-comunes/)
