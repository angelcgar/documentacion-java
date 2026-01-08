---
title: Introducción al testing
description: Fundamentos de testing en Java
---

## ¿Por qué testear?

Los tests aseguran que:

- El código hace lo que debe hacer
- Los cambios no rompen funcionalidad existente
- El código es fácil de refactorizar
- Actúan como documentación viva

---

## Tipos de tests

### Tests unitarios

Prueban una unidad aislada (método, clase).

```java
@Test
public void deberiaSumarDosNumeros() {
    Calculadora calc = new Calculadora();
    int resultado = calc.sumar(2, 3);
    assertEquals(5, resultado);
}
```

**Características**:

- Rápidos (milisegundos)
- Aislados (sin dependencias externas)
- Repetibles

### Tests de integración

Prueban interacción entre componentes.

```java
@Test
public void deberiaGuardarUsuarioEnBaseDatos() {
    Usuario usuario = new Usuario("Juan", "juan@email.com");
    repositorio.guardar(usuario);

    Usuario guardado = repositorio.buscarPorEmail("juan@email.com");
    assertNotNull(guardado);
    assertEquals("Juan", guardado.getNombre());
}
```

### Tests end-to-end (E2E)

Prueban el sistema completo desde la perspectiva del usuario.

---

## Pirámide de tests

```
     /\
    /E2E\      Pocos, lentos
   /------\
  /Integr.\   Algunos
 /----------\
/ Unitarios \  Muchos, rápidos
/____________\
```

**Mayoría**: Tests unitarios (rápidos, baratos)

**Algunos**: Tests de integración

**Pocos**: Tests E2E (lentos, costosos)

---

## JUnit 5

Framework de testing más usado en Java.

### Dependencia

**Maven**:

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

**Gradle**:

```groovy
testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
```

---

## Anatomía de un test

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraTest {

    @Test
    public void deberiaSumarDosNumeros() {
        // Arrange (preparar)
        Calculadora calc = new Calculadora();

        // Act (actuar)
        int resultado = calc.sumar(2, 3);

        // Assert (verificar)
        assertEquals(5, resultado);
    }
}
```

Patrón **AAA**: Arrange, Act, Assert.

---

## Assertions

### assertEquals

```java
assertEquals(esperado, actual);
assertEquals(5, calc.sumar(2, 3));
```

### assertTrue / assertFalse

```java
assertTrue(usuario.esPremium());
assertFalse(lista.isEmpty());
```

### assertNull / assertNotNull

```java
assertNull(usuario.getEmail());
assertNotNull(repositorio.buscar(1L));
```

### assertThrows

```java
assertThrows(IllegalArgumentException.class, () -> {
    calc.dividir(10, 0);
});
```

### assertAll

Agrupa múltiples assertions:

```java
assertAll(
    () -> assertEquals("Juan", usuario.getNombre()),
    () -> assertEquals(25, usuario.getEdad()),
    () -> assertTrue(usuario.esActivo())
);
```

---

## Ciclo de vida

### @BeforeEach y @AfterEach

Se ejecutan antes/después de **cada** test.

```java
public class UsuarioServicioTest {
    private UsuarioServicio servicio;

    @BeforeEach
    public void setUp() {
        servicio = new UsuarioServicio();
    }

    @AfterEach
    public void tearDown() {
        // Limpiar recursos si es necesario
    }

    @Test
    public void test1() {
        // servicio está inicializado
    }

    @Test
    public void test2() {
        // servicio está inicializado nuevamente (instancia nueva)
    }
}
```

### @BeforeAll y @AfterAll

Se ejecutan una sola vez antes/después de **todos** los tests.

```java
@BeforeAll
public static void inicializar() {
    // Configuración costosa (una sola vez)
    BaseDatos.conectar();
}

@AfterAll
public static void limpiar() {
    BaseDatos.desconectar();
}
```

---

## Tests parametrizados

Ejecuta el mismo test con diferentes valores.

```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4, 5})
public void deberiaSer ParImpar(int numero) {
    assertTrue(numero > 0);
}

@ParameterizedTest
@CsvSource({
    "1, 2, 3",
    "10, 20, 30",
    "5, 5, 10"
})
public void deberiaSumar(int a, int b, int esperado) {
    assertEquals(esperado, calc.sumar(a, b));
}
```

---

## Deshabilitar tests

```java
@Disabled("No implementado aún")
@Test
public void testFuturo() {
    // ...
}
```

---

## Nombres de tests

### Convención Given-When-Then

```java
@Test
public void givenUsuarioPremium_whenCalcularDescuento_thenRetorna10Porciento() {
    // ...
}
```

### Convención should

```java
@Test
public void shouldCalculateDiscountForPremiumUser() {
    // ...
}
```

### Español descriptivo

```java
@Test
public void deberiaAplicarDescuentoDelDiezPorCientoAUsuariosPremium() {
    // ...
}
```

---

## TDD (Test-Driven Development)

Desarrollo guiado por tests:

1. **Red**: Escribe un test que falla
2. **Green**: Escribe el mínimo código para que pase
3. **Refactor**: Mejora el código sin romper el test

```java
// 1. Red: Test que falla
@Test
public void deberiaSumarDosNumeros() {
    Calculadora calc = new Calculadora();
    assertEquals(5, calc.sumar(2, 3));  // ❌ Falla (método no existe)
}

// 2. Green: Implementación mínima
public int sumar(int a, int b) {
    return a + b;  // ✅ Pasa
}

// 3. Refactor: Mejorar si es necesario
```

---

## Cobertura de código

Porcentaje de código ejecutado por los tests.

### JaCoCo (Maven plugin)

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Generar reporte:

```bash
mvn test
# Ver reporte en target/site/jacoco/index.html
```

**Objetivo**: 70-80% de cobertura. 100% no siempre es necesario ni realista.

---

## Buenas prácticas

1. **Un concepto por test**: Cada test verifica una cosa.
2. **Tests independientes**: No deben depender del orden de ejecución.
3. **Nombres descriptivos**: El nombre del test documenta qué se prueba.
4. **Tests rápidos**: Los tests unitarios deben ejecutarse en milisegundos.
5. **Evita lógica en tests**: Los tests deben ser simples.

---

## Próximo paso

Aprende a usar JUnit en profundidad: [JUnit →](/testing/junit/)
