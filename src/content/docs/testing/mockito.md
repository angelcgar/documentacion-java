---
title: Mockito
description: Framework para crear mocks y aislar dependencias en tests
---

## ¿Qué es Mockito?

Mockito permite crear **mocks** (objetos simulados) para aislar la clase bajo prueba de sus dependencias.

### Dependencia

**Maven**:

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
```

**Gradle**:

```groovy
testImplementation 'org.mockito:mockito-core:5.5.0'
```

---

## ¿Por qué usar mocks?

### ❌ Sin mock

```java
public class UsuarioServicioTest {
    @Test
    public void deberiaCrearUsuario() {
        // Necesito base de datos real
        Database db = new Database();
        db.conectar(); // Lento

        UsuarioRepositorio repo = new UsuarioRepositorio(db);
        UsuarioServicio servicio = new UsuarioServicio(repo);

        Usuario usuario = servicio.crear("Juan", "juan@email.com");

        assertNotNull(usuario);
    }
}
```

### ✅ Con mock

```java
public class UsuarioServicioTest {
    @Test
    public void deberiaCrearUsuario() {
        // Mock del repositorio (sin base de datos)
        UsuarioRepositorio repo = mock(UsuarioRepositorio.class);
        when(repo.guardar(any())).thenReturn(new Usuario(1L, "Juan"));

        UsuarioServicio servicio = new UsuarioServicio(repo);
        Usuario usuario = servicio.crear("Juan", "juan@email.com");

        assertNotNull(usuario);
        // Test rápido, sin base de datos
    }
}
```

---

## Crear mocks

### Con `mock()`

```java
@Test
public void testConMock() {
    UsuarioRepositorio repo = mock(UsuarioRepositorio.class);
    // repo es un mock
}
```

### Con anotaciones

```java
@ExtendWith(MockitoExtension.class)
public class UsuarioServicioTest {

    @Mock
    private UsuarioRepositorio repositorio;

    @InjectMocks
    private UsuarioServicio servicio;

    @Test
    public void test() {
        // repositorio es un mock
        // servicio tiene el mock inyectado
    }
}
```

**`@Mock`**: Crea un mock.

**`@InjectMocks`**: Crea la instancia e inyecta los mocks.

---

## `when()` y `thenReturn()`

Configura el comportamiento del mock.

```java
@Test
public void deberiaBuscarUsuarioPorId() {
    UsuarioRepositorio repo = mock(UsuarioRepositorio.class);

    // Cuando se llame a buscar(1L), retorna un usuario
    when(repo.buscar(1L))
        .thenReturn(new Usuario(1L, "Juan", "juan@email.com"));

    Usuario usuario = repo.buscar(1L);
    assertEquals("Juan", usuario.getNombre());
}
```

### Múltiples llamadas

```java
when(repo.buscar(1L))
    .thenReturn(usuario1)  // Primera llamada
    .thenReturn(usuario2)  // Segunda llamada
    .thenReturn(usuario3); // Tercera llamada
```

### Lanzar excepciones

```java
when(repo.buscar(999L))
    .thenThrow(new UsuarioNoEncontradoException());
```

---

## Matchers de argumentos

### `any()`

Acepta cualquier argumento.

```java
when(repo.guardar(any(Usuario.class)))
    .thenReturn(new Usuario(1L, "Test"));

// O simplemente
when(repo.guardar(any()))
    .thenReturn(new Usuario(1L, "Test"));
```

### `eq()`

Valor exacto.

```java
when(repo.buscarPorEmail(eq("juan@email.com")))
    .thenReturn(usuario);
```

### Otros matchers

```java
// Strings
when(repo.buscar(anyString())).thenReturn(usuario);
when(repo.buscar(startsWith("juan"))).thenReturn(usuario);
when(repo.buscar(contains("email"))).thenReturn(usuario);

// Números
when(servicio.calcular(anyInt())).thenReturn(100);
when(servicio.calcular(gt(10))).thenReturn(100); // > 10

// Listas
when(repo.buscarTodos(anyList())).thenReturn(lista);

// Null
when(repo.buscar(isNull())).thenThrow(IllegalArgumentException.class);
when(repo.buscar(isNotNull())).thenReturn(usuario);
```

---

## `verify()`

Verifica que se llamó a un método del mock.

```java
@Test
public void deberiaGuardarUsuario() {
    UsuarioRepositorio repo = mock(UsuarioRepositorio.class);
    UsuarioServicio servicio = new UsuarioServicio(repo);

    servicio.crear("Juan", "juan@email.com");

    // Verifica que se llamó a guardar
    verify(repo).guardar(any(Usuario.class));
}
```

### Verificar número de llamadas

```java
// Exactamente una vez (por defecto)
verify(repo, times(1)).guardar(any());

// Nunca
verify(repo, never()).eliminar(any());

// Al menos una vez
verify(repo, atLeastOnce()).guardar(any());

// Al menos N veces
verify(repo, atLeast(2)).buscar(any());

