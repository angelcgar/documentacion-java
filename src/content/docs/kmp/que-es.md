---
title: ¿Qué es Kotlin Multiplatform?
description: Introducción breve a KMP como complemento a Java
---

## Introducción

**Kotlin Multiplatform (KMP)** permite compartir código entre múltiples plataformas: Android, iOS, Web, Desktop, Backend.

**No es**: Un reemplazo de Java, ni el foco de esta documentación.

**Es**: Una tecnología complementaria que puede ser útil en ciertos escenarios.

---

## ¿Qué problemas resuelve?

### Sin KMP

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Android    │     │     iOS      │     │     Web      │
│   (Kotlin)   │     │   (Swift)    │     │(TypeScript)  │
└──────────────┘     └──────────────┘     └──────────────┘
      │                     │                     │
      ▼                     ▼                     ▼
  Lógica duplicada    Lógica duplicada    Lógica duplicada
```

### Con KMP

```
┌─────────────────────────────────────────────────────────┐
│         Código compartido (Kotlin)                       │
│   - Modelos de datos                                     │
│   - Lógica de negocio                                    │
│   - Validaciones                                         │
│   - Llamadas a API                                       │
└─────────────────────────────────────────────────────────┘
      │                     │                     │
      ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Android    │     │     iOS      │     │     Web      │
│     (UI)     │     │     (UI)     │     │    (UI)      │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Diferencias con Kotlin/JVM

| Kotlin/JVM                       | Kotlin Multiplatform                   |
| -------------------------------- | -------------------------------------- |
| Solo corre en JVM                | Corre en Android, iOS, Web, JVM        |
| Acceso completo a librerías Java | Limitado a librerías multiplataforma   |
| Ideal para backend con Spring    | Ideal para compartir lógica entre apps |

---

## Ejemplo básico

### Código compartido

```kotlin
// commonMain/kotlin/Usuario.kt
data class Usuario(
    val id: Long,
    val nombre: String,
    val email: String
)

class UsuarioValidator {
    fun validar(usuario: Usuario): Boolean {
        return usuario.nombre.isNotBlank() &&
               usuario.email.contains("@")
    }
}
```

Este código se comparte entre Android, iOS, Web, etc.

### Código específico de plataforma

**Android**:

```kotlin
// androidMain/kotlin/Platform.kt
actual fun obtenerPlataforma(): String = "Android"
```

**iOS**:

```kotlin
// iosMain/kotlin/Platform.kt
actual fun obtenerPlataforma(): String = "iOS"
```

**Uso común**:

```kotlin
// commonMain/kotlin/App.kt
expect fun obtenerPlataforma(): String

fun saludar(): String {
    return "Hola desde ${obtenerPlataforma()}"
}
```

---

## Arquitectura típica

```
shared/
├── commonMain/          # Código común
│   ├── Usuario.kt
│   ├── UsuarioAPI.kt
│   └── Validator.kt
├── androidMain/         # Código Android
│   └── Platform.kt
├── iosMain/             # Código iOS
│   └── Platform.kt
└── jvmMain/             # Código JVM (backend)
    └── Platform.kt

androidApp/              # App Android
iosApp/                  # App iOS
webApp/                  # App Web
```

---

## Librerías multiplataforma

### Ktor (HTTP client)

```kotlin
val client = HttpClient()

suspend fun obtenerUsuario(id: Long): Usuario {
    return client.get("https://api.ejemplo.com/usuarios/$id").body()
}
```

Funciona en Android, iOS, Web, JVM.

### Kotlinx.serialization (JSON)

```kotlin
@Serializable
data class Usuario(
    val id: Long,
    val nombre: String
)

val json = Json.encodeToString(usuario)
val usuario = Json.decodeFromString<Usuario>(json)
```

### SQLDelight (Base de datos)

```sql
-- Usuario.sq
selectAll:
SELECT * FROM usuario;

insert:
INSERT INTO usuario(nombre, email) VALUES (?, ?);
```

Genera código Kotlin que funciona en todas las plataformas.

---

## Comparación con otras soluciones

| Tecnología   | Lenguaje   | Plataformas                | Rendimiento |
| ------------ | ---------- | -------------------------- | ----------- |
| **KMP**      | Kotlin     | Android, iOS, Web, Desktop | Nativo      |
| React Native | JavaScript | Android, iOS               | Bueno       |
| Flutter      | Dart       | Android, iOS, Web, Desktop | Nativo      |
| Java/JVM     | Java       | JVM (Android, Backend)     | Nativo      |

---

## Casos de uso

### ✅ Bueno para:

- **Apps móviles multiplataforma**: Android + iOS con código compartido
- **Lógica de negocio compleja**: Validaciones, cálculos, reglas
- **Modelos de datos**: DTOs compartidos
- **Clientes de API**: Misma lógica de red en todas las plataformas

### ❌ No tan bueno para:

- **Backend puro**: Spring Boot (Java) es mejor
- **UI multiplataforma**: Flutter/React Native son más maduros
- **Proyectos legacy en Java**: Migración costosa
- **Equipos sin experiencia en Kotlin**: Curva de aprendizaje

---

## Limitaciones

1. **Ecosistema más pequeño**: Menos librerías que Java/JVM
2. **Tooling**: IntelliJ IDEA funciona bien, pero menos maduro que Java
3. **Interop con Swift**: Posible pero con fricciones
4. **Build times**: Proyectos grandes pueden ser lentos
5. **Debugging**: Más complejo en iOS

---

## ¿Cuándo considerar KMP?

### Escenario ideal

Tienes una app móvil para Android e iOS, y quieres:

- Compartir lógica de negocio
- Reducir código duplicado
- Mantener UIs nativas

### Ejemplo

```kotlin
// Código compartido (commonMain)
class CarritoCompra {
    private val items = mutableListOf<Producto>()

    fun agregar(producto: Producto) {
        items.add(producto)
    }

    fun calcularTotal(): BigDecimal {
        return items.sumOf { it.precio }
    }
}

// Android usa SwiftUI para UI
// iOS usa Jetpack Compose para UI
// Ambos usan la misma clase CarritoCompra
```

---

## KMP vs Java

**KMP NO reemplaza a Java**. Son complementarios:

- **Java/Spring Boot**: Backend robusto, APIs REST
- **KMP**: Compartir código entre móviles (Android/iOS)

**Ejemplo de arquitectura**:

```
Backend (Java + Spring Boot)
         │
         ▼
    REST API
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Android     iOS
    └────┬────┘
         │
    KMP Shared
```

---

## Recursos

- [kotlinlang.org/docs/multiplatform.html](https://kotlinlang.org/docs/multiplatform.html)
- [Ktor](https://ktor.io/) - HTTP client
- [SQLDelight](https://cashapp.github.io/sqldelight/) - Base de datos
- [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) - UI multiplataforma

---

## Conclusión

KMP es una herramienta específica para compartir código entre plataformas, principalmente móviles.

**No es** la solución a todo, ni un reemplazo de Java.

**Es útil** si necesitas apps Android + iOS con lógica compartida.

Para backend, Java con Spring Boot sigue siendo la mejor opción.

---

## Próximo paso

Si vienes de Java y quieres explorar KMP: [KMP para desarrolladores Java →](/kmp/para-java-devs/)
