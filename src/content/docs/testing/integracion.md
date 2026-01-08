---
title: Tests de integración
description: Pruebas con componentes reales y dependencias externas
---

## ¿Qué son tests de integración?

Prueban la interacción entre componentes reales (base de datos, APIs, servicios externos).

**Diferencia con tests unitarios**:

- **Unitarios**: Aislados, mocks, rápidos (milisegundos)
- **Integración**: Componentes reales, más lentos (segundos)

---

## Spring Boot Test

### Dependencia

**Maven**:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

**Gradle**:

```groovy
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

### @SpringBootTest

Carga el contexto completo de Spring.

```java
@SpringBootTest
public class UsuarioServicioIntegrationTest {

    @Autowired
    private UsuarioServicio servicio;

    @Autowired
    private UsuarioRepositorio repositorio;

    @Test
    public void deberiaGuardarYRecuperarUsuario() {
        Usuario usuario = new Usuario("Juan", "juan@email.com");

        servicio.guardar(usuario);

        Usuario guardado = repositorio.findByEmail("juan@email.com");
        assertNotNull(guardado);
        assertEquals("Juan", guardado.getNombre());
    }
}
```

---

## Base de datos en memoria

### H2

**Dependencia**:

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

**application-test.properties**:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

**Activar perfil**:

```java
@SpringBootTest
@ActiveProfiles("test")
public class UsuarioRepositorioTest {
    // Usa H2 en memoria
}
```

---

## TestContainers

Contenedores Docker reales para tests.

### Dependencia

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.19.0</version>
    <scope>test</scope>
</dependency>
```

### Ejemplo con PostgreSQL

```java
@SpringBootTest
@Testcontainers
public class UsuarioRepositorioIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UsuarioRepositorio repositorio;

    @Test
    public void deberiaGuardarUsuario() {
        Usuario usuario = new Usuario("Juan", "juan@email.com");
        Usuario guardado = repositorio.save(usuario);

        assertNotNull(guardado.getId());
    }
}
```

---

## @DataJpaTest

Test enfocado solo en JPA.

```java
@DataJpaTest
public class UsuarioRepositorioTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UsuarioRepositorio repositorio;

    @Test
    public void deberiaBuscarPorEmail() {
        // Arrange
        Usuario usuario = new Usuario("Juan", "juan@email.com");
        entityManager.persist(usuario);
        entityManager.flush();

        // Act
        Usuario encontrado = repositorio.findByEmail("juan@email.com");

        // Assert
        assertNotNull(encontrado);
        assertEquals("Juan", encontrado.getNombre());
    }
}
```

**Ventajas**:

- Solo carga componentes JPA
- Más rápido que `@SpringBootTest`
- Transacciones rollback automático

---

## @WebMvcTest

Test de controladores REST.

```java
@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioServicio servicio;

    @Test
    public void deberiaRetornarUsuario() throws Exception {
        Usuario usuario = new Usuario(1L, "Juan", "juan@email.com");
        when(servicio.buscar(1L)).thenReturn(usuario);

        mockMvc.perform(get("/api/usuarios/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre").value("Juan"))
            .andExpect(jsonPath("$.email").value("juan@email.com"));
    }

    @Test
    public void deberiaCrearUsuario() throws Exception {
        String json = """
            {
                "nombre": "Juan",
                "email": "juan@email.com"
            }
            """;

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated());

        verify(servicio).crear(any(Usuario.class));
    }
}
```

---

## RestTemplate / WebClient

Test de APIs externas.

### RestTemplate

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApiIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void deberiaBuscarUsuario() {
        ResponseEntity<Usuario> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/usuarios/1",
            Usuario.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

### WebTestClient (WebFlux)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApiIntegrationTest {

    @Autowired
    private WebTestClient webClient;

    @Test
    public void deberiaBuscarUsuario() {
        webClient.get()
            .uri("/api/usuarios/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(Usuario.class)
            .value(usuario -> {
                assertNotNull(usuario.getId());
                assertEquals("Juan", usuario.getNombre());
            });
    }
}
```

---

## Limpiar base de datos

### @BeforeEach

```java
@SpringBootTest
public class IntegrationTest {

    @Autowired
    private UsuarioRepositorio repositorio;

    @BeforeEach
    public void limpiar() {
        repositorio.deleteAll();
    }

    @Test
    public void test1() {
        // Base de datos limpia
    }
}
```

### @Transactional

Rollback automático después del test.

```java
@SpringBootTest
@Transactional
public class IntegrationTest {

    @Test
    public void test() {
        // Cambios se revierten automáticamente
    }
}
```

---

## WireMock

Mockea APIs HTTP externas.

### Dependencia

```xml
<dependency>
    <groupId>org.wiremock</groupId>
    <artifactId>wiremock-standalone</artifactId>
    <version>3.2.0</version>
    <scope>test</scope>
</dependency>
```

### Ejemplo

```java
@SpringBootTest
public class ExternalApiTest {

    @RegisterExtension
    static WireMockExtension wireMock = WireMockExtension.newInstance()
        .options(wireMockConfig().port(8089))
        .build();

    @Test
    public void deberiaConsumirApiExterna() {
        // Mockear respuesta
        stubFor(get("/api/usuarios/1")
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody("""
                    {
                        "id": 1,
                        "nombre": "Juan"
                    }
                    """)));

        // Consumir API
        RestTemplate restTemplate = new RestTemplate();
        Usuario usuario = restTemplate.getForObject(
            "http://localhost:8089/api/usuarios/1",
            Usuario.class
        );

        assertEquals("Juan", usuario.getNombre());
    }
}
```

---

## Tests de mensajería

### Con RabbitMQ (TestContainers)

```java
@SpringBootTest
@Testcontainers
public class MensajeriaIntegrationTest {

    @Container
    static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.12");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.rabbitmq.host", rabbitmq::getHost);
        registry.add("spring.rabbitmq.port", rabbitmq::getAmqpPort);
    }

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void deberiaEnviarYRecibirMensaje() {
        String mensaje = "Hola, RabbitMQ";

        rabbitTemplate.convertAndSend("test-queue", mensaje);

        String recibido = (String) rabbitTemplate.receiveAndConvert("test-queue");
        assertEquals(mensaje, recibido);
    }
}
```

---

## Buenas prácticas

1. **Usa base de datos en memoria para tests rápidos**: H2, SQLite.
2. **Usa TestContainers para tests realistas**: Contenedores Docker con PostgreSQL, MySQL, etc.
3. **Limpia la base de datos entre tests**: `@BeforeEach` o `@Transactional`.
4. **Separación de tests**: Unitarios (rápidos) vs Integración (lentos).
5. **Perfil de test**: `application-test.properties` con configuración específica.
6. **CI/CD**: Ejecuta tests de integración en pipelines.

---

## Estructura de carpetas

```
src/
├── main/
│   └── java/
│       └── com/ejemplo/
│           ├── controller/
│           ├── service/
│           └── repository/
└── test/
    └── java/
        └── com/ejemplo/
            ├── controller/    # @WebMvcTest
            ├── service/       # Tests unitarios
            ├── repository/    # @DataJpaTest
            └── integration/   # @SpringBootTest
```

---

## Próximo paso

Aprende a crear APIs REST modernas con Spring Boot: [Spring Boot →](/backend/spring-boot/)
