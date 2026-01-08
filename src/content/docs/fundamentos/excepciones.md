---
title: Excepciones
description: Manejo de errores y excepciones en Java
---

## ¿Qué son las excepciones?

Las excepciones son eventos que interrumpen el flujo normal del programa. Java las usa para manejar errores de forma controlada en lugar de que el programa simplemente se cierre.

```java
int resultado = 10 / 0;  // ❌ ArithmeticException: / by zero
```

---

## Jerarquía de excepciones

```
Throwable
├── Error (errores del sistema, no se deben capturar)
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── RuntimeException (no checked, no obligatorio capturar)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── ArithmeticException
    │   └── IllegalArgumentException
    └── IOException (checked, obligatorio capturar)
        ├── FileNotFoundException
        └── SQLException
```

---

## Tipos de excepciones

### Checked Exceptions

El compilador obliga a manejarlas:

```java
// ❌ No compila sin try-catch o throws
public void leerArchivo() {
    FileReader fr = new FileReader("archivo.txt");
}

// ✅ Con try-catch
public void leerArchivo() {
    try {
        FileReader fr = new FileReader("archivo.txt");
    } catch (FileNotFoundException e) {
        System.out.println("Archivo no encontrado");
    }
}

// ✅ O propagando la excepción
public void leerArchivo() throws FileNotFoundException {
    FileReader fr = new FileReader("archivo.txt");
}
```

### Unchecked Exceptions (RuntimeException)

No es obligatorio manejarlas:

```java
String texto = null;
System.out.println(texto.length());  // NullPointerException en tiempo de ejecución
```

---

## Try-Catch

### Básico

```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
}
```

### Múltiples catch

```java
try {
    String[] array = {"uno", "dos"};
    System.out.println(array[5]);
    int resultado = 10 / 0;
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Índice fuera de rango");
} catch (ArithmeticException e) {
    System.out.println("Error aritmético");
}
```

### Multi-catch (Java 7+)

```java
try {
    // código que puede fallar
} catch (IOException | SQLException e) {
    System.out.println("Error de I/O o base de datos");
    e.printStackTrace();
}
```

### Finally

Se ejecuta siempre, haya excepción o no:

```java
FileReader fr = null;
try {
    fr = new FileReader("archivo.txt");
    // leer archivo
} catch (IOException e) {
    System.out.println("Error al leer archivo");
} finally {
    // Siempre se ejecuta
    if (fr != null) {
        try {
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Try-with-resources

Para recursos que implementan `AutoCloseable`:

```java
// Se cierra automáticamente, sin necesidad de finally
try (FileReader fr = new FileReader("archivo.txt");
     BufferedReader br = new BufferedReader(fr)) {
    String linea = br.readLine();
    System.out.println(linea);
} catch (IOException e) {
    e.printStackTrace();
}
```

Mucho más limpio y seguro que usar finally.

---

## Lanzar excepciones

### throw

```java
public void setEdad(int edad) {
    if (edad < 0) {
        throw new IllegalArgumentException("La edad no puede ser negativa");
    }
    this.edad = edad;
}
```

### throws

Declara que un método puede lanzar una excepción:

```java
public void leerArchivo(String ruta) throws IOException {
    FileReader fr = new FileReader(ruta);
    // No se maneja aquí, quien llame debe manejarla
}
```

Múltiples excepciones:

```java
public void metodo() throws IOException, SQLException {
    // código
}
```

---

## Crear excepciones personalizadas

### Checked Exception

```java
public class SaldoInsuficienteException extends Exception {
    public SaldoInsuficienteException(String mensaje) {
        super(mensaje);
    }
}

public class CuentaBancaria {
    private double saldo;

