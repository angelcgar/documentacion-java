---
title: Programación Orientada a Objetos
description: Conceptos fundamentales de POO en Java
---

## ¿Qué es la POO?

La Programación Orientada a Objetos es un paradigma que organiza el código en objetos que tienen:

- **Atributos** (datos): Características del objeto
- **Métodos** (comportamiento): Acciones que puede realizar

---

## Clases y Objetos

### Definir una clase

```java
public class Persona {
    // Atributos (campos)
    private String nombre;
    private int edad;

    // Constructor
    public Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    // Métodos
    public void saludar() {
        System.out.println("Hola, soy " + nombre);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
```

### Crear objetos (instancias)

```java
Persona persona1 = new Persona("Juan", 25);
Persona persona2 = new Persona("María", 30);

persona1.saludar();  // "Hola, soy Juan"
persona2.saludar();  // "Hola, soy María"
```

---

## Los 4 pilares de la POO

### 1. Encapsulación

Ocultar los detalles internos y exponer solo lo necesario:

```java
public class CuentaBancaria {
    private double saldo;  // ❌ No accesible directamente desde fuera

    public CuentaBancaria(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    // ✅ Acceso controlado mediante métodos
    public void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
        }
    }

    public boolean retirar(double cantidad) {
        if (cantidad > 0 && cantidad <= saldo) {
            saldo -= cantidad;
            return true;
        }
        return false;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

Modificadores de acceso:

- `private`: Solo accesible desde la misma clase
- `default` (sin modificador): Accesible en el mismo package
- `protected`: Accesible en el mismo package y subclases
- `public`: Accesible desde cualquier lugar

### 2. Herencia

Una clase puede heredar atributos y métodos de otra:

```java
public class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public void comer() {
        System.out.println(nombre + " está comiendo");
    }
}

public class Perro extends Animal {
    private String raza;

    public Perro(String nombre, String raza) {
        super(nombre);  // Llama al constructor de Animal
        this.raza = raza;
    }

    public void ladrar() {
        System.out.println(nombre + " está ladrando");
    }

    @Override
    public void comer() {
        System.out.println(nombre + " come croquetas");
    }
}
```

Uso:

```java
Perro perro = new Perro("Max", "Labrador");
perro.comer();   // "Max come croquetas"
perro.ladrar();  // "Max está ladrando"
```

### 3. Polimorfismo

Un objeto puede tomar muchas formas:

```java
Animal animal1 = new Perro("Max", "Labrador");
Animal animal2 = new Gato("Luna", "Persa");

animal1.comer();  // Llama al método de Perro
animal2.comer();  // Llama al método de Gato
```

Con interfaces:

```java
public interface Volador {
    void volar();
}

public class Avion implements Volador {
    @Override
    public void volar() {
        System.out.println("Avión volando");
    }
}

public class Pajaro implements Volador {
    @Override
    public void volar() {
        System.out.println("Pájaro volando");
    }
}

// Uso polimórfico
List<Volador> voladores = List.of(new Avion(), new Pajaro());
for (Volador v : voladores) {
    v.volar();  // Llama al método correcto según el tipo real
}
```

### 4. Abstracción

Mostrar solo lo esencial, ocultar la complejidad:

```java
public abstract class FiguraGeometrica {
    protected String nombre;

    public FiguraGeometrica(String nombre) {
        this.nombre = nombre;
    }

    // Método abstracto (sin implementación)
    public abstract double calcularArea();

    // Método concreto
    public void mostrarInfo() {
        System.out.println("Figura: " + nombre);
        System.out.println("Área: " + calcularArea());
    }
}

public class Circulo extends FiguraGeometrica {
    private double radio;

    public Circulo(double radio) {
        super("Círculo");
        this.radio = radio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * radio * radio;
    }
}
```

---

## Constructores

### Constructor por defecto

```java
public class Coche {
    private String marca;

    // Si no defines constructor, Java crea uno vacío automáticamente
}

Coche coche = new Coche();  // ✅ Funciona
```

### Constructores personalizados

```java
public class Coche {
    private String marca;
    private String modelo;
    private int año;

