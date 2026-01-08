---
title: Spring Boot
description: Framework moderno para crear aplicaciones Java
---

## ¿Qué es Spring Boot?

Spring Boot simplifica la creación de aplicaciones Spring con configuración mínima.

**Ventajas**:

- Configuración automática
- Servidor embebido (Tomcat, Jetty)
- Sin XML, solo anotaciones y código
- Ecosistema completo (Web, Data, Security, etc.)

---

## Crear proyecto

### Spring Initializr

[https://start.spring.io](https://start.spring.io)

**Configuración**:

- **Project**: Maven o Gradle
- **Language**: Java
- **Spring Boot**: 3.2.x (última versión)
- **Java**: 17 o 21
- **Dependencies**: Spring Web, Spring Data JPA, PostgreSQL, Lombok

O con CLI:

```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,lombok \
  -d javaVersion=21 \
  -d type=maven-project \
  -o demo.zip

unzip demo.zip
cd demo
```

---

## Estructura de proyecto

```
src/
├── main/
│   ├── java/
│   │   └── com/ejemplo/demo/
│   │       ├── DemoApplication.java       # Main
│   │       ├── controller/                # REST controllers
│   │       ├── service/                   # Lógica de negocio
│   │       ├── repository/                # Acceso a datos
│   │       ├── model/                     # Entidades
│   │       ├── dto/                       # Data Transfer Objects
│   │       └── config/                    # Configuración
│   └── resources/
│       ├── application.properties         # Configuración
│       └── application-dev.properties     # Perfil dev
└── test/
    └── java/
        └── com/ejemplo/demo/
```

---

## Clase principal

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**`@SpringBootApplication`** equivale a:

- `@Configuration`: Clase de configuración
- `@EnableAutoConfiguration`: Configuración automática
- `@ComponentScan`: Escanea componentes en el paquete

---

## Configuración

### application.properties

```properties
# Servidor
server.port=8080

# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/demo
spring.datasource.username=postgres
spring.datasource.password=secret

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.com.ejemplo=DEBUG
logging.level.org.springframework=INFO
```

### application.yml (alternativa)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/demo
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

logging:
  level:
    com.ejemplo: DEBUG
    org.springframework: INFO
```

---

## Perfiles

### application-dev.properties

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.show-sql=true
```

### application-prod.properties

```properties
spring.datasource.url=jdbc:postgresql://prod-server:5432/demo
spring.jpa.show-sql=false
```

**Activar perfil**:

```bash
# Línea de comandos
java -jar app.jar --spring.profiles.active=dev

# Variable de entorno
export SPRING_PROFILES_ACTIVE=prod
```

---

## Inyección de dependencias

### @Autowired

```java
@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio repositorio;

    public Usuario buscar(Long id) {
        return repositorio.findById(id).orElseThrow();
    }
}
```

### Constructor injection (recomendado)

```java
@Service
public class UsuarioServicio {

    private final UsuarioRepositorio repositorio;

    // @Autowired es opcional en constructores (Spring 4.3+)
    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }
}
```

### Con Lombok

```java
@Service
@RequiredArgsConstructor
public class UsuarioServicio {

    private final UsuarioRepositorio repositorio;

    // Constructor generado automáticamente
}
```

---

## Componentes de Spring

### @Component

Componente genérico.

```java
@Component
public class EmailUtil {
    public void enviar(String destinatario, String mensaje) {
        // ...
    }
}
```

### @Service

Capa de servicio (lógica de negocio).

```java
@Service
public class UsuarioServicio {
    public Usuario crear(String nombre) {
        // ...
    }
}
```

### @Repository

Capa de acceso a datos.

```java
@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
}
```

### @Controller / @RestController

Controladores web.

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    // ...
}
```

---

## Configuración personalizada

### @Configuration

```java
@Configuration
public class AppConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        return mapper;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### @Value

Inyectar valores de configuración.

```java
@Component
public class AppProperties {

    @Value("${app.nombre}")
    private String nombre;

    @Value("${app.version:1.0}")  // Valor por defecto
    private String version;
}
```

### @ConfigurationProperties

```java
@ConfigurationProperties(prefix = "app")
@Component
public class AppProperties {
    private String nombre;
    private String version;
    private int timeout;

    // Getters y setters
}
```

**application.properties**:

```properties
app.nombre=Mi App
app.version=1.0
app.timeout=5000
```

---

## Eventos

### Publicar eventos

```java
@Service
@RequiredArgsConstructor
public class UsuarioServicio {

    private final ApplicationEventPublisher eventPublisher;

    public void crear(Usuario usuario) {
        // Guardar usuario

        eventPublisher.publishEvent(new UsuarioCreadoEvent(usuario));
    }
}
```

### Escuchar eventos

```java
@Component
public class UsuarioEventListener {

    @EventListener
    public void onUsuarioCreado(UsuarioCreadoEvent event) {
        System.out.println("Usuario creado: " + event.getUsuario().getNombre());
    }
}
```

---

## Tareas programadas

### @Scheduled

```java
@Component
public class TareasProgramadas {

    @Scheduled(fixedRate = 60000) // Cada 60 segundos
    public void tarea1() {
        System.out.println("Ejecutando tarea cada minuto");
    }

    @Scheduled(cron = "0 0 2 * * ?") // Todos los días a las 2am
    public void tarea2() {
        System.out.println("Limpieza nocturna");
    }
}
```

**Habilitar scheduling**:

```java
@SpringBootApplication
@EnableScheduling
public class DemoApplication {
    // ...
}
```

---

## Actuator

Endpoints de monitoreo y métricas.

### Dependencia

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Configuración

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Endpoints

- `/actuator/health`: Estado de salud
- `/actuator/info`: Información de la app
- `/actuator/metrics`: Métricas (memoria, CPU, etc.)
- `/actuator/env`: Variables de entorno

---

## Profiles avanzados

### Configuración específica

```java
@Configuration
@Profile("dev")
public class DevConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {

    @Bean
    public DataSource dataSource() {
        // PostgreSQL real
    }
}
```

---

## CommandLineRunner

Ejecutar código al iniciar la aplicación.

```java
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepositorio repositorio;

    @Override
    public void run(String... args) throws Exception {
        if (repositorio.count() == 0) {
            repositorio.save(new Usuario("Admin", "admin@email.com"));
            System.out.println("Datos iniciales cargados");
        }
    }
}
```

---

## Despliegue

### JAR ejecutable

```bash
# Maven
mvn clean package

# Gradle
gradle build

# Ejecutar
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Docker

**Dockerfile**:

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t mi-app .
docker run -p 8080:8080 mi-app
```

---

## Buenas prácticas

1. **Constructor injection**: Más testeable y inmutable.
2. **Perfiles**: Separar configuración dev/prod.
3. **application.yml**: Más legible que `.properties`.
4. **@ConfigurationProperties**: Para configuración compleja.
5. **Actuator**: Monitoreo en producción.
6. **Lombok**: Reduce boilerplate con `@RequiredArgsConstructor`.

---

## Próximo paso

Aprende a crear APIs REST: [REST APIs →](/backend/rest-apis/)