    public void retirar(double cantidad) throws SaldoInsuficienteException {
        if (cantidad > saldo) {
            throw new SaldoInsuficienteException(
                "Saldo insuficiente. Disponible: " + saldo
            );
        }
        saldo -= cantidad;
    }
}
```

### Unchecked Exception

```java
public class ConfiguracionInvalidaException extends RuntimeException {
    public ConfiguracionInvalidaException(String mensaje) {
        super(mensaje);
    }
}
```

---

## Buenas prácticas

### 1. No uses excepciones para control de flujo

```java
// ❌ Incorrecto
try {
    int i = 0;
    while (true) {
        System.out.println(array[i++]);
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // fin del array
}

// ✅ Correcto
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);
}
```

### 2. Captura excepciones específicas

```java
// ❌ Demasiado genérico
try {
    // código
} catch (Exception e) {
    // ¿Qué falló?
}

// ✅ Específico
try {
    // código
} catch (FileNotFoundException e) {
    // Archivo no encontrado
} catch (IOException e) {
    // Otro error de I/O
}
```

### 3. No ignores excepciones

```java
// ❌ Tragarse la excepción
try {
    // código
} catch (Exception e) {
    // no hacer nada
}

// ✅ Al menos loguea
try {
    // código
} catch (Exception e) {
    logger.error("Error procesando archivo", e);
}
```

### 4. Proporciona contexto útil

```java
throw new IllegalArgumentException(
    "Email inválido: " + email +
    ". Debe contener @ y un dominio válido"
);
```

### 5. Usa excepciones checked solo cuando sea recuperable

```java
// ✅ Checked: el llamador puede hacer algo al respecto
public void enviarEmail(String destinatario) throws EmailInvalidoException {
    // validar y enviar
}

// ✅ Unchecked: error de programación, no recuperable
public void procesar(String dato) {
    if (dato == null) {
        throw new IllegalArgumentException("dato no puede ser null");
    }
}
```

---

## Excepciones comunes

### NullPointerException

```java
String texto = null;
texto.length();  // ❌ NullPointerException

// Prevenir
if (texto != null) {
    texto.length();
}

// O usar Optional (preferido)
Optional.ofNullable(texto).ifPresent(t -> System.out.println(t.length()));
```

### ArrayIndexOutOfBoundsException

```java
int[] array = {1, 2, 3};
int valor = array[5];  // ❌ ArrayIndexOutOfBoundsException

// Prevenir
if (indice >= 0 && indice < array.length) {
    int valor = array[indice];
}
```

### NumberFormatException

```java
int numero = Integer.parseInt("abc");  // ❌ NumberFormatException

// Prevenir
try {
    int numero = Integer.parseInt(texto);
} catch (NumberFormatException e) {
    System.out.println("No es un número válido");
}
```

### ClassCastException

```java
Object obj = "Hola";
Integer num = (Integer) obj;  // ❌ ClassCastException

// Prevenir
if (obj instanceof Integer num) {
    // Usar num de forma segura
}
```

---

## Patrones útiles

### Fail-fast

Valida precondiciones al inicio:

```java
public void procesar(String dato, List<String> lista) {
    Objects.requireNonNull(dato, "dato no puede ser null");
    Objects.requireNonNull(lista, "lista no puede ser null");
    if (lista.isEmpty()) {
        throw new IllegalArgumentException("lista no puede estar vacía");
    }

    // Procesar con seguridad
}
```

### Try-catch en bucles

```java
// ❌ El primer error detiene todo
for (String archivo : archivos) {
    procesar(archivo);  // Si falla, se detiene el bucle
}

// ✅ Procesa todos, incluso si algunos fallan
for (String archivo : archivos) {
    try {
        procesar(archivo);
    } catch (Exception e) {
        logger.error("Error procesando " + archivo, e);
        // Continúa con el siguiente
    }
}
```

---

## Suppresssed Exceptions

Cuando se lanzan múltiples excepciones:

```java
try (Resource r = new Resource()) {
    throw new RuntimeException("Error principal");
} // Si close() también falla, es una "suppressed exception"

// Acceder a excepciones suprimidas
catch (Exception e) {
    Throwable[] suppressed = e.getSuppressed();
}
```

---

## Próximo paso

Aprende sobre las estructuras de datos fundamentales de Java: [Colecciones →](/fundamentos/colecciones/)