    // Constructor con todos los parámetros
    public Coche(String marca, String modelo, int año) {
        this.marca = marca;
        this.modelo = modelo;
        this.año = año;
    }

    // Constructor con algunos parámetros
    public Coche(String marca, String modelo) {
        this(marca, modelo, 2024);  // Llama al otro constructor
    }
}
```

### Constructor copia

```java
public class Punto {
    private int x, y;

    public Punto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Constructor copia
    public Punto(Punto otro) {
        this.x = otro.x;
        this.y = otro.y;
    }
}

Punto p1 = new Punto(10, 20);
Punto p2 = new Punto(p1);  // Copia de p1
```

---

## Métodos

### Métodos de instancia

```java
public class Calculadora {
    private int resultado = 0;

    public void sumar(int valor) {
        resultado += valor;
    }

    public int getResultado() {
        return resultado;
    }
}

Calculadora calc = new Calculadora();
calc.sumar(5);
calc.sumar(3);
System.out.println(calc.getResultado());  // 8
```

### Métodos estáticos

Pertenecen a la clase, no a instancias:

```java
public class Utilidades {
    public static int sumar(int a, int b) {
        return a + b;
    }

    public static double areaCirculo(double radio) {
        return Math.PI * radio * radio;
    }
}

// Uso sin crear instancias
int suma = Utilidades.sumar(5, 3);
double area = Utilidades.areaCirculo(10);
```

### Sobrecarga de métodos

Varios métodos con el mismo nombre pero diferentes parámetros:

```java
public class Impresora {
    public void imprimir(int numero) {
        System.out.println("Número: " + numero);
    }

    public void imprimir(String texto) {
        System.out.println("Texto: " + texto);
    }

    public void imprimir(int numero, String texto) {
        System.out.println("Número: " + numero + ", Texto: " + texto);
    }
}
```

---

## Interfaces

Una interfaz define un contrato que las clases deben cumplir:

```java
public interface Reproducible {
    void reproducir();
    void pausar();
    void detener();

    // Método default (Java 8+)
    default void info() {
        System.out.println("Reproductor de medios");
    }
}

public class ReproductorMP3 implements Reproducible {
    @Override
    public void reproducir() {
        System.out.println("Reproduciendo MP3...");
    }

    @Override
    public void pausar() {
        System.out.println("MP3 pausado");
    }

    @Override
    public void detener() {
        System.out.println("MP3 detenido");
    }
}
```

Una clase puede implementar múltiples interfaces:

```java
public class SmartTV implements Reproducible, Conectable {
    // Implementa métodos de ambas interfaces
}
```

---

## Clases abstractas vs Interfaces

### Cuándo usar clases abstractas:

- Cuando tienes código común que compartir
- Cuando necesitas campos no estáticos
- Relación "es un" clara

```java
public abstract class Vehiculo {
    protected int velocidad = 0;

    public abstract void acelerar();

    public void mostrarVelocidad() {
        System.out.println("Velocidad: " + velocidad);
    }
}
```

### Cuándo usar interfaces:

- Para definir capacidades que pueden tener clases no relacionadas
- Para soporte de herencia múltiple
- Relación "puede hacer"

```java
public interface Volador {
    void volar();
}

// Tanto aviones como pájaros pueden volar,
// pero no están relacionados jerárquicamente
```

---

## Records (Java 14+)

Para clases de datos inmutables:

```java
public record Punto(int x, int y) { }

// Equivalente a una clase con:
// - Campos finales
// - Constructor
// - Getters (x(), y())
// - equals, hashCode, toString
```

Con validación:

```java
public record Email(String direccion) {
    public Email {
        if (!direccion.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}
```

---

## Buenas prácticas

1. **Principio de responsabilidad única**: Una clase debe hacer una cosa bien.
2. **Favorece la composición sobre la herencia**: En lugar de heredar, usa objetos.
3. **Programa contra interfaces, no implementaciones**.
4. **Encapsula lo que varía**: Lo que puede cambiar debe estar protegido.
5. **KISS**: Keep It Simple, Stupid. No compliques innecesariamente.

---

## Próximo paso

Aprende a manejar errores de forma efectiva: [Excepciones →](/fundamentos/excepciones/)
