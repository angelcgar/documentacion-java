---
title: JUnit
description: Framework de testing unitario para Java
---

## JUnit 5

JUnit 5 (Jupiter) es el estándar para tests unitarios en Java.

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

## Anotaciones principales

### @Test

Marca un método como test.

```java
@Test
public void deberiaCalcularSuma() {
    assertEquals(5, 2 + 3);
}
```

### @DisplayName

Nombre legible para el test.

```java
@Test
@DisplayName("Debería calcular correctamente el área de un círculo")
public void testAreaCirculo() {
    // ...
}
```

### @Disabled

Deshabilita un test temporalmente.

```java
@Test
@Disabled("Funcionalidad no implementada aún")
public void testFuturo() {
    // ...
}
```

---

## Assertions

### Básicos

```java
// Igualdad
assertEquals(esperado, actual);
assertEquals(5, calc.sumar(2, 3));

// Verdadero/Falso
assertTrue(condicion);
assertFalse(condicion);

// Null
assertNull(objeto);
assertNotNull(objeto);

// Misma instancia
assertSame(esperado, actual);
assertNotSame(esperado, actual);
```

### Con mensaje personalizado

```java
assertEquals(5, calc.sumar(2, 3), "La suma debería ser 5");
```

### assertAll

Ejecuta todos los assertions incluso si algunos fallan.

```java
@Test
public void deberiaValidarUsuario() {
    Usuario usuario = new Usuario("Juan", "juan@email.com", 25);

    assertAll("usuario",
        () -> assertEquals("Juan", usuario.getNombre()),
        () -> assertEquals("juan@email.com", usuario.getEmail()),
        () -> assertEquals(25, usuario.getEdad())
    );
}
```

### assertThrows

Verifica que se lance una excepción.

```java
@Test
public void deberiaLanzarExcepcionAlDividirPorCero() {
    Calculadora calc = new Calculadora();

    assertThrows(ArithmeticException.class, () -> {
        calc.dividir(10, 0);
    });
}

// Con verificación del mensaje
Exception exception = assertThrows(IllegalArgumentException.class, () -> {
    validador.validar("");
});
assertEquals("Valor no puede estar vacío", exception.getMessage());
```

### assertTimeout

Verifica que el código se ejecute en un tiempo límite.

```java
@Test
public void deberiaCompletarEnMenosDe1Segundo() {
    assertTimeout(Duration.ofSeconds(1), () -> {
        // Código que debe completarse rápido
        Thread.sleep(500);
    });
}
```

---

## Ciclo de vida

### @BeforeEach / @AfterEach

```java
public class CalculadoraTest {
    private Calculadora calculadora;

    @BeforeEach
    public void setUp() {
        System.out.println("Antes de cada test");
        calculadora = new Calculadora();
    }

    @AfterEach
    public void tearDown() {
        System.out.println("Después de cada test");
        calculadora = null;
    }

    @Test
    public void test1() {
        // calculadora está inicializada
    }

    @Test
    public void test2() {
        // calculadora está inicializada (nueva instancia)
    }
}
```

### @BeforeAll / @AfterAll

Métodos estáticos que se ejecutan una vez.

```java
public class DatabaseTest {
    private static Database db;

    @BeforeAll
    public static void inicializarBaseDatos() {
        System.out.println("Conectando a base de datos...");
        db = new Database();
        db.conectar();
    }

    @AfterAll
    public static void cerrarBaseDatos() {
        System.out.println("Cerrando conexión...");
        db.desconectar();
    }

    @Test
    public void test1() {
        // db ya está conectada
    }
}
```

---

## Tests parametrizados

### @ValueSource

```java
@ParameterizedTest
@ValueSource(ints = {2, 4, 6, 8, 10})
public void deberiaSer Par(int numero) {
    assertTrue(numero % 2 == 0);
}

@ParameterizedTest
@ValueSource(strings = {"Juan", "María", "Pedro"})
public void deberiaSerNombreValido(String nombre) {
    assertFalse(nombre.isEmpty());
}
```

### @CsvSource

```java
@ParameterizedTest
@CsvSource({
    "1, 2, 3",
    "10, 20, 30",
    "100, 200, 300"
})
public void deberiaSumar(int a, int b, int esperado) {
    assertEquals(esperado, a + b);
}
```

