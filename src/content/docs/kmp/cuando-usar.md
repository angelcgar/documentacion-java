---
title: ¿Cuándo usar Kotlin Multiplatform?
description: Escenarios donde KMP tiene sentido (y dónde no)
---

## Casos de uso ideales

### 1. Apps móviles multiplataforma

**Escenario**: Necesitas una app para Android e iOS.

**Con KMP**:

```
┌─────────────────────────────────────┐
│     Código compartido (50-70%)      │
│   - Modelos de datos                │
│   - Lógica de negocio               │
│   - Llamadas a API                  │
│   - Validaciones                    │
└─────────────────────────────────────┘
         │                   │
         ▼                   ▼
   ┌──────────┐        ┌──────────┐
   │ Android  │        │   iOS    │
   │   UI     │        │   UI     │
   │ (Compose)│        │(SwiftUI) │
   └──────────┘        └──────────┘
```

**Ventajas**:

- Una sola implementación de lógica
- Menos bugs (código duplicado = bugs duplicados)
- Más rápido de desarrollar
- UIs nativas en cada plataforma

---

### 2. SDK multiplataforma

**Escenario**: Quieres distribuir una librería que funcione en múltiples plataformas.

**Ejemplo**: Cliente de una API.

```kotlin
// Librería KMP
class MiAPIClient(private val apiKey: String) {
    suspend fun obtenerDatos(): List<Dato> {
        // Lógica compartida
    }
}

// Uso en Android
val client = MiAPIClient("key123")
val datos = client.obtenerDatos()

// Uso en iOS (Swift)
let client = MiAPIClient(apiKey: "key123")
let datos = try await client.obtenerDatos()

// Uso en JVM
val client = MiAPIClient("key123")
val datos = runBlocking { client.obtenerDatos() }
```

---

### 3. Lógica de negocio compleja

**Escenario**: Tienes algoritmos o reglas de negocio complejas que quieres consistentes en todas las plataformas.

**Ejemplo**: Cálculo de impuestos.

```kotlin
// commonMain
class CalculadoraImpuestos {
    fun calcular(monto: BigDecimal, pais: Pais): BigDecimal {
        return when (pais) {
            Pais.MEXICO -> monto * BigDecimal("0.16")
            Pais.ESPAÑA -> monto * BigDecimal("0.21")
            // ...
        }
    }
}

// Se usa igual en Android, iOS, Web, Backend
```

**Sin KMP**: Implementación duplicada en Swift (iOS), Kotlin (Android), TypeScript (Web), Java (Backend) → errores inconsistentes.

---

## Casos donde NO tiene sentido

### 1. Backend puro

**❌ No uses KMP para backend REST API**.

**✅ Usa Java + Spring Boot**.

**Razones**:

- Spring tiene un ecosistema maduro (Spring Data, Security, Cloud, etc.)
- Herramientas de Java más maduras (profilers, APM, etc.)
- Comunidad más grande para backend
- KMP no añade valor (no necesitas multiplataforma en backend)

---

### 2. App solo para Android

**❌ No necesitas KMP si solo desarrollas para Android**.

**✅ Usa Kotlin/JVM estándar**.

KMP añade complejidad innecesaria si no tienes múltiples plataformas.

---

### 3. Proyectos legacy en Java

**❌ No migres un proyecto Java maduro a KMP solo por hacerlo**.

**✅ Mantén Java si funciona bien**.

**Migración tiene sentido solo si**:

- Planeas expandir a iOS/Web
- Tienes recursos para aprender Kotlin
- El beneficio justifica el esfuerzo

---

### 4. UI multiplataforma

**❌ KMP no es ideal para UI compartida**.

**✅ Para UI multiplataforma considera**:

- **Flutter** (Dart) - UI compartida madura
- **React Native** (JavaScript) - Ecosistema grande
- **Compose Multiplatform** (experimental) - Si ya usas Compose

KMP es mejor para **lógica**, no para UI.

---

## Comparación con alternativas

### KMP vs Flutter

| Aspecto               | KMP                          | Flutter         |
| --------------------- | ---------------------------- | --------------- |
| **Lenguaje**          | Kotlin                       | Dart            |
| **UI**                | Nativa (SwiftUI, Compose)    | Widget propio   |
| **Rendimiento**       | Nativo                       | Casi nativo     |
| **Madurez**           | Menos maduro                 | Más maduro      |
| **Código compartido** | 50-70%                       | 90-95%          |
| **Uso**               | Lógica compartida, UI nativa | Todo compartido |

**Elige KMP si**: Prefieres UIs nativas (SwiftUI/Compose).

**Elige Flutter si**: Quieres UI compartida y no te importa aprender Dart.

