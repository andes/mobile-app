![ANDES](https://github.com/andes/andes.github.io/raw/master/images/logo.png)

## Mobile

App Mobile para ANDES

## Notas

Como Angular y Angular-CLI son proyectos que están en constante actualización, recomendamos utilizar las versiones específicas detalladas en este documento

## Requerimientos Android/Linux
### Instalar Android Studio
- [Descargar Android Studio](https://developer.android.com/studio/) o usando el instalador de paquetes del sistema
- Abrir Android Studio y seguir estos pasos:
    * Ir al menú `File => Settings`
    * Ir a `System Settings => Android SDK`
    * Seleccionar `Android 10.0/API Level 29`
    * Instalar (botón `Apply`)
### Configurar Android SDK (Linux)
Agregar al PATH en el archivo ~/.bashrc
```bash
# ejemplo: export ANDROID_SDK_ROOT="/home/andrrr/Android/Sdk"
export ANDROID_SDK_ROOT="/home/MI-USUARIO/RUTA/A/ANDROID/Sdk"
PATH=$PATH:$ANDROID_SDK_ROOT/tools 
PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```
### Licencias
Para poder generar builds, es necesario aceptar ciertas licencias de uso. Para ello se debe navegar por consola a 

```bash
/home/MI-USUARIO/Android/Sdk/tools/bin
``` 
y ejecutar el siguiente comando (aceptar todo):

```bash
./sdkmanager --licenses
```

### Instalar JDK8 (Ubuntu/Mint/Debian)
Android/Cordova necesitan la versión 8, no funciona con versiones más nuevas. Por tanto, si hay una versión más nueva, primero se desinstala. 
También se puede instalar [la versión de Oracle](https://www.oracle.com/ar/java/technologies/javase/javase-jdk8-downloads.html).
```bash
sudo apt update
sudo apt remove openjdk*
sudo apt install openjdk-8-jdk
```

### Instalar y configurar Gradle
- [Descargar la última versión de Gradle](https://gradle.org/releases/).
- Agregar al PATH en el archivo ~/.bashrc:
```bash
export PATH=$PATH:/home/MI-USUARIO/RUTA/A/GRADLE/gradle-X.Y.Z/bin
```

## Instalación dentro del proyecto
```bash
cd mobile-app
```


#### Ionic 5

```bash
sudo npm install -g @ionic/cli@6.12.4
```

#### Native run para Ionic
```bash
sudo npm install -g native-run
```

#### Cordova y cordova-res (genera íconos y splash screen)
```bash
sudo npm install -g cordova@10.0.0 cordova-res
```

#### Instalar dependencias
```
npm install
```

### Definir environment

```bash
cd src/environments
cp environment.ts.example environment.ts
cp environment.ts.example environment.dev.ts
```
Para desarrollo completar el archivo environment.dev.ts
Para producción completar el archivo environment.ts

### Compilar e iniciar la aplicación

1. Generar resources (splash screen, íconos):
```bash
cordova-res
# Nota: se ejecuta sólo la primera vez, o cada vez que se cambie el diseño de íconos o splash screen
```

2. Agregar platform y correr en dispositivo
```bash
ionic cordova platform add android (o ios)
ionic cordova run android (o ios) 
```

### Uso del entorno

```typescript
import { ENV } from '@app/env';
  ...
const baseUrl = ENV.API_URL;  
```

### Generar release para **Android** APK (.apk) y Bundle (.aab)

0. Deben estar presentes los archivos privados `andes-key.jks`, `build-andes.json` (antes era `build.json`) y `google-services.json`
1. Se debe incrementar la versión en [ionic.config.json](ionic.config.json) según corresponda, por ejemplo:
    - Si es un fix se incrementa el último número 4.1.4 => 4.1.5
    - Si es una mejora se incrementa el segundo número 4.1.4 => 4.2.0
    - Si es un cambio importante en el entorno completo 4.1.4 => 5.0.0
    - Si es un cambio en una configuración, chore o lint, no incremanta versión
2. Hacer `commit` de los cambios (así se puede incrementar la versión con `npm`)
3. Con el directorio de trabajo limpio, ejecutar:
    1. Release Google Play Desarrollo:
        - Android APK: `npm run build:demo:android:apk`
        - Android Bundle (.aab): `npm run build:demo:android:aab`
    2. Release Google Play Producción:
        - Android APK: `npm run build:prod:android:apk`
        - Android Bundle (.aab): `npm run build:prod:android:aab`
4. Al final del proceso se genera un archivo local —firmado y optimizado— con el nombre "andes{Prod|Demo}-v{X.Y.Z}.{apk|aab}" siendo X.Y.Z la versión configurada en [ionic.config.json](ionic.config.json). Si un archivo con la misma versión ya existe, el proceso de build falla.
5. La versión **APK** es para pruebas, la versión **Bundle** para Google Play.