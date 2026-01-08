---
title: Instalación
description: Guía para instalar Java y el JDK en diferentes sistemas operativos
---

## ¿Qué necesitas instalar?

Para desarrollar en Java necesitas el **JDK** (Java Development Kit), que incluye:

- **JRE** (Java Runtime Environment): Para ejecutar aplicaciones Java.
- **Compilador**: Para convertir código `.java` en bytecode `.class`.
- **Herramientas de desarrollo**: Debugger, analizadores y utilidades.

No instales solo el JRE si planeas programar en Java. Necesitas el JDK completo.

## ¿Qué versión instalar?

Recomendaciones para 2026:

- **Java 21**: Versión LTS más reciente. Úsala si comienzas un proyecto nuevo.
- **Java 17**: Versión LTS anterior, ampliamente usada en la industria.
- **Java 8/11**: Solo si mantienes proyectos legacy. No para desarrollo nuevo.

Esta guía se enfoca en **OpenJDK**, la implementación de código abierto de Java.

---

## Linux

### Arch Linux

Instala OpenJDK directamente desde los repositorios oficiales:

```bash
sudo pacman -Syu
sudo pacman -S jdk-openjdk
```

Verifica la instalación:

```bash
java -version
javac -version
```

Si necesitas múltiples versiones de Java, instala `archlinux-java` y gestiona las versiones:

```bash
sudo pacman -S archlinux-java
archlinux-java status
sudo archlinux-java set java-21-openjdk
```

### Ubuntu / Debian

Instala OpenJDK desde los repositorios:

```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

Verifica la instalación:

```bash
java -version
javac -version
```

Si necesitas cambiar entre versiones de Java:

```bash
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

### Fedora / RHEL

```bash
sudo dnf install java-21-openjdk-devel
```

Verifica la instalación:

```bash
java -version
javac -version
```

### Variables de entorno (opcional)

En la mayoría de distribuciones, `JAVA_HOME` se configura automáticamente. Si necesitas configurarlo manualmente:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

Agrega estas líneas a tu `~/.bashrc`, `~/.zshrc` o `~/.config/fish/config.fish` según tu shell.

---

## Windows

### Opción 1: Instalación directa

1. Descarga OpenJDK desde [Adoptium](https://adoptium.net/) o [Oracle](https://www.oracle.com/java/technologies/downloads/).
2. Ejecuta el instalador y sigue los pasos.
3. Marca la opción para agregar Java al PATH durante la instalación.

Verifica la instalación en PowerShell:

```powershell
java -version
javac -version
```

### Opción 2: Con winget

Si tienes Windows 11 o Windows 10 actualizado:

```powershell
winget install Microsoft.OpenJDK.21
```

### Opción 3: Con Chocolatey

```powershell
choco install openjdk21
```

### Configurar JAVA_HOME en Windows

Si el instalador no lo configuró automáticamente:

1. Busca "Variables de entorno" en el menú de inicio.
2. En "Variables del sistema", haz clic en "Nueva".
3. Nombre: `JAVA_HOME`
4. Valor: Ruta donde instalaste Java (ejemplo: `C:\Program Files\Eclipse Adoptium\jdk-21.0.0.12-hotspot`)
5. Agrega `%JAVA_HOME%\bin` al PATH del sistema.

---

## macOS

### Con Homebrew (recomendado)

```bash
brew install openjdk@21
```

Vincula el JDK al sistema:

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk \
  /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

Verifica la instalación:

```bash
java -version
javac -version
```

### Instalación manual

1. Descarga OpenJDK desde [Adoptium](https://adoptium.net/).
2. Abre el `.pkg` y sigue las instrucciones.
3. Verifica con `java -version`.

### Gestionar múltiples versiones

Usa `jenv` para cambiar entre versiones de Java fácilmente:

```bash
brew install jenv
jenv add /Library/Java/JavaVirtualMachines/openjdk-21.jdk/Contents/Home
jenv global 21
```

---

## Verificar la instalación

Después de instalar, crea un archivo `Hola.java`:

```java
public class Hola {
    public static void main(String[] args) {
        System.out.println("Java está instalado correctamente");
    }
}
```

Compílalo y ejecútalo:

```bash
javac Hola.java
java Hola
```

Si ves `Java está instalado correctamente`, todo funciona.

---

## Herramientas adicionales recomendadas

- **IDE**: IntelliJ IDEA (Community o Ultimate) o Eclipse
- **Gestor de builds**: Maven o Gradle (lo veremos en capítulos posteriores)
- **Control de versiones**: Git

No necesitas instalar todo esto ahora. Con el JDK es suficiente para comenzar.

## Próximo paso

Ahora que tienes Java instalado, escribe tu primer programa: [Primer programa →](/introduccion/primer-programa/)
