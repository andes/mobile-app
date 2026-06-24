![ANDES](https://github.com/andes/andes.github.io/raw/master/images/logo.png)

# Mobile

Aplicación Mobile para ANDES desarrollada con Ionic + Angular + Cordova.

---

# Notas

Como Angular, Ionic y Cordova son proyectos que se actualizan constantemente, recomendamos utilizar las versiones específicas detalladas en este documento.

El proyecto actualmente se encuentra alineado con:

- Node.js 16.20.0
- Java 17
- Android SDK 35
- Cordova Android 14
- Ionic CLI 6

---

# Requerimientos Android/Linux

## Node.js

El proyecto utiliza oficialmente:

```bash
Node.js 16.20.0
npm 8.x
```

Se recomienda utilizar `nvm`:

```bash
nvm install 16.20.0
nvm use 16.20.0
```

Verificar:

```bash
node -v
npm -v
```

---

## Instalar Android SDK (CLI)

Actualmente el proyecto compila utilizando:

```text
compileSdkVersion = 35
targetSdkVersion  = 35
minSdkVersion     = 26
```

### Descargar Android Command Line Tools

```bash
cd /tmp

wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
```

---

### Crear directorio SDK

```bash
mkdir -p ~/Android/Sdk/cmdline-tools

cd ~/Android/Sdk/cmdline-tools
```

---

### Descomprimir tools

```bash
unzip /tmp/commandlinetools-linux-11076708_latest.zip

mv cmdline-tools latest
```

---

## Configurar Android SDK (Linux)

Agregar al `PATH` en `~/.bashrc` o `~/.zshrc`:

```bash
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

export PATH="$PATH:$ANDROID_SDK_ROOT/platform-tools"
export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin"
```

Aplicar cambios:

```bash
source ~/.bashrc
```

Verificar:

```bash
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT
```

---

## Instalar componentes Android

```bash
sdkmanager "platform-tools"
sdkmanager "platforms;android-35"
sdkmanager "build-tools;35.0.0"
sdkmanager "cmdline-tools;latest"
```

---

## Licencias Android SDK

Para poder generar builds es necesario aceptar las licencias:

```bash
sdkmanager --licenses
```

Aceptar todas.

---

## Instalar Java 17

El proyecto requiere Java 17.

Ubuntu / Debian:

```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

Verificar:

```bash
java -version
```

---

# Instalación dentro del proyecto

```bash
cd mobile-app
```

---

## Limpiar entorno previo

El proyecto recrea automáticamente:

- `platforms/`
- `plugins/`

Por lo tanto, ante cualquier problema de build:

```bash
rm -rf node_modules platforms plugins
```

---

## Ionic / Cordova

Se recomienda utilizar `npx` para evitar diferencias entre:

- versiones globales
- CI/CD
- entornos locales

Verificar:

```bash
npx ionic -v
npx cordova -v
```

Opcionalmente se pueden instalar de forma global:

```bash
sudo npm install -g @ionic/cli@6 cordova@10
```

---

## Native run para Ionic

Opcional para desarrollo en dispositivo:

```bash
sudo npm install -g native-run
```

---

## Instalar dependencias

```bash
npm ci
```

---

# Configuración de environment

Crear el archivo de entorno para desarrollo:

```bash
src/environments/environment.ts
```

a partir de:

```bash
src/environments/environment.ts.example
```

Ejemplo:

```bash
cp src/environments/environment.ts.example \
   src/environments/environment.ts
```

> `src/environments/environment.ts` corresponde al entorno de desarrollo.

Para demo completar:

```bash
environment.demo.ts
```

Para producción completar:

```bash
environment.prod.ts
```

---

# Firebase / google-services.json

El proyecto utiliza tres archivos Firebase en la raíz del repositorio:

```text
google-services.json          # desarrollo
google-services-demo.json     # release demo
google-services-prod.json     # release producción
```

Al crear o recrear `platforms/android`, este archivo debe copiarse hacia la plataforma Android como se verá en el próximo paso.


---

# Compilar e iniciar la aplicación

## 1. Generar resources

```bash
npx ionic cordova resources android
```

Este comando genera:

- splash screens
- íconos Android
- adaptive icons

Solo es necesario ejecutar este paso la primera vez que se configura el proyecto, o cuando se modifican íconos, splash screens o recursos gráficos de la aplicación.

No es necesario ejecutarlo antes de cada build ni durante el desarrollo diario.

Si se elimina `platforms/` y se recrea la plataforma Android desde cero, puede ser necesario volver a ejecutar este comando antes del primer build.

> ⚠️ Puede mostrar warnings de `cordova-res`. No afectan el build.

---

## 2. Agregar plataforma Android

```bash
npx ionic cordova platform add android
```

> ℹ️ El proyecto no versiona `platforms/`, por lo tanto la plataforma se recrea automáticamente.

Si este paso falla, verificar:

- Java 17
- Android SDK 35
- Licencias Android
- Variables de entorno

---

## 3. Copiar google-service.json

```bash
cp google-services.json \
   platforms/android/app/google-services.json
```

---

### Aclaración

Los 3 pasos anteriores pueden resumirse con el script para desarrollo:

```bash
npm run prepare:dev
```

Hasta este paso, normalmente sólo es necesario la primera vez que se configura el proyecto o cuando se recrea completamente la plataforma Android.

---

## 4. Build Android

### Debug

```bash
npx ionic cordova build android
```
---


## Ejecutar como aplicación web para desarrollo

La app puede levantarse en un navegador para desarrollo local usando el servidor de Angular/Ionic, sin necesidad de agregar una plataforma Cordova.

Para eso, configurar `src/environments/environment.ts` con las URLs del entorno que se quiera usar.

Luego ejecutar:

```bash
npm start -- --host 127.0.0.1 --port 4200
```

La pantalla inicial queda disponible en:

```text
http://127.0.0.1:4200/mobile/home
```

Tener en cuenta que este modo sirve principalmente para desarrollo y pruebas visuales. Algunas funcionalidades dependen de plugins nativos de Cordova y pueden no estar disponibles o comportarse distinto en navegador.

---

### Build para plataforma browser

El proyecto también incluye un script para compilar usando la plataforma `browser` de Cordova:

```bash
npm run build:browser
```

Este comando no genera un ejecutable móvil como `.apk`, `.aab` o `.ipa`. Genera archivos web estáticos dentro de la plataforma Cordova Browser.

Para usarlo, la plataforma `browser` debe estar agregada en el proyecto:

```bash
npx ionic cordova platform add browser
```

Este build puede servir para pruebas o despliegues web puntuales, pero no reemplaza el build Android de la aplicación mobile.


---

# Desarrollo en dispositivo físico

## Ejecutar en dispositivo

```bash
npx ionic cordova run android --device
```

---

## Live Reload

Modo recomendado para desarrollo:

```bash
npx ionic cordova run android \
  -l \
  --external \
  --device
```

Esto permite:

- Live reload
- Source maps
- Debug remoto
- Inspección desde Chrome

---

# Network Security Config

El proyecto utiliza:

```text
resources/android/xml/network_security_config.xml
```

para permitir conexiones HTTP locales durante desarrollo.

Esto es necesario especialmente para:

```bash
ionic cordova run android -l --external --device
```

ya que el servidor de desarrollo utiliza:

```text
http://<IP_LOCAL>:8100
```

Si cambia la IP local, actualizar el dominio permitido dentro de:

```text
network_security_config.xml
```

---

# Debug Android

Abrir:

```text
chrome://inspect/#devices
```

Requisitos:

- USB Debugging habilitado
- Dispositivo autorizado
- Cable USB con transferencia de datos

---

# Uso del entorno

```typescript
import { ENV } from '@app/env';

const baseUrl = ENV.API_URL;
```

---

# Generar release para Android

## APK (.apk) y Bundle (.aab)

### Archivos requeridos

Deben estar presentes:

- `andes-key.jks`
- `build-andes.json`
- `google-services.json`

---

## Versionado

Incrementar la versión en:

```text
ionic.config.json
```

Reglas:

- Fix:

```text
4.1.4 => 4.1.5
```

- Mejora:

```text
4.1.4 => 4.2.0
```

- Cambio importante:

```text
4.1.4 => 5.0.0
```

---

## Generar release

Los scripts de release utilizan los archivos Firebase correspondientes:

- Demo: `google-services-demo.json`
- Producción: `google-services-prod.json`

Con el directorio limpio:

### Desarrollo

```bash
npm run build:demo:android:apk
npm run build:demo:android:aab
```

### Producción

```bash
npm run build:prod:android:apk
npm run build:prod:android:aab
```

---

## Resultado

Se genera:

```text
andes{Prod|Demo}-v{X.Y.Z}.{apk|aab}
```

- APK → pruebas locales
- AAB → Google Play

---

# CI/CD

El pipeline oficial utiliza:

- Ubuntu 22.04
- Node 16.20.0
- Java 17

El flujo principal ejecuta:

```bash
rm -rf node_modules platforms plugins

npm ci

npx ionic cordova resources android
npx ionic cordova platform add android

cp google-services.json \
   platforms/android/app/google-services.json

npx ionic cordova build android --no-interactive
```

---

# Tests con Emulador

## Listar emuladores

```bash
avdmanager list avd
```

---

## Ejecutar emulador

```bash
emulator -avd NOMBRE_AVD
```

---

## Ejecutar app sobre emulador

```bash
npx ionic cordova run android --emulator -l
```

---

# Troubleshooting

## Android SDK not found

Verificar:

```bash
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT
```

---

## Failed to find Build Tools revision

Instalar:

```bash
sdkmanager "build-tools;35.0.0"
```

---

## SDK license not accepted

Ejecutar:

```bash
sdkmanager --licenses
```

---

## Java version incompatible

Verificar:

```bash
java -version
```

Debe ser:

```text
Java 17
```

---

## Error luego de actualizar plugins o plataformas

Limpiar completamente:

```bash
rm -rf node_modules platforms plugins

npm ci

npx ionic cordova resources android
npx ionic cordova platform add android
```

---

# Entorno validado

El proyecto fue validado sobre:

```text
Ubuntu 22.04
Node 16.20.0
npm 8.x
Java 17
Android SDK 35
Cordova Android 14
```
