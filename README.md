![ANDES](https://github.com/andes/andes.github.io/raw/master/images/logo.png)

## Mobile

App Mobile para ANDES

## Notas

Como Angular2 y Angular-CLI son proyectos que están en constante actualización, recomendamos utilizar las versiones específicas detalladas en este documento

## Instalación

### Instalar dependencias

```bash
sudo npm install -g ionic cordova
cd mobile-app
npm install
```

### Definir environment

```bash
cd src/environments
cp environment.ts.example environment.ts
cp environment.ts.example environment.dev.ts
```
Para desarrolo completar el archivo environment.dev.ts
Para producción completar el archivo environment.ts

### Compilar e iniciar la aplicación

```bash
ionic cordova platform add android (o ios)
ionic cordova run android (o ios)
```

### Uso del entorno

```bash
import { ENV } from '@app/env';
  ...
let baseUrl = ENV.API_URL;  
```

### Release para *Android* APK (.apk) y Bundle (.aab)

0. Deben estar presentes los archivos privados `andes-key.jks`, `build-andes.json` (antes era `build.json`) y `google-services.json`
1. Se debe incrementar la versión en [ionic.config.json](ionic.config.json) según corresponda, por ejemplo:
    - Si es un fix se incrementa el último número 4.1.4 => 4.1.5
    - Si es una mejora se incrementa el segundo número 4.1.4 => 4.2.0
    - Si es un cambio importante en el entorno completo 4.1.4 => 5.0.0
    - Si es un cambio en una configuración, chore o lint, no incremanta versión
2. Hacer `commit` de los cambios (así se puede incrementar la versión con `npm`)
3. Con el directorio de trabajo limpio, ejecutar:
    1. VersiónGoogle Play Desarrollo:
        - Android APK: `npm run build:demo:android:apk`
        - Android Bundle (.aab): `npm run build:demo:android:aab`
    2. Versión paraGoogle Play Producción:
        - Android APK: `npm run build:prod:android:apk`
        - Android Bundle (.aab): `npm run build:prod:android:aab`
4. Al final del proceso se genera un archivo local —firmado y optimizado— con el nombre "andes{Prod|Demo}-v{X.Y.Z}.{apk|aab}" siendo X.Y.Z la versión configurada en [ionic.config.json](ionic.config.json)
5. Se recomienda usar la versión APK para pruebas y la versión Bundle para Google Play.