---
title: Comenzando con Java
description: Una guía de como comenzar con la documentación de Java.
---
Pasos para comenzar

1. Descargar Java
1. Descargar Java SDK
1. Obtenga un Entorno de Desarrollo Integrado (IDE)
1. Inicie un proyecto dentro del IDE
1. Codifica "Hello World" y ejecuta el código

## Punto de entrada de Java

El punto de entrada a una aplicación java es la función principal.

Se clasifica por su (String[] arg) como un parámetro a la función

```java
public class MyClass {
    // ejemplo de la función pricipal
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

como puede ver la función principal esta envuelta dentro de una clase que es parte de la estructura orientada a objetos de Java.

El nombre del proyecto es "MyClass"

## Impresion en la consola

Para imprimir en la consola utilizamos System.out.println().

Lo sé, es muy común y puede ser un poco complicado.

```java
public class MyClass {
    // ejemplo de la función pricipal
    public static void main(String[] args) {
        System.out.println("Mensaje de prueba");
    }
}
```
En este ejempli estamos imprimiendo el texto "Mensaje de Prueba" en la consola cuando ejecutamos el programa.

## Declarando funciones

Para declarar una función debemos utilizar la palabra reservada "public" seguido por el nombre de la función y el parámetro de entrada.

Aqui tines un simple ejemplo de una función:

```java
public class MyClass {
    // ejemplo de la función pricipal
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

## Programación orientada a objetos

Java es un lenguaje conosido por sus conceptos de programación orientada a objetos.

Esto significa que es facil representar entidades como objetos mediante el uso de clases y encapsular atributos y métodos.

Un ejemplo de esto podria ser la representacion de un estudiante, donde el estudiante es una clase y sus atributos son los nombres, apellidos, edad, etc.

```java
public class Estudiante {
    // propiedades de la clase Estudiante
    String nombre;
    String apellidos;
    int edad;
    // Constructor
    public Estudiante(String nombre, String apellidos, int edad) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
    }
    // Consigue el metodo
    public String getNombre() {
        return nombre;
    }
    // Setter metodo
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
```

usamos una clase de la siguiente manera:

```java
public class MyClass {
    // ejemplo de la función pricipal
    public static void main(String[] args) {
        Estudiante estudiante = new Estudiante("John", "Doe", 30);
        System.out.println(estudiante.getNombre());
    }
}
```

## Conclusiones

Esto fue un ejemplo de como comenzar con la documentación de Java.
