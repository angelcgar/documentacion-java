---
title: REST APIs
description: Crear APIs REST modernas con Spring Boot
---

## REST básico

REST (Representational State Transfer) es un estilo arquitectónico para APIs HTTP.

**Principios**:

- Recursos identificados por URLs
- Operaciones con métodos HTTP (GET, POST, PUT, DELETE)
- Sin estado (stateless)
- Respuestas en JSON/XML

---

## @RestController

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioServicio servicio;

    @GetMapping
    public List<Usuario> listar() {
        return servicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return servicio.crear(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return servicio.actualizar(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
```

---

## Métodos HTTP

| Método | Acción                      | Idempotente |
| ------ | --------------------------- | ----------- |
| GET    | Obtener recursos            | ✅           |
| POST   | Crear recurso               | ❌           |
| PUT    | Actualizar recurso completo | ✅           |
| PATCH  | Actualizar parcialmente     | ❌           |
| DELETE | Eliminar recurso            | ✅           |

---

## Anotaciones

### @RequestMapping

```java
@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    // Base URL: /api/productos
}
```

### @GetMapping

```java
@GetMapping  // GET /api/productos
public List<Producto> listar() { }

@GetMapping("/{id}")  // GET /api/productos/123
public Producto buscar(@PathVariable Long id) { }

@GetMapping("/buscar")  // GET /api/productos/buscar?nombre=laptop
public List<Producto> buscar(@RequestParam String nombre) { }
```

### @PostMapping

```java
@PostMapping  // POST /api/productos
public Producto crear(@RequestBody Producto producto) { }
```

### @PutMapping

```java
@PutMapping("/{id}")  // PUT /api/productos/123
public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) { }
```

### @DeleteMapping

```java
@DeleteMapping("/{id}")  // DELETE /api/productos/123
public void eliminar(@PathVariable Long id) { }
```

---

## Parámetros

### @PathVariable

Variable en la URL.

```java
@GetMapping("/usuarios/{id}")
public Usuario buscar(@PathVariable Long id) {
    return servicio.buscar(id);
}

// GET /usuarios/123 → id=123
```

### @RequestParam

Parámetro de query string.

```java
@GetMapping("/usuarios")
public List<Usuario> buscar(@RequestParam String nombre) {
    return servicio.buscarPorNombre(nombre);
}

// GET /usuarios?nombre=Juan → nombre="Juan"
```

**Parámetro opcional**:

```java
@GetMapping("/usuarios")
public List<Usuario> buscar(
    @RequestParam(required = false) String nombre,
    @RequestParam(defaultValue = "0") int page
) {
    // nombre puede ser null
    // page tiene valor por defecto
}
```

### @RequestBody

Cuerpo de la petición (JSON).

```java
@PostMapping("/usuarios")
public Usuario crear(@RequestBody Usuario usuario) {
    return servicio.crear(usuario);
}

// POST /usuarios
// Body: {"nombre": "Juan", "email": "juan@email.com"}
```

---

## ResponseEntity

Control completo de la respuesta HTTP.

```java
@GetMapping("/{id}")
public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
    Usuario usuario = servicio.buscar(id);

    if (usuario == null) {
        return ResponseEntity.notFound().build();  // 404
    }

    return ResponseEntity.ok(usuario);  // 200
}

@PostMapping
public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
    Usuario creado = servicio.crear(usuario);

    return ResponseEntity
        .status(HttpStatus.CREATED)  // 201
        .body(creado);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    servicio.eliminar(id);
    return ResponseEntity.noContent().build();  // 204
}
```

---

## Códigos de estado HTTP

### Exitosos (2xx)

- **200 OK**: Petición exitosa
- **201 Created**: Recurso creado
- **204 No Content**: Exitoso sin contenido (DELETE)

### Errores del cliente (4xx)

- **400 Bad Request**: Petición inválida
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: Sin permisos
- **404 Not Found**: Recurso no existe
- **409 Conflict**: Conflicto (email duplicado, etc.)

### Errores del servidor (5xx)

- **500 Internal Server Error**: Error en el servidor

---

## Manejo de errores

### @ExceptionHandler

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<String> handleUsuarioNoEncontrado(UsuarioNoEncontradoException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }
}
```

### @ControllerAdvice

Manejo global de excepciones.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioNoEncontrado(UsuarioNoEncontradoException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Error interno del servidor",
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

record ErrorResponse(int status, String mensaje, LocalDateTime timestamp) {}
```

---

## Validación

### Dependencia

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Anotaciones

```java
public class Usuario {

    @NotNull(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombre;

    @Email(message = "Email inválido")
    @NotBlank
    private String email;

    @Min(value = 18, message = "Debe ser mayor de edad")
    private Integer edad;

    @Pattern(regexp = "^[0-9]{9}$", message = "Teléfono debe tener 9 dígitos")
    private String telefono;
}
```

### @Valid en controller

```java
@PostMapping
public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
    Usuario creado = servicio.crear(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body(creado);
}
```

### Manejo de errores de validación

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errores.put(error.getField(), error.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errores);
    }
}
```

**Respuesta**:

```json
{
  "nombre": "El nombre es obligatorio",
  "email": "Email inválido",
  "edad": "Debe ser mayor de edad"
}
```

---

## DTOs (Data Transfer Objects)

Separar modelo de base de datos de la API.

### Sin DTO (❌)

```java
@PostMapping
public Usuario crear(@RequestBody Usuario usuario) {
    return servicio.crear(usuario);
}
```

Problema: Expone toda la entidad (incluido `id`, `password`, etc.).

### Con DTO (✅)

```java
public record CrearUsuarioDTO(
    @NotBlank String nombre,
    @Email String email
) {}

public record UsuarioDTO(
    Long id,
    String nombre,
    String email
) {}
```

```java
@PostMapping
public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody CrearUsuarioDTO dto) {
    Usuario usuario = servicio.crear(dto);
    UsuarioDTO response = new UsuarioDTO(
        usuario.getId(),
        usuario.getNombre(),
        usuario.getEmail()
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

---

## Paginación

```java
@GetMapping
public Page<Usuario> listar(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "nombre") String sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
    return servicio.listar(pageable);
}

// GET /usuarios?page=0&size=20&sort=nombre
```

**Respuesta**:

```json
{
  "content": [
    {"id": 1, "nombre": "Juan"},
    {"id": 2, "nombre": "María"}
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5
}
```

---

## CORS

Permitir peticiones desde otros dominios.

```java
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {
    // Permite peticiones desde React en puerto 3000
}
```

**Configuración global**:

```java
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

---

## Versionado de API

### Por URL

```java
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioV1Controller { }

@RestController
@RequestMapping("/api/v2/usuarios")
public class UsuarioV2Controller { }
```

### Por header

```java
@GetMapping(headers = "X-API-VERSION=1")
public List<Usuario> listarV1() { }

@GetMapping(headers = "X-API-VERSION=2")
public List<Usuario> listarV2() { }
```

---

## Buenas prácticas

1. **Usa DTOs**: No expongas entidades directamente.
2. **Validación**: Usa `@Valid` en todos los inputs.
3. **ResponseEntity**: Control explícito de códigos HTTP.
4. **Manejo de errores global**: `@RestControllerAdvice`.
5. **Paginación**: Para listas grandes.
6. **Versionado**: `/api/v1/...` desde el inicio.
7. **Nombres claros**: Usa sustantivos en plural (`/usuarios`, no `/usuario`).

---

## Próximo paso

Aprende a conectar con bases de datos: [Bases de datos →](/backend/bases-datos/)
