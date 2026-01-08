---
title: Arquitectura backend
description: Patrones y buenas prácticas para backends modernos
---

## Arquitectura en capas

Separación de responsabilidades.

```
┌─────────────────────┐
│   Presentación      │  @RestController
│  (Controllers)      │  API REST
├─────────────────────┤
│   Negocio           │  @Service
│   (Services)        │  Lógica de negocio
├─────────────────────┤
│   Persistencia      │  @Repository
│  (Repositories)     │  Acceso a datos
├─────────────────────┤
│   Base de datos     │  PostgreSQL, MySQL, etc.
└─────────────────────┘
```

---

## Capas

### Controller (Presentación)

Recibe peticiones HTTP, valida input, delega al servicio.

```java
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoServicio servicio;

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> buscar(@PathVariable Long id) {
        ProductoDTO producto = servicio.buscar(id);
        return ResponseEntity.ok(producto);
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody CrearProductoDTO dto) {
        ProductoDTO creado = servicio.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}
```

### Service (Negocio)

Contiene la lógica de negocio, transacciones.

```java
@Service
@RequiredArgsConstructor
public class ProductoServicio {

    private final ProductoRepositorio repositorio;
    private final InventarioServicio inventarioServicio;

    @Transactional
    public ProductoDTO crear(CrearProductoDTO dto) {
        // Validaciones de negocio
        if (repositorio.existsByNombre(dto.nombre())) {
            throw new ProductoYaExisteException();
        }

        // Crear entidad
        Producto producto = new Producto();
        producto.setNombre(dto.nombre());
        producto.setPrecio(dto.precio());

        // Guardar
        Producto guardado = repositorio.save(producto);

        // Inicializar inventario
        inventarioServicio.inicializar(guardado.getId());

        // Retornar DTO
        return mapearADTO(guardado);
    }
}
```

### Repository (Persistencia)

Acceso a la base de datos.

```java
@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long> {
    boolean existsByNombre(String nombre);
    List<Producto> findByPrecioLessThan(BigDecimal precio);
}
```

---

## DTOs (Data Transfer Objects)

Separar el modelo de base de datos de la API.

### ❌ Sin DTOs

```java
@Entity
public class Usuario {
    private Long id;
    private String nombre;
    private String password;  // ⚠️ Se expone en la API
    private String rol;
}

@PostMapping
public Usuario crear(@RequestBody Usuario usuario) {
    return repositorio.save(usuario);
}
```

### ✅ Con DTOs

```java
// Request DTO
public record CrearUsuarioDTO(
    @NotBlank String nombre,
    @Email String email,
    @NotBlank String password
) {}

// Response DTO
public record UsuarioDTO(
    Long id,
    String nombre,
    String email
    // password NO se incluye
) {}

@PostMapping
public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody CrearUsuarioDTO dto) {
    Usuario usuario = servicio.crear(dto);
    UsuarioDTO response = new UsuarioDTO(usuario.getId(), usuario.getNombre(), usuario.getEmail());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

---

## Mappers

Convertir entre entidades y DTOs.

### Manual

```java
@Service
public class ProductoMapper {

    public ProductoDTO toDTO(Producto producto) {
        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getPrecio()
        );
    }

    public Producto toEntity(CrearProductoDTO dto) {
        Producto producto = new Producto();
        producto.setNombre(dto.nombre());
        producto.setPrecio(dto.precio());
        return producto;
    }
}
```

### MapStruct

Generación automática de mappers.

**Dependencia**:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

**Mapper**:

```java
@Mapper(componentModel = "spring")
public interface ProductoMapper {
    ProductoDTO toDTO(Producto producto);
    Producto toEntity(CrearProductoDTO dto);
    List<ProductoDTO> toDTOList(List<Producto> productos);
}
```

**Uso**:

```java
@Service
@RequiredArgsConstructor
public class ProductoServicio {
    private final ProductoMapper mapper;

    public ProductoDTO buscar(Long id) {
        Producto producto = repositorio.findById(id).orElseThrow();
        return mapper.toDTO(producto);
    }
}
```

---

## Excepciones personalizadas

```java
public class ProductoNoEncontradoException extends RuntimeException {
    public ProductoNoEncontradoException(Long id) {
        super("Producto con id " + id + " no encontrado");
    }
}

public class ProductoYaExisteException extends RuntimeException {
    public ProductoYaExisteException(String nombre) {
        super("Ya existe un producto con el nombre: " + nombre);
    }
}
```

**Manejo global**:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleProductoNoEncontrado(ProductoNoEncontradoException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}

record ErrorResponse(int status, String mensaje, LocalDateTime timestamp) {}
```

---

## Validación en capas

### Controller

Validación de formato.

```java
public record CrearProductoDTO(
    @NotBlank String nombre,
    @Positive BigDecimal precio
) {}

@PostMapping
public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody CrearProductoDTO dto) {
    // ...
}
```

### Service

Validación de negocio.

