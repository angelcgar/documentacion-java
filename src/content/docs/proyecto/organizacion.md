---
title: Organización de código
description: Cómo organizar código Java de forma profesional
---

## Principios de organización

Un proyecto Java bien organizado es fácil de navegar, mantener y escalar. La organización no es solo estética, afecta directamente la productividad.

---

## Estructura básica de un proyecto

```
mi-proyecto/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/empresa/proyecto/
│   │   │       ├── Main.java
│   │   │       ├── modelo/
│   │   │       ├── servicio/
│   │   │       ├── repositorio/
│   │   │       └── util/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── log4j2.xml
│   └── test/
│       ├── java/
│       │   └── com/empresa/proyecto/
│       └── resources/
├── target/  (generado por Maven)
├── pom.xml  (Maven) o build.gradle (Gradle)
└── README.md
```

---

## Convenciones de nomenclatura

### Packages

```
com.empresa.proyecto
com.empresa.proyecto.modelo
com.empresa.proyecto.servicio
com.empresa.proyecto.repositorio
```

- Todo en minúsculas
- Sin guiones bajos ni caracteres especiales
- Dominio invertido (com.empresa en lugar de empresa.com)
- Específico y descriptivo

### Clases e interfaces

```java
public class Usuario { }           // PascalCase
public interface Repositorio { }   // PascalCase
public enum EstadoPedido { }       // PascalCase
```

### Métodos y variables

```java
public void calcularTotal() { }    // camelCase
private int contadorIntentos;      // camelCase
```

### Constantes

```java
public static final int MAX_INTENTOS = 3;
public static final String URL_BASE = "https://api.ejemplo.com";
```

---

## Organización por capas

### Modelo (Entidades/DTOs)

Representan datos:

```java
package com.empresa.proyecto.modelo;

public class Usuario {
    private Long id;
    private String nombre;
    private String email;

    // Constructores, getters, setters
}

public record UsuarioDTO(String nombre, String email) { }
```

### Repositorio (Acceso a datos)

Interactúa con la base de datos:

```java
package com.empresa.proyecto.repositorio;

public interface UsuarioRepositorio {
    Usuario buscarPorId(Long id);
    List<Usuario> buscarTodos();
    void guardar(Usuario usuario);
    void eliminar(Long id);
}
```

### Servicio (Lógica de negocio)

Contiene la lógica principal:

```java
package com.empresa.proyecto.servicio;

public class UsuarioServicio {
    private final UsuarioRepositorio repositorio;

    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public Usuario crearUsuario(String nombre, String email) {
        validarEmail(email);
        Usuario usuario = new Usuario(nombre, email);
        return repositorio.guardar(usuario);
    }

    private void validarEmail(String email) {
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}
```

### Controlador (API/UI)

Maneja entradas y salidas:

```java
package com.empresa.proyecto.controlador;

public class UsuarioControlador {
    private final UsuarioServicio servicio;

    public UsuarioControlador(UsuarioServicio servicio) {
        this.servicio = servicio;
    }

    public void registrarUsuario(String nombre, String email) {
        try {
            Usuario usuario = servicio.crearUsuario(nombre, email);
            System.out.println("Usuario creado: " + usuario.getId());
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
```

---

## Separación de responsabilidades

### Una clase, una responsabilidad

```java
// ❌ Clase que hace demasiado
public class Usuario {
    private String nombre;
    private String email;

    public void guardarEnBaseDatos() { }
    public void enviarEmail() { }
    public void generarReporte() { }
}

// ✅ Responsabilidades separadas
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

public class ReporteServicio {
    public void generar(Usuario usuario) { }
}
```

---

## Organización de archivos

### Un archivo por clase pública

```java
// ❌ Usuario.java contiene múltiples clases públicas
public class Usuario { }
public class Direccion { }  // Error de compilación

// ✅ Un archivo por clase pública
// Usuario.java
public class Usuario { }

// Direccion.java
public class Direccion { }
```

Clases internas están bien:

```java
public class Usuario {
    private Direccion direccion;

    // Clase interna privada
    private static class Direccion {
        String calle;
        String ciudad;
    }
}
```

---

## Packages comunes

### Estructura típica

