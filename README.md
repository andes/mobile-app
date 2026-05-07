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

Crear:

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

Para desarrollo completar:

```bash
environment.dev.ts
```

Para producción completar:

```bash
environment.prod.ts
```

---

# Firebase / google-services.json

El proyecto requiere el archivo:

```text
google-services.json
```

Ubicarlo en la raíz del proyecto.

Durante el build se copia automáticamente hacia:

```text
platforms/android/app/google-services.json
```

Si fuera necesario copiarlo manualmente:

```bash
cp google-services.json \
   platforms/android/app/google-services.json
```

---

# Compilar e iniciar la aplicación

## 1. Generar resources

Paso obligatorio:

```bash
npx ionic cordova resources android
```

Este comando genera:

- splash screens
- íconos Android
- adaptive icons

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

## 3. Build Android

### Debug

```bash
npx ionic cordova build android
```

### Release

```bash
npx ionic cordova build android --release
```

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
