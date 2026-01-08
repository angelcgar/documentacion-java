---
title: Convenciones de código
description: Estándares y convenciones para escribir código Java limpio
---

## ¿Por qué son importantes?

Las convenciones aseguran que el código sea:

- **Legible**: Otros (y tú futuro) lo entienden fácilmente
- **Mantenible**: Facilita cambios y correcciones
- **Profesional**: Demuestra experiencia y cuidado

---

## Nomenclatura

### Clases e interfaces

**PascalCase**: Cada palabra comienza con mayúscula.

```java
// ✅ Correcto
public class UsuarioServicio { }
public interface Repositorio { }
public class ContadorVisitas { }

// ❌ Incorrecto
public class usuario_servicio { }
public class usuarioservicio { }
```

**Nombres descriptivos**:

```java
// ✅ Claro
public class GestorAutenticacion { }

// ❌ Vago
public class Manager { }
public class Helper { }
```

### Métodos y variables

**camelCase**: Primera palabra en minúscula, resto con mayúscula inicial.

```java
// ✅ Correcto
public void calcularTotal() { }
private int cantidadElementos;
String nombreCompleto;

// ❌ Incorrecto
public void CalcularTotal() { }
private int cantidad_elementos;
```

**Verbos para métodos, sustantivos para variables**:

```java
// ✅ Métodos con verbos
public void guardar() { }
public int calcular() { }
public boolean estaActivo() { }

// ✅ Variables con sustantivos
String nombre;
int edad;
List<Usuario> usuarios;
```

### Constantes

**MAYÚSCULAS con guiones bajos**:

```java
// ✅ Correcto
public static final int MAX_INTENTOS = 3;
public static final String URL_BASE = "https://api.ejemplo.com";

// ❌ Incorrecto
public static final int maxIntentos = 3;
```

### Packages

**Todo en minúsculas, sin guiones bajos**:

```java
// ✅ Correcto
package com.empresa.proyecto.modelo;

// ❌ Incorrecto
package com.Empresa.Proyecto.Modelo;
package com.empresa.proyecto.mi_modelo;
```

---

## Formato

### Indentación

**4 espacios** (o 1 tab configurado como 4 espacios).

```java
public class Ejemplo {
    public void metodo() {
        if (condicion) {
            // Código indentado
        }
    }
}
```

### Llaves

**Estilo Java (Egyptian brackets)**:

```java
// ✅ Correcto
public void metodo() {
    if (condicion) {
        // código
    } else {
        // código
    }
}

// ❌ Incorrecto (estilo C#/Allman)
public void metodo()
{
    if (condicion)
    {
        // código
    }
}
```

### Líneas vacías

```java
// ✅ Separa bloques lógicos
public class Usuario {
    private String nombre;
    private int edad;

    public Usuario(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    public String getNombre() {
        return nombre;
    }
}
```

### Longitud de línea

**Máximo 120 caracteres por línea** (algunos proyectos usan 80 o 100).

```java
// ✅ Partir líneas largas
String mensaje = String.format(
    "El usuario %s ha iniciado sesión desde %s",
    usuario.getNombre(),
    direccionIP
);
```

---

## Orden de elementos en una clase

```java
public class Ejemplo {
    // 1. Constantes
    public static final String CONSTANTE = "valor";

    // 2. Variables estáticas
    private static int contador = 0;

    // 3. Campos de instancia
    private String nombre;
    private int edad;

    // 4. Constructores
    public Ejemplo() { }

    public Ejemplo(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    // 5. Métodos públicos
    public void metodoPublico() { }

    // 6. Métodos privados/protegidos
    private void metodoPrivado() { }

    // 7. Getters y setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // 8. equals, hashCode, toString (al final)
    @Override
    public boolean equals(Object obj) {
        // implementación
    }
}
```

---

## Nombres significativos

### Variables

```java
// ❌ Nombres crípticos
int d;  // ¿Qué es 'd'?
String s;
List<Usuario> list;

// ✅ Nombres descriptivos
int diasDesdeCreacion;
String nombreCompleto;
List<Usuario> usuariosActivos;
```

### Evita prefijos

```java
// ❌ Notación húngara (obsoleta)
String strNombre;
int iEdad;

// ✅ Nombres directos
String nombre;
int edad;
```

### Booleanos

Prefijos: `is`, `has`, `can`, `should`

```java
// ✅ Claro
boolean esActivo;
boolean tienePermisos;
boolean puedeEditar;
boolean deberiaValidar;

// ❌ Ambiguo
boolean activo;
boolean permisos;
```

---

## Comentarios

### Cuándo comentar

```java
// ✅ Código claro, sin comentarios necesarios
public int calcularEdad(LocalDate fechaNacimiento) {
    return Period.between(fechaNacimiento, LocalDate.now()).getYears();
}

// ❌ Comentarios obvios
// Obtiene el nombre
public String getNombre() {
    return nombre;  // Retorna nombre
}
```

### Javadoc para APIs públicas

```java
/**
 * Calcula el total de un pedido aplicando descuentos.
 *
 * @param pedido el pedido a calcular
 * @param descuento porcentaje de descuento (0-100)
 * @return el total con descuento aplicado
 * @throws IllegalArgumentException si el descuento es inválido
 */
public BigDecimal calcularTotal(Pedido pedido, int descuento) {
    if (descuento < 0 || descuento > 100) {
        throw new IllegalArgumentException("Descuento inválido");
    }
    // implementación
}
```

### Comentarios TODO

```java
// TODO: Implementar caché para mejorar rendimiento
// TODO(juan): Revisar lógica de validación
```

---

## Imports

### Orden

1. Imports de `java.*`
2. Imports de `javax.*`
3. Imports de terceros
4. Imports de tu proyecto

```java
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.empresa.proyecto.modelo.Usuario;
```

### No uses wildcard imports

```java
// ❌ Evitar
import java.util.*;

// ✅ Específico
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
```

---

## Anotaciones

### Una por línea

```java
// ✅ Correcto
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

---

## Herramientas

### Checkstyle

Valida convenciones automáticamente.

**Maven**:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.0</version>
</plugin>
```

### Formatter

IntelliJ IDEA: `Ctrl+Alt+L` (Windows/Linux) o `Cmd+Alt+L` (macOS)

Eclipse: `Ctrl+Shift+F`

---

## Buenas prácticas

1. **Sigue las convenciones del proyecto**: Si el proyecto usa un estilo diferente, adáptate.

2. **Configura tu IDE**: Formatea automáticamente al guardar.

3. **Usa herramientas**: Checkstyle, SpotBugs, SonarLint.

4. **Revisa código**: Code reviews ayudan a mantener consistencia.

---

## Próximo paso

Aprende patrones de diseño comunes en Java: [Patrones de diseño →](/practicas/patrones/)