### @MethodSource

```java
@ParameterizedTest
@MethodSource("proveerNumeros")
public void deberiaSerPositivo(int numero) {
    assertTrue(numero > 0);
}

static Stream<Integer> proveerNumeros() {
    return Stream.of(1, 2, 3, 4, 5);
}
```

### @CsvFileSource

```java
@ParameterizedTest
@CsvFileSource(resources = "/datos-test.csv", numLinesToSkip = 1)
public void testDesdeCsv(String nombre, int edad) {
    assertNotNull(nombre);
    assertTrue(edad > 0);
}
```

---

## Tests condicionales

### @EnabledOnOs / @DisabledOnOs

```java
@Test
@EnabledOnOs(OS.LINUX)
public void soloEnLinux() {
    // Solo se ejecuta en Linux
}

@Test
@DisabledOnOs(OS.WINDOWS)
public void noEnWindows() {
    // Se ejecuta en todo excepto Windows
}
```

### @EnabledIf / @DisabledIf

```java
@Test
@EnabledIf("esEntornoDesarrollo")
public void soloEnDev() {
    // ...
}

boolean esEntornoDesarrollo() {
    return "dev".equals(System.getenv("ENV"));
}
```

---

## Assumptions

Ejecuta un test solo si se cumple una condición.

```java
@Test
public void testConAssumption() {
    assumeTrue("dev".equals(System.getenv("ENV")));
    // Solo continúa si ENV=dev

    // Resto del test
}

@Test
public void testConAssumingThat() {
    assumingThat("dev".equals(System.getenv("ENV")),
        () -> {
            // Solo ejecuta esto si ENV=dev
        }
    );

    // Esto siempre se ejecuta
}
```

---

## Nested Tests

Organiza tests relacionados.

```java
@DisplayName("Tests de Stack")
public class StackTest {

    @Nested
    @DisplayName("Cuando está vacío")
    class WhenEmpty {
        private Stack<Integer> stack;

        @BeforeEach
        void crearStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("debería estar vacío")
        void estaVacio() {
            assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("debería lanzar excepción al hacer pop")
        void popLanzaExcepcion() {
            assertThrows(EmptyStackException.class, stack::pop);
        }
    }

    @Nested
    @DisplayName("Cuando tiene elementos")
    class WhenNotEmpty {
        private Stack<Integer> stack;

        @BeforeEach
        void crearStackConElementos() {
            stack = new Stack<>();
            stack.push(1);
            stack.push(2);
        }

        @Test
        @DisplayName("no debería estar vacío")
        void noEstaVacio() {
            assertFalse(stack.isEmpty());
        }

        @Test
        @DisplayName("debería retornar el último elemento")
        void popRetornaUltimo() {
            assertEquals(2, stack.pop());
        }
    }
}
```

---

## Timeouts

### @Timeout

```java
@Test
@Timeout(value = 500, unit = TimeUnit.MILLISECONDS)
public void deberiaCompletarRapido() {
    // Falla si tarda más de 500ms
}
```

---

## Repeated Tests

Ejecuta un test múltiples veces.

```java
@RepeatedTest(10)
public void testRepetido(RepetitionInfo info) {
    System.out.println("Ejecución " + info.getCurrentRepetition()
        + " de " + info.getTotalRepetitions());
}
```

---

## Orden de ejecución

Por defecto, JUnit no garantiza orden. Si necesitas orden:

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrdenadoTest {

    @Test
    @Order(1)
    public void primero() { }

    @Test
    @Order(2)
    public void segundo() { }

    @Test
    @Order(3)
    public void tercero() { }
}
```

**Cuidado**: Tests no deberían depender del orden. Úsalo solo cuando sea necesario.

---

## Buenas prácticas

1. **Nombres descriptivos**: Usa `@DisplayName` o nombres largos.
2. **Un concepto por test**: Cada test prueba una cosa.
3. **AAA pattern**: Arrange, Act, Assert.
4. **Tests independientes**: No deben depender unos de otros.
5. **Tests rápidos**: Los tests unitarios deben ser muy rápidos.

---

## Próximo paso

Aprende a usar mocks para aislar tests: [Mockito →](/testing/mockito/)