---

### KMP vs React Native

| Aspecto         | KMP     | React Native          |
| --------------- | ------- | --------------------- |
| **Lenguaje**    | Kotlin  | JavaScript/TypeScript |
| **UI**          | Nativa  | Componentes JS        |
| **Rendimiento** | Nativo  | Bueno (bridge)        |
| **Ecosistema**  | Pequeño | Grande                |
| **Tipado**      | Fuerte  | Débil (TS ayuda)      |

**Elige KMP si**: Vienes de Android/JVM y prefieres tipado fuerte.

**Elige React Native si**: Tu equipo domina JavaScript/React.

---

## Arquitectura recomendada

### Backend + Móvil

```
┌─────────────────────┐
│  Backend (Java)     │  ← Spring Boot
│  REST API           │
└──────────┬──────────┘
           │
           ▼
      HTTP API
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌─────────┐
│ Android │  │   iOS   │
└────┬────┘  └────┬────┘
     └──────┬─────┘
            │
    ┌───────▼──────┐
    │  KMP Shared  │  ← Lógica compartida
    │  - Modelos   │
    │  - API calls │
    │  - Validación│
    └──────────────┘
```

**Backend**: Java (Spring Boot, ecosistema maduro).

**Móvil**: KMP para lógica compartida, UIs nativas.

---

## Checklist: ¿Debería usar KMP?

### ✅ Usa KMP si:

- [x] Necesitas apps para Android e iOS
- [x] Quieres reducir código duplicado
- [x] Tu equipo conoce Kotlin (o está dispuesto a aprender)
- [x] Prefieres UIs nativas (SwiftUI, Compose)
- [x] Tienes lógica de negocio compleja

### ❌ No uses KMP si:

- [ ] Solo desarrollas para una plataforma
- [ ] Tu backend es Java puro (usa Spring Boot)
- [ ] Prefieres UI compartida (considera Flutter)
- [ ] Tu equipo no tiene experiencia en Kotlin
- [ ] El proyecto es legacy y funciona bien

---

## Ejemplo real

### Startup con app móvil

**Requisitos**:

- App para Android e iOS
- Backend REST API
- Lógica de negocio compleja (pagos, inventario)

**Arquitectura**:

1. **Backend**: Java + Spring Boot
   - REST API
   - Base de datos (PostgreSQL)
   - Autenticación (Spring Security)

2. **Móvil**: Kotlin Multiplatform
   - Lógica compartida (modelos, API client, validaciones)
   - UI nativa en Android (Jetpack Compose)
   - UI nativa en iOS (SwiftUI)

**Resultado**:

- Backend robusto con ecosistema maduro
- Móvil con 60% de código compartido
- UIs nativas y performantes
- Menos bugs por duplicación de lógica

---

## Riesgos de KMP

1. **Madurez**: Menos maduro que Java o React Native.
2. **Tooling**: Xcode + KMP puede tener fricciones.
3. **Curva de aprendizaje**: Equipos Java necesitan aprender Kotlin.
4. **Librerías**: Ecosistema multiplataforma más pequeño.
5. **Build times**: Proyectos grandes pueden tardar en compilar.

---

## ¿Vale la pena?

### Sí, si:

- Tienes recursos para invertir en aprendizaje
- Planeas mantener la app a largo plazo
- El ahorro de código justifica la complejidad inicial

### No, si:

- Necesitas velocidad inmediata (usa React Native/Flutter)
- Tu equipo no tiene experiencia en Kotlin
- Es un prototipo o MVP rápido

---

## Conclusión

**KMP es una herramienta especializada**, no una solución universal.

**Usa KMP para**: Apps móviles Android + iOS con lógica compartida.

**No uses KMP para**: Backend (usa Java/Spring), proyectos de una sola plataforma, o si prefieres UI compartida (Flutter/React Native).

**Java sigue siendo el rey para backend empresarial**.

KMP es un complemento, no un reemplazo.

---

## Recursos

- [kotlinlang.org/lp/multiplatform](https://kotlinlang.org/lp/multiplatform/) - Casos de éxito
- [touchlab.co/kmp-decision-tree](https://touchlab.co/) - Touchlab (consultoría KMP)
- [medium.com/tag/kotlin-multiplatform](https://medium.com/tag/kotlin-multiplatform) - Experiencias reales

---

¡Esto concluye la sección de Kotlin Multiplatform!

**Recuerda**: Esta documentación es sobre Java. KMP es solo un complemento que puede ser útil en ciertos escenarios, pero Java es el foco principal.

**Próximo paso**: Vuelve a las secciones principales de Java: [Volver al inicio →](/)
