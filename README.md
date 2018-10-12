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
ionic cordova platform add android
ionic cordova run android
```

### Uso del entorno

```bash
import { ENV } from '@app/env';
  ...
let baseUrl = ENV.API_URL;  
```