```
com.empresa.proyecto/
├── Main.java                    // Punto de entrada
├── config/                      // Configuración
│   └── DatabaseConfig.java
├── modelo/                      // Entidades y DTOs
│   ├── Usuario.java
│   ├── Pedido.java
│   └── dto/
│       └── UsuarioDTO.java
├── repositorio/                 // Acceso a datos
│   ├── UsuarioRepositorio.java
│   └── PedidoRepositorio.java
├── servicio/                    // Lógica de negocio
│   ├── UsuarioServicio.java
│   └── PedidoServicio.java
├── controlador/                 // API/UI
│   └── UsuarioControlador.java
├── excepcion/                   // Excepciones personalizadas
│   └── UsuarioNoEncontradoException.java
└── util/                        // Utilidades
    ├── StringUtil.java
    └── DateUtil.java
```

---

## Visibilidad y encapsulación

### Modificadores de acceso

```java
public class Ejemplo {
    public int publico;           // Accesible desde cualquier lugar
    protected int protegido;      // Mismo package + subclases
    int defaultAcceso;            // Mismo package (sin modificador)
    private int privado;          // Solo esta clase

    public void metodoPublico() { }
    protected void metodoProtegido() { }
    void metodoDefault() { }
    private void metodoPrivado() { }
}
```

### Regla general

```java
// ✅ Por defecto, todo privado
public class Usuario {
    private String nombre;
    private int edad;

    // Exponer solo lo necesario
    public String getNombre() {
        return nombre;
    }
}
```

---

## Cohesión y acoplamiento

### Alta cohesión (bueno)

Los elementos de una clase están relacionados:

```java
// ✅ Alta cohesión
public class Pedido {
    private List<LineaPedido> lineas;
    private BigDecimal total;

    public void agregarLinea(LineaPedido linea) {
        lineas.add(linea);
        calcularTotal();
    }

    private void calcularTotal() {
        total = lineas.stream()
            .map(LineaPedido::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

### Bajo acoplamiento (bueno)

Las clases dependen poco entre sí:

```java
// ❌ Alto acoplamiento
public class Servicio {
    private ImplementacionConcreta impl = new ImplementacionConcreta();
}

// ✅ Bajo acoplamiento (inyección de dependencias)
public class Servicio {
    private final Interfaz dependencia;

    public Servicio(Interfaz dependencia) {
        this.dependencia = dependencia;
    }
}
```

---

## Constantes y configuración

### Clase de constantes

```java
public final class Constantes {
    private Constantes() { }  // Prevenir instanciación

    public static final int MAX_REINTENTOS = 3;
    public static final String URL_API = "https://api.ejemplo.com";
}
```

### Enums para valores relacionados

```java
public enum EstadoPedido {
    PENDIENTE,
    PROCESANDO,
    ENVIADO,
    ENTREGADO,
    CANCELADO
}

// Uso
if (pedido.getEstado() == EstadoPedido.ENVIADO) {
    // ...
}
```

---

## Utilidades

### Clases utility

```java
public final class StringUtils {
    private StringUtils() { }  // No instanciable

    public static boolean esVacio(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String capitalizar(String str) {
        if (esVacio(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}

// Uso
if (StringUtils.esVacio(nombre)) {
    throw new IllegalArgumentException("Nombre requerido");
}
```

---

## Recursos (resources/)

### application.properties

```properties
# Base de datos
db.url=jdbc:mysql://localhost:3306/midb
db.usuario=root
db.password=secret

# Logging
logging.level=INFO
```

### Archivos de configuración

```
resources/
├── application.properties       // Configuración principal
├── log4j2.xml                  // Logging
├── messages.properties          // Internacionalización
└── static/                      // Archivos estáticos (web)
    ├── css/
    ├── js/
    └── images/
```

---

## Buenas prácticas

1. **Organiza por feature, no por tipo** (cuando el proyecto crece):

```
// ❌ Por tipo (difícil de navegar en proyectos grandes)
modelo/
  Usuario.java
  Pedido.java
servicio/
  UsuarioServicio.java
  PedidoServicio.java

// ✅ Por feature (más escalable)
usuario/
  Usuario.java
  UsuarioServicio.java
  UsuarioRepositorio.java
pedido/
  Pedido.java
  PedidoServicio.java
  PedidoRepositorio.java
```

2. **Evita packages vacíos o con una sola clase**.

3. **No uses packages "misc", "util", "helper" como cajones de sastre**.

4. **Mantén packages pequeños** (idealmente <10 clases).

5. **Package-private por defecto** si solo se usa internamente en el package.

---

## Próximo paso

Aprende sobre packages y módulos en Java: [Packages y módulos →](/proyecto/packages-modulos/)
