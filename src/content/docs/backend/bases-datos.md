---
title: Bases de datos
description: Persistencia con JPA, Hibernate y Spring Data
---

## JPA (Java Persistence API)

Especificación estándar para mapeo objeto-relacional (ORM) en Java.

**Hibernate** es la implementación más popular de JPA.

---

## Dependencias

**Maven**:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Base de datos -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

**Gradle**:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'org.postgresql:postgresql'
```

---

## Configuración

**application.properties**:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/midb
spring.datasource.username=postgres
spring.datasource.password=secret

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

**`ddl-auto` options**:

- **`none`**: No hace nada (producción)
- **`validate`**: Valida que el esquema coincida
- **`update`**: Actualiza el esquema sin borrar datos (desarrollo)
- **`create`**: Crea el esquema, borra datos existentes
- **`create-drop`**: Crea al iniciar, elimina al cerrar (tests)

---

## Entidades

### @Entity

```java
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    private Integer edad;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // Constructores, getters, setters
}
```

### Con Lombok

```java
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private Integer edad;
    private LocalDateTime fechaCreacion;
}
```

---

## Tipos de generación de ID

### IDENTITY

Autoincremento de la base de datos.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### SEQUENCE

Usa secuencias de la base de datos.

```java
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuario_seq")
@SequenceGenerator(name = "usuario_seq", sequenceName = "usuario_seq", allocationSize = 1)
private Long id;
```

### UUID

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
```

---

## Relaciones

### @OneToMany

Un usuario tiene muchos posts.

```java
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();
}

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
```

### @ManyToOne

Muchos posts pertenecen a un usuario.

```java
@Entity
public class Post {
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
```

### @ManyToMany

Muchos usuarios, muchos roles.

```java
@Entity
public class Usuario {
    @ManyToMany
    @JoinTable(
        name = "usuario_rol",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<Rol> roles = new HashSet<>();
}

@Entity
public class Rol {
    @ManyToMany(mappedBy = "roles")
    private Set<Usuario> usuarios = new HashSet<>();
}
```

### @OneToOne

Un usuario, un perfil.

```java
@Entity
public class Usuario {
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Perfil perfil;
}

@Entity
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
```

---

## Spring Data JPA

### Repositorio

```java
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    // Métodos CRUD incluidos automáticamente
}
```

**Métodos heredados**:

- `save(Usuario)`: Guardar/actualizar
- `findById(Long)`: Buscar por ID
- `findAll()`: Listar todos
- `delete(Usuario)`: Eliminar
- `count()`: Contar registros
- `existsById(Long)`: Verificar existencia

---

## Query Methods

Spring Data genera consultas automáticamente.

```java
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    // WHERE email = ?
    Usuario findByEmail(String email);

    // WHERE nombre = ? AND edad = ?
    List<Usuario> findByNombreAndEdad(String nombre, Integer edad);

    // WHERE edad > ?
    List<Usuario> findByEdadGreaterThan(Integer edad);

    // WHERE nombre LIKE %?%
    List<Usuario> findByNombreContaining(String nombre);

    // WHERE email LIKE ?%
    List<Usuario> findByEmailStartingWith(String prefix);

    // ORDER BY nombre ASC
    List<Usuario> findAllByOrderByNombreAsc();

    // LIMIT 10
    List<Usuario> findTop10ByOrderByFechaCreacionDesc();
}
```

---

## @Query

Consultas personalizadas.

### JPQL

```java
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Usuario buscarPorEmail(@Param("email") String email);

    @Query("SELECT u FROM Usuario u WHERE u.edad > :edad ORDER BY u.nombre")
    List<Usuario> buscarMayoresQue(@Param("edad") Integer edad);

    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.nombre = :rol")
    List<Usuario> buscarPorRol(@Param("rol") String rol);
}
```

### SQL nativo

```java
@Query(value = "SELECT * FROM usuarios WHERE email = :email", nativeQuery = true)
Usuario buscarPorEmailNativo(@Param("email") String email);
```

---

## Modificación de datos

### @Modifying

```java
@Modifying
@Transactional
@Query("UPDATE Usuario u SET u.nombre = :nombre WHERE u.id = :id")
int actualizarNombre(@Param("id") Long id, @Param("nombre") String nombre);

@Modifying
@Transactional
@Query("DELETE FROM Usuario u WHERE u.edad < :edad")
void eliminarMenoresQue(@Param("edad") Integer edad);
```

---

## Transacciones

### @Transactional

```java
@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio repositorio;

    @Transactional
    public void transferir(Long deId, Long aId, BigDecimal monto) {
        Usuario de = repositorio.findById(deId).orElseThrow();
        Usuario a = repositorio.findById(aId).orElseThrow();

        de.setSaldo(de.getSaldo().subtract(monto));
        a.setSaldo(a.getSaldo().add(monto));

        repositorio.save(de);
        repositorio.save(a);

        // Si algo falla, se hace rollback
    }
}
```

---

## Paginación

```java
@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio repositorio;

    public Page<Usuario> listar(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombre"));
        return repositorio.findAll(pageable);
    }
}
```

**En el repositorio**:

```java
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Page<Usuario> findByEdadGreaterThan(Integer edad, Pageable pageable);
}
```

---

## Auditoría

Guardar quién y cuándo modificó un registro.

### Configuración

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

### Entidad

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Usuario {

    @CreatedDate
    private LocalDateTime fechaCreacion;

    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    @CreatedBy
    private String creadoPor;

    @LastModifiedBy
    private String modificadoPor;
}
```

---

## Proyecciones

Obtener solo algunos campos.

### Interface-based

```java
public interface UsuarioResumen {
    String getNombre();
    String getEmail();
}

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    List<UsuarioResumen> findAllBy();
}
```

### DTO

```java
public record UsuarioDTO(String nombre, String email) {}

@Query("SELECT new com.ejemplo.dto.UsuarioDTO(u.nombre, u.email) FROM Usuario u")
List<UsuarioDTO> obtenerResumen();
```

---

## Migrations con Flyway

Versionado de base de datos.

### Dependencia

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Configuración

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

### Migrations

**`src/main/resources/db/migration/V1__crear_tabla_usuarios.sql`**:

```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    edad INT,
    fecha_creacion TIMESTAMP
);
```

**`V2__agregar_telefono.sql`**:

```sql
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);
```

---

## N+1 Problem

### ❌ Problema

```java
List<Usuario> usuarios = repositorio.findAll();
for (Usuario u : usuarios) {
    System.out.println(u.getPosts().size());  // 1 query por usuario
}
// 1 query para usuarios + N queries para posts = N+1 queries
```

### ✅ Solución: @EntityGraph

```java
@EntityGraph(attributePaths = {"posts"})
List<Usuario> findAll();
// 1 sola query con JOIN
```

### ✅ Solución: JOIN FETCH

```java
@Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.posts")
List<Usuario> findAllWithPosts();
```

---

## Buenas prácticas

1. **`ddl-auto=none` en producción**: Usa Flyway/Liquibase.
2. **Lazy loading por defecto**: Evita cargar relaciones innecesarias.
3. **DTOs para APIs**: No expongas entidades directamente.
4. **Transacciones en servicios**: No en repositorios.
5. **Índices**: Crea índices en columnas de búsqueda frecuente.
6. **Connection pool**: HikariCP (incluido en Spring Boot).

---

## Próximo paso

Aprende patrones de arquitectura backend: [Arquitectura →](/backend/arquitectura/)
