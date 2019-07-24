![ANDES](https://github.com/andes/andes.github.io/raw/master/images/logo.png)

## Mobile

App Mobile para ANDES

## Notas

Como Angular2 y Angular-CLI son proyectos que están en constante actualización, recomendamos utilizar las versiones específicas detalladas en este documento

## Instalación

### Instalar JAVA

1. Descargar [java](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

2. Creamos nueva carpeta y extraemos en ella:
```bash
$ cd /usr/local 
$ sudo mkdir java && cd java 
$ sudo tar xzvf ~/jdk-*****_***.tar.gz
```
3. Necesitamos agregar esta carpeta extraída en la ruta del sistema. Esto se logra al actualizar el ~/.bashrcarchivo con un editor (vi, vim, nano, etc.).
```bash
$ cd ~ 
$ nano .bashrc
```

4. Agregamos las siguientes líneas al final del archivo, reemplazando *** por la versión correcta:
```bash
export JAVA_HOME="/usr/local/java/jdk1.8.0_***"
PATH=$PATH:$JAVA_HOME/bin
```

5. Volvemos a cargar bash y confirmamos las actualizaciones trabajadas:
```bash
$ source .bashrc 
$ javac -version  (esto debería imprimir 'javac 1.8.0_***')
```

### GRADLE

1. Gradle se ejecuta en todos los sistemas operativos principales y requiere solo un Java JDK o JRE versión 8 o superior para instalarse.
```bash
$ sdk install gradle 5.4.1
```
o
```bash
sudo add-apt-repository ppa:cwchien/gradle
sudo apt-get update
sudo apt-get install gradle-ppa
```

2. Verifica tu instalación
Ejecute gradle -v  para ejecutar gradle y muestre la versión.


### ANDROID STUDIO

1. Descargar [Android Estudio IDE](https://developer.android.com/studio/).

2. Moverse a la ubicación deseada y descomprimir los archivos:
```bash
$ cd/usr/local 
$ sudo unzip ~/Descargas/android-studio-ide-*****. zip
$ cd android-studio/bin 
$ ./studio.sh
```

3. Instalar normalmente desde el asistente. Al finalizar cerrar android-studio. Esto va a matar también la instancia de la terminal.

4. Actualizamos ~/.bashrc nuevamente para agregar Android a la ruta del sistema.
```bash
$ cd ~ 
$ nano .bashrc
```

5. Al final del documento agregamos:
```bash
export ANDROID_HOME="/home/nombreUsuario/Android/Sdk" 
PATH=$PATH:$ANDROID_HOME/tools 
PATH=$PATH:$ANDROID_HOME/platform-tools
```

6. Luego nos movemos a $ANDROID_HOME/tools/bin y aceptamos todas las licencias..
```bash
$ ./sdkmanager --licenses
```

7. Después de instalar el SDK de Android, también debe instalar los paquetes para cualquier nivel de API que desee alcanzar. Abra el Android SDK Manager ( Tools > SDK Manageren Android Studio o sdkmanageren la línea de comandos) y asegúrese de que estén instalados los siguientes:
    * Android Platform SDK para su versión específica de Android
    * Android SDK build-tools versión 19.1.0 o superior	
    * Repositorio de soporte de Android (que se encuentra en la pestaña "Herramientas del SDK")
    * Paquetes recomendados

8. Debes tener en cuenta las siguientes herramientas de la pestaña SDK Tools:
     * Android SDK Build Tools: Obligatorio. Se incluyen herramientas que permiten compilar apps para Android. Consulta las notas de la versión de SDK Build Tools.
    * Android SDK Platform Tools: Obligatorio. Incluye varias herramientas que requiere la plataforma de Android, incluída la herramienta adb.
    * Android SDK Tools: Obligatorio. Incluye herramientas esenciales, como ProGuard. Consulta las notas de la versión de SDK Tools.
    * Android Emulator:  Recomendada. Es una herramienta de emulación de dispositivos basada en QEMU que puedes utilizar para depurar y probar tus aplicaciones en un entorno de ejecución real. Consulta las notas de la versión de Android Emulator.

### IONIC Y CORDOVA

1. Instalar Ionic y Cordova globalmente en las versiones indicadas:
```bash
npm install -g ionic@4.10.2
npm install -g ionic-angular@3.9.6
npm install -g @ionic/app-scripts@3.2.3
npm install -g cordova@8.1.2 // v8.1.2 IMPORTANTE P SQLITE!
```
2. Ejecutar comando ionic info, la siguiente información debe mostrarse:
```bash
Ionic:

   ionic (Ionic CLI)  : 4.10.2 (/usr/local/lib/node_modules/ionic)
   Ionic Framework    : ionic-angular 3.9.6
   @ionic/app-scripts : 3.2.3

Cordova:

   cordova (Cordova CLI) : 8.1.2 (cordova-lib@8.1.1) 
   Cordova Platforms     : android 6.3.0
   Cordova Plugins       : no whitelisted plugins (22 plugins total)

System:

    (...)
```

**Nota:** Si se desinstala cordova o ionic, debe asegurarse de desinstalarlo globalmente para evitar diferencias entre versiones:
```bash
sudo npm uninstall -g cordova
sudo npm uninstall -g ionic
```

### INSTALAR MOBILE-APP

1. Clonar proyecto desde GitHub e instalar
```bash
git clone https://github.com/andes/mobile-app.git
cd mobile-app
npm install
```

2. Instalar dependencias 
```bash 
npm i 
```
3. Pegar el archivo google-services.json dentro del directorio mobile-app. El archivo se encuentra en la carpeta Para instalación de proyecto mobile.

4. Definimos entorno: 
```bash
cd src/environments
cp environment.ts.example environment.ts
cp environment.ts.example environment.dev.ts
```

5. Agregar plugin phonegap-plugin-push v2.1.2:
```bash 
cordova plugin add phonegap-plugin-push@2.1.2
```


### Compilar e iniciar la aplicación

Compilamos e iniciamos .. el resultado de esto es la apk lista para mover e instalar en un dispositivo móvil.

1. Agregar plataforma para android:
```bash 
ionic cordova platform add android 
```

2. Build del aplicativo android
```bash
ionic cordova build android 
```

3. Instalar y correr en dispositivo android:
Antes de correr el comando se debe habilitar desde la configuración del dispositivo la depuración USB y la instalación vía USB y asegurarse que esté correctamente conectado vía USB a la computadora
```bash 
ionic cordova run android --devices 
```

### Uso del entorno

```bash
import { ENV } from '@app/env';
  ...
let baseUrl = ENV.API_URL;  
```