```java
@Service
public class ProductoServicio {

    public ProductoDTO crear(CrearProductoDTO dto) {
        // Validación de negocio
        if (repositorio.existsByNombre(dto.nombre())) {
            throw new ProductoYaExisteException(dto.nombre());
        }

        if (dto.precio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new PrecioInvalidoException();
        }

        // ...
    }
}
```

---

## Microservicios

Aplicación dividida en servicios independientes.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Servicio   │     │  Servicio   │     │  Servicio   │
│  Usuarios   │────▶│  Productos  │────▶│  Pedidos    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
    BD Users           BD Products          BD Orders
```

**Ventajas**:

- Escalabilidad independiente
- Despliegue independiente
- Tecnologías heterogéneas

**Desventajas**:

- Complejidad operacional
- Transacciones distribuidas
- Latencia de red

---

## API Gateway

Punto de entrada único para todos los servicios.

```
                    ┌─────────────┐
         ┌─────────▶│  Usuarios   │
         │          └─────────────┘
Cliente ─┤ Gateway  ┌─────────────┐
         │   ────▶  │  Productos  │
         │          └─────────────┘
         └─────────▶┌─────────────┐
                    │  Pedidos    │
                    └─────────────┘
```

**Spring Cloud Gateway**:

```java
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("usuarios", r -> r.path("/api/usuarios/**")
                .uri("http://localhost:8081"))
            .route("productos", r -> r.path("/api/productos/**")
                .uri("http://localhost:8082"))
            .build();
    }
}
```

---

## Event-Driven Architecture

Comunicación asíncrona mediante eventos.

```java
// Publicar evento
@Service
@RequiredArgsConstructor
public class PedidoServicio {
    private final ApplicationEventPublisher eventPublisher;

    public void crear(Pedido pedido) {
        repositorio.save(pedido);
        eventPublisher.publishEvent(new PedidoCreadoEvent(pedido.getId()));
    }
}

// Escuchar evento
@Component
public class NotificacionListener {

    @EventListener
    public void onPedidoCreado(PedidoCreadoEvent event) {
        // Enviar email de confirmación
    }
}
```

**Con RabbitMQ/Kafka**: Comunicación entre microservicios.

---

## CQRS (Command Query Responsibility Segregation)

Separar operaciones de lectura y escritura.

```
Command (Escritura)          Query (Lectura)
┌──────────────┐            ┌──────────────┐
│   Commands   │            │   Queries    │
│  (POST, PUT) │            │    (GET)     │
└──────┬───────┘            └──────┬───────┘
       │                           │
       ▼                           ▼
   BD Escritura                BD Lectura
   (Normalizada)              (Optimizada)
```

```java
// Command
@Service
public class CrearProductoCommand {
    public void ejecutar(CrearProductoDTO dto) {
        // Lógica de escritura
    }
}

// Query
@Service
public class BuscarProductoQuery {
    public ProductoDTO ejecutar(Long id) {
        // Lógica de lectura optimizada
    }
}
```

---

## Circuit Breaker

Protección contra fallos en servicios externos.

**Resilience4j**:

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
</dependency>
```

```java
@Service
public class ExternalApiService {

    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    public String llamarApi() {
        // Llamada a API externa
        return restTemplate.getForObject("http://api.externa/data", String.class);
    }

    public String fallback(Exception ex) {
        return "Servicio no disponible temporalmente";
    }
}
```

---

## Rate Limiting

Limitar número de peticiones por usuario/IP.

**Bucket4j**:

```java
@Component
public class RateLimitFilter implements Filter {

    private final Bucket bucket = Bucket.builder()
        .addLimit(Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1))))
        .build();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);  // Too Many Requests
        }
    }
}
```

---

## Logging estructurado

```java
@Slf4j
@Service
public class ProductoServicio {

    public ProductoDTO crear(CrearProductoDTO dto) {
        log.info("Creando producto: {}", dto.nombre());

        try {
            Producto producto = repositorio.save(toEntity(dto));
            log.info("Producto creado con id: {}", producto.getId());
            return toDTO(producto);
        } catch (Exception ex) {
            log.error("Error al crear producto", ex);
            throw ex;
        }
    }
}
```

---

## Documentación de API

### Swagger/OpenAPI

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

**Anotaciones**:

```java
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "API de gestión de productos")
public class ProductoController {

    @Operation(summary = "Buscar producto por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto encontrado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{id}")
    public ProductoDTO buscar(@PathVariable Long id) {
        // ...
    }
}
```

**URL**: `http://localhost:8080/swagger-ui.html`

---

## Buenas prácticas

1. **Arquitectura en capas**: Controller → Service → Repository.
2. **DTOs**: No expongas entidades directamente.
3. **Validación en capas**: Formato en controller, negocio en service.
4. **Excepciones personalizadas**: Más claras que `RuntimeException`.
5. **Transacciones en servicios**: No en repositorios ni controllers.
6. **Logging estructurado**: Usa SLF4J con niveles apropiados.
7. **Documentación**: Swagger/OpenAPI para APIs públicas.

---

## Próximo paso

Explora Kotlin Multiplatform como complemento: [Kotlin Multiplatform →](/kmp/que-es/)