// Como máximo N veces
verify(repo, atMost(3)).guardar(any());
```

### Verificar orden

```java
InOrder inOrder = inOrder(repo);
inOrder.verify(repo).guardar(usuario);
inOrder.verify(repo).buscar(1L);
```

---

## Capturar argumentos

```java
@Test
public void deberiaGuardarUsuarioConDatosCorrectos() {
    UsuarioRepositorio repo = mock(UsuarioRepositorio.class);
    UsuarioServicio servicio = new UsuarioServicio(repo);

    ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

    servicio.crear("Juan", "juan@email.com");

    verify(repo).guardar(captor.capture());

    Usuario usuarioCapturado = captor.getValue();
    assertEquals("Juan", usuarioCapturado.getNombre());
    assertEquals("juan@email.com", usuarioCapturado.getEmail());
}
```

---

## `doReturn()`, `doThrow()`, `doNothing()`

Alternativa a `when()` para casos especiales.

### `doReturn()`

```java
// Equivalente a when().thenReturn()
doReturn(usuario).when(repo).buscar(1L);
```

### `doThrow()`

Para métodos `void`.

```java
doThrow(new RuntimeException()).when(repo).eliminar(1L);

@Test
public void deberiaLanzarExcepcion() {
    assertThrows(RuntimeException.class, () -> {
        repo.eliminar(1L);
    });
}
```

### `doNothing()`

Para métodos `void` que no deben hacer nada.

```java
doNothing().when(repo).limpiarCache();
```

---

## Spy

Objeto real con comportamiento parcialmente mockeado.

```java
@Test
public void testConSpy() {
    List<String> lista = new ArrayList<>();
    List<String> spy = spy(lista);

    // Comportamiento real
    spy.add("uno");
    assertEquals(1, spy.size()); // ✅ Real

    // Comportamiento mockeado
    when(spy.size()).thenReturn(100);
    assertEquals(100, spy.size()); // ✅ Mock
}
```

### ¿Cuándo usar spy?

Cuando necesitas un objeto real pero quieres modificar algunos métodos.

```java
@Spy
private UsuarioServicio servicio;

@Test
public void test() {
    // servicio es real, pero puedes mockear métodos específicos
    doReturn(usuario).when(servicio).buscarPorId(1L);
}
```

---

## Ejemplo completo

```java
@ExtendWith(MockitoExtension.class)
public class PedidoServicioTest {

    @Mock
    private ProductoRepositorio productoRepo;

    @Mock
    private InventarioServicio inventarioServicio;

    @Mock
    private EmailServicio emailServicio;

    @InjectMocks
    private PedidoServicio pedidoServicio;

    @Test
    public void deberiaCrearPedidoYEnviarEmail() {
        // Arrange
        Producto producto = new Producto(1L, "Laptop", 1000.0);
        when(productoRepo.buscar(1L)).thenReturn(producto);
        when(inventarioServicio.hayStock(1L, 2)).thenReturn(true);

        // Act
        Pedido pedido = pedidoServicio.crear(1L, 2, "juan@email.com");

        // Assert
        assertNotNull(pedido);
        assertEquals(2000.0, pedido.getTotal());

        verify(inventarioServicio).reducirStock(1L, 2);
        verify(emailServicio).enviarConfirmacion("juan@email.com", pedido);
    }

    @Test
    public void deberiaLanzarExcepcionSiNoHayStock() {
        // Arrange
        when(productoRepo.buscar(1L)).thenReturn(new Producto(1L, "Laptop", 1000.0));
        when(inventarioServicio.hayStock(1L, 10)).thenReturn(false);

        // Act & Assert
        assertThrows(StockInsuficienteException.class, () -> {
            pedidoServicio.crear(1L, 10, "juan@email.com");
        });

        // Verificar que NO se redujo el stock ni se envió email
        verify(inventarioServicio, never()).reducirStock(anyLong(), anyInt());
        verify(emailServicio, never()).enviarConfirmacion(anyString(), any());
    }
}
```

---

## BDDMockito

Sintaxis Behavior-Driven Development.

```java
import static org.mockito.BDDMockito.*;

@Test
public void testConBDD() {
    // given (arrange)
    given(repo.buscar(1L)).willReturn(usuario);

    // when (act)
    Usuario resultado = servicio.obtener(1L);

    // then (assert)
    then(repo).should().buscar(1L);
    assertEquals(usuario, resultado);
}
```

---

## Mockear métodos estáticos

Requiere `mockito-inline`.

**Dependencia adicional**:

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-inline</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
```

**Uso**:

```java
@Test
public void testMetodoEstatico() {
    try (MockedStatic<Utilidades> mock = mockStatic(Utilidades.class)) {
        mock.when(() -> Utilidades.generarId()).thenReturn("123");

        String id = Utilidades.generarId();
        assertEquals("123", id);
    }
}
```

---

## Buenas prácticas

1. **Mock solo lo necesario**: No mockees todo, solo las dependencias externas.
2. **Verifica comportamiento, no implementación**: Usa `verify()` para interacciones importantes, no todo.
3. **No mockees tipos primitivos**: Mockea interfaces/clases, no `String`, `Integer`, etc.
4. **Prefer `@Mock` y `@InjectMocks`**: Más limpio que crear mocks manualmente.
5. **Cuidado con over-mocking**: Si mockeas demasiado, el test pierde valor.

---

## Próximo paso

Aprende a hacer tests de integración: [Tests de integración →](/testing/integracion/)
