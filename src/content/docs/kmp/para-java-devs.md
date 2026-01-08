---
title: KMP para desarrolladores Java
description: Diferencias clave entre Java y Kotlin Multiplatform
---

## Java vs Kotlin: sintaxis básica

### Variables

**Java**:

```java
String nombre = "Juan";
final int edad = 25;
```

**Kotlin**:

```kotlin
var nombre = "Juan"      // Mutable
val edad = 25            // Inmutable (equivale a final)
```

### Null safety

**Java**:

```java
String email = null;  // ⚠️ NullPointerException esperando a ocurrir

if (email != null) {
    System.out.println(email.length());
}
```

**Kotlin**:

```kotlin
val email: String? = null  // Tipo nullable explícito
println(email?.length)     // Safe call, retorna null si email es null

val nonNull: String = "test"  // No puede ser null
```

### Clases

**Java**:

```java
public class Usuario {
    private Long id;
    private String nombre;

    public Usuario(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Getters, setters, equals, hashCode, toString...
}
```

**Kotlin**:

```kotlin
data class Usuario(
    val id: Long,
    val nombre: String
)
// equals, hashCode, toString, copy() generados automáticamente
```

---

## Interoperabilidad Java ↔ Kotlin

### Usar código Java desde Kotlin

```kotlin
// Java
public class UsuarioService {
    public Usuario buscar(Long id) { ... }
}

// Kotlin - funciona directamente
val servicio = UsuarioService()
val usuario = servicio.buscar(1L)
```

### Usar código Kotlin desde Java

**Kotlin**:

```kotlin
class UsuarioService {
    fun buscar(id: Long): Usuario { ... }
}
```

**Java**:

```java
UsuarioService servicio = new UsuarioService();
Usuario usuario = servicio.buscar(1L);
```

---

## Spring Boot con Kotlin

Kotlin funciona perfectamente con Spring Boot.

### Dependencias

```kotlin
plugins {
    kotlin("jvm") version "1.9.20"
    kotlin("plugin.spring") version "1.9.20"
    id("org.springframework.boot") version "3.2.0"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}
```

### Controller

**Java**:

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioServicio servicio;

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return servicio.buscar(id);
    }
}
```

**Kotlin**:

```kotlin
@RestController
@RequestMapping("/api/usuarios")
class UsuarioController(
    private val servicio: UsuarioServicio  // Constructor injection automático
) {
    @GetMapping("/{id}")
    fun buscar(@PathVariable id: Long): Usuario {
        return servicio.buscar(id)
    }
}
```

---

## KMP: más allá de JVM

### Estructura de proyecto KMP

```
shared/
├── commonMain/          # Código común (Android, iOS, JVM, JS)
├── androidMain/         # Código específico Android
├── iosMain/             # Código específico iOS
└── jvmMain/             # Código específico JVM (backend)
```

### Código común

```kotlin
// commonMain/kotlin/Usuario.kt
data class Usuario(
    val id: Long,
    val nombre: String,
    val email: String
)

// Funciona en Android, iOS, Web, JVM
```

### Código específico de plataforma

**expect/actual**:

```kotlin
// commonMain
expect fun obtenerPlataforma(): String

// jvmMain
actual fun obtenerPlataforma(): String = "JVM"

// androidMain
actual fun obtenerPlataforma(): String = "Android"

// iosMain
actual fun obtenerPlataforma(): String = "iOS"
```

---

## Librerías multiplataforma

### Ktor (cliente HTTP)

Reemplazo multiplataforma de RestTemplate/OkHttp.

```kotlin
// Funciona en Android, iOS, JVM, JS
val client = HttpClient()

suspend fun obtenerUsuario(id: Long): Usuario {
    return client.get("https://api.ejemplo.com/usuarios/$id").body()
}
```

### Kotlinx.serialization (JSON)

Reemplazo multiplataforma de Jackson.

```kotlin
@Serializable
data class Usuario(
    val id: Long,
    val nombre: String
)

val json = Json.encodeToString(usuario)
val usuario = Json.decodeFromString<Usuario>(json)
```

### SQLDelight (base de datos)

Reemplazo multiplataforma de JPA.

```sql
-- Usuario.sq
selectAll:
SELECT * FROM usuario;

