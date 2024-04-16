---
title: Instalando Java y Java SDK
description: Una guía de como comenzar con la documentación de Java.
---

Esta es un simple guia de como instalar Java y Java SDK en diferentes sistemas operativos.

## Linux

Para instalar Java y Java SDK en Linux, siga estos pasos:

### Arch Linux 

En Arch Linux puedes instalar Java utilizando el gestor de paquetes Pacman. Hay varias implementaciones de Java disponibles en los repositorios oficiales de Arch Linux, incluyendo OpenJDK y AdoptOpenJDK. Aquí te muestro cómo instalar OpenJDK, que es la implementación de referencia de Java de código abierto

1. Actualiza el sistema: Antes de instalar cualquier paquete, es una buena práctica actualizar la base de datos de paquetes y el sistema en general. Puedes hacerlo ejecutando los siguientes comandos en tu terminal
```bash
sudo pacman -Syu
```

2. Instala Java OpenJDK: Luego de actualizar la base de datos de paquetes, puedes instalar OpenJDK con el siguiente comando
```bash
sudo pacman -S jdk-openjdk
```

Este comando instalará el JDK (Java Development Kit) de OpenJDK, que incluye todo lo necesario para desarrollar y ejecutar aplicaciones Java en tu sistema.

3. Verifica la instalación: Una vez que se haya completado la instalación, puedes verificar la instalación ejecutando el siguiente comando
```bash
java -version
```

Si se ve algo como "openjdk 17.0.2" significa que se ha instalado correctamente.

4. Configurar las variables de entorno de Java (opcional): Si planeas desarrollar aplicaciones Java o ejecutar programas que requieran Java en tu sistema, es posible que desees configurar las variables de entorno JAVA_HOME y PATH para que apunten a la ubicación de la instalación de Java. Puedes hacer esto agregando las siguientes líneas al archivo ~/.bashrc o ~/.zshrc
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

### Ubuntu

Para instalar Java y Java SDK en Ubuntu, siga estos pasos:

1. Actualiza el sistema : Antes de instalar cualquier paquete, es una buena práctica actualizar la base de datos de paquetes y el sistema en general. Puedes hacerlo ejecutando los siguientes comandos en tu terminal
```bash
sudo apt update
sudo apt upgrade
```

2. Instala Java OpenJDK: En Ubuntu, puedes instalar la implementación de código abierto de Java, OpenJDK, que es compatible con la mayoría de las aplicaciones Java. Puedes instalarlo ejecutando el siguiente comando
```bash
sudo apt install default-jdk
```

Este comando instalará el paquete default-jdk, que proporciona la implementación predeterminada de OpenJDK.

3. Verifica la instalación: Una vez que se haya completado la instalación, puedes verificar la instalación ejecutando el siguiente comando
```bash
java -version
```

Esto deveria de mostrarte la version de Java que se ha instalado.

Además, si necesitas instalar un ambiente de desarrollo completo para Java, también puedes instalar el paquete default-jdk
```bash
sudo apt install default-jre
```

Este paquete deveria de instalar el JDK (Java Development Kit) de OpenJDK, que es necesario para desarrollar y ejecutar aplicaciones Java en tu sistema.

y eso es todo! Ahora si todo a salido bien, seras capas de desarrollar y ejecutar aplicaciones Java en tu sistema operativo basado en Linux.

## Windows

Ahora para instalar java en tu sistema operativo Windows, siga estos pasos:

1. Descarga Java: Visita la pagina oficial de java en [java](https://www.java.com/en/download/) y haz clic en "Download for Windows". Esto te llevara a la pagina de descarga de Java.

2. Descargar el instalador: En la pagina de descargas, descarga el instalador de Java para Windows.

3. Ejecuta el instalador: Haz doble clic en el instalador de Java y sigue las instrucciones para completar la instalación. Acepta los terminos y condiciones para continuar.

4. Instalacion de java: El instalador te preguntara si deseas instalar jRE(java runtime environment) o jdk(java development kit). Si solo quieres ejecutar aplicaciones Java, selecciona la opción para instalar el JRE. Si planeas desarrollar aplicaciones Java, selecciona la opción para instalar el JDK". Luego sigue las instrucciones para completar la instalación.

5. Espera a que se complete la instalación: Esto tomara un par de minutos.

6. Verifica la instalación: Una vez que se haya completado la instalación, puedes verificar la instalación ejecutando el siguiente comando en PowerShell
```bash
java -version
```
 
Esto debería de mostrar la version de Java que se ha instalado.

Ahora si todo ha salido bien, serás capas de desarrollar y ejecutar aplicaciones Java en tu sistema operativo Windows.

## MacOS

Ahora para instalar java en tu sistema operativo MacOS, siga estos pasos:

proximante...