insert:
INSERT INTO usuario(nombre, email) VALUES (?, ?);
```

Genera código Kotlin que funciona en todas las plataformas.

---

## Comparación: Java backend vs KMP

### Java + Spring Boot (Backend)

✅ Ecosistema maduro (Maven, Gradle, Spring, JPA)

✅ Herramientas excelentes (IntelliJ IDEA, Eclipse)

✅ Documentación extensa

✅ Comunidad enorme

❌ Solo JVM (no móvil nativo)

### Kotlin Multiplatform

✅ Comparte código entre Android, iOS, Web, JVM

✅ Sintaxis moderna (null safety, data classes)

✅ Interop perfecta con Java

❌ Ecosistema más pequeño

❌ Menos librerías multiplataforma

❌ Tooling menos maduro para iOS

---

## Cuándo usar cada uno

### Java + Spring Boot

- **Backend REST API** ✅
- **Microservicios** ✅
- **Aplicaciones empresariales** ✅
- **Proyectos con equipos Java** ✅

### Kotlin Multiplatform

- **Apps móviles (Android + iOS)** ✅
- **Lógica compartida entre plataformas** ✅
- **Equipos con experiencia Kotlin** ✅
- **Backend puro** ❌ (usa Java/Spring)

---

## Arquitectura híbrida

Puedes combinar ambos:

```
┌─────────────────────┐
│  Backend (Java)     │
│  Spring Boot + JPA  │
└──────────┬──────────┘
           │
           ▼
      REST API
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Android         iOS
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │ KMP Shared  │
    │  - Modelos  │
    │  - API      │
    │  - Lógica   │
    └─────────────┘
```

**Backend**: Java con todo su ecosistema.

**Móvil**: KMP para compartir código entre Android/iOS.

---

## Migración de Java a Kotlin

### Paso 1: Proyecto mixto

Puedes tener archivos `.java` y `.kt` en el mismo proyecto.

```
src/main/
├── java/
│   └── com/ejemplo/
│       └── Usuario.java
└── kotlin/
    └── com/ejemplo/
        └── UsuarioService.kt
```

### Paso 2: Convertir gradualmente

IntelliJ IDEA puede convertir Java a Kotlin automáticamente:

**Code → Convert Java File to Kotlin File**

### Paso 3: Refactorizar

Aprovecha features de Kotlin:

```kotlin
// Java
if (usuario != null) {
    System.out.println(usuario.getNombre());
}

// Kotlin
usuario?.let { println(it.nombre) }
```

---

## Diferencias clave

| Concepto                   | Java                            | Kotlin                           |
| -------------------------- | ------------------------------- | -------------------------------- |
| **Null safety**            | `@Nullable`, `Optional`         | `String?`, `?.`, `!!`            |
| **Data classes**           | Lombok o boilerplate            | `data class`                     |
| **Funciones de extensión** | No                              | `fun String.reverse()`           |
| **Coroutines**             | No (threads, CompletableFuture) | `suspend fun`, `async`, `launch` |
| **Default arguments**      | No (overloading)                | `fun foo(x: Int = 5)`            |
| **Smart casts**            | No (cast explícito)             | Automático después de `is`       |

---

## Ejemplo práctico

### Java

```java
@Service
public class UsuarioServicio {
    @Autowired
    private UsuarioRepositorio repositorio;

    public Usuario buscar(Long id) {
        return repositorio.findById(id)
            .orElseThrow(() -> new UsuarioNoEncontradoException(id));
    }

    public List<Usuario> buscarActivos() {
        return repositorio.findAll()
            .stream()
            .filter(Usuario::isActivo)
            .collect(Collectors.toList());
    }
}
```

### Kotlin (JVM)

```kotlin
@Service
class UsuarioServicio(
    private val repositorio: UsuarioRepositorio
) {
    fun buscar(id: Long): Usuario {
        return repositorio.findById(id)
            .orElseThrow { UsuarioNoEncontradoException(id) }
    }

    fun buscarActivos(): List<Usuario> {
        return repositorio.findAll().filter { it.activo }
    }
}
```

### Kotlin (KMP - común)

```kotlin
// Funciona en Android, iOS, JVM
class UsuarioServicio(
    private val apiClient: HttpClient
) {
    suspend fun buscar(id: Long): Usuario {
        return apiClient.get("https://api.ejemplo.com/usuarios/$id").body()
    }

    fun validar(usuario: Usuario): Boolean {
        return usuario.nombre.isNotBlank() && usuario.email.contains("@")
    }
}
```

---

## Recursos para Java devs

- [kotlinlang.org/docs/java-to-kotlin-idioms-strings.html](https://kotlinlang.org/docs/java-to-kotlin-idioms-strings.html) - Idiomas Java → Kotlin
- [spring.io/guides/tutorials/spring-boot-kotlin/](https://spring.io/guides/tutorials/spring-boot-kotlin/) - Spring Boot con Kotlin
- [kotlinlang.org/docs/multiplatform.html](https://kotlinlang.org/docs/multiplatform.html) - Kotlin Multiplatform

---

## Conclusión

**Kotlin** es compatible con Java y puede usarse en proyectos Spring Boot.

**Kotlin Multiplatform** extiende Kotlin más allá de JVM para compartir código entre plataformas.

**Java** sigue siendo excelente para backend empresarial.

**KMP** es útil si necesitas apps móviles multiplataforma.

No son excluyentes: puedes usar ambos en diferentes partes de tu stack.

---

## Próximo paso

Aprende cuándo tiene sentido usar KMP: [¿Cuándo usar KMP? →](/kmp/cuando-usar/)
