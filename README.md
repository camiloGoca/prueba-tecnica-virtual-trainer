# Registro de Entrenamientos

Aplicacion web para registrar, editar, eliminar y consultar entrenamientos en tiempo real.

El proyecto fue construido como prueba tecnica usando Vue 3, TypeScript, Vite, Firebase Firestore y Firebase Hosting.

## Demo

Aplicacion publicada en Firebase Hosting:

```txt
https://prueba-tecnica-virtual-trainer.web.app
```

## Tecnologias

- Vue 3
- TypeScript
- Vite
- Composition API
- `<script setup>`
- Firebase
- Cloud Firestore
- Firebase Hosting
- ESLint
- Prettier

## Funcionalidades

- Crear entrenamientos.
- Editar entrenamientos existentes.
- Cancelar la edicion.
- Eliminar entrenamientos.
- Consultar historial en tiempo real con `onSnapshot()`.
- Mostrar entrenamientos ordenados por fecha.
- Filtrar entrenamientos por rango de fechas.
- Validaciones basicas del formulario.
- Estados de carga, error y lista vacia.
- Interfaz responsive basada en cards.

## Estructura del Proyecto

```txt
src/
  assets/
  components/
    TrainingCard.vue
    TrainingFilters.vue
    TrainingForm.vue
    TrainingList.vue
  composables/
    useEntrenamientos.ts
  firebase/
    firebase.ts
  services/
    entrenamientoService.ts
  types/
    Entrenamiento.ts
  App.vue
  main.ts
  style.css
```

### Responsabilidades Principales

- `components/`: componentes visuales reutilizables.
- `composables/`: logica reactiva de Vue y estado de la pantalla.
- `firebase/`: inicializacion de Firebase.
- `services/`: operaciones contra Firestore.
- `types/`: modelos TypeScript compartidos.

## Modelo de Datos

La aplicacion utiliza una interfaz dedicada para representar cada entrenamiento:

```ts
export interface Entrenamiento {
  id?: string
  fecha: string
  duracion: number
  distancia: number
}
```

En Firestore los documentos se guardan en la coleccion:

```txt
entrenamientos
```

Campos esperados:

```txt
fecha       string
duracion    number
distancia   number
```

## Instalacion

Clonar el repositorio:

```bash
git clone https://github.com/camiloGoca/prueba-tecnica-virtual-trainer.git
```

Entrar al proyecto:

```bash
cd prueba-tecnica-virtual-trainer
```

Instalar dependencias:

```bash
npm install
```

## Configuracion de Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto tomando como base `.env.example`:

```bash
cp .env.example .env
```

En Windows PowerShell tambien puedes usar:

```powershell
Copy-Item .env.example .env
```

Completar las variables con la configuracion de la app web de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

> Nota: Firebase expone estas claves en aplicaciones web. Se usan variables de entorno para mantener una configuracion ordenada y evitar hardcodear valores dentro del codigo fuente.

## Configuracion de Firebase

1. Crear un proyecto en Firebase Console.
2. Registrar una aplicacion web.
3. Copiar la configuracion de Firebase al archivo `.env`.
4. Crear una base de datos en Cloud Firestore.
5. Crear la coleccion exacta:

```txt
entrenamientos
```

6. Configurar reglas de Firestore segun el entorno.

La prueba tecnica solicita CRUD con Firestore, pero no especifica autenticacion de usuarios. Por ese motivo, para validar el funcionamiento del proyecto en un entorno de prueba se pueden usar reglas temporales:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> Importante: estas reglas son solo para desarrollo y demostracion de la prueba tecnica. En un entorno de produccion se debe integrar Firebase Authentication y restringir las reglas para permitir acceso solo a usuarios autorizados.

## Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir la URL local que indique Vite, normalmente:

```txt
http://localhost:5173/
```

## Validacion Local

Ejecutar ESLint:

```bash
npm run lint
```

Generar build de produccion:

```bash
npm run build
```

Previsualizar el build:

```bash
npm run preview
```

## Despliegue en Firebase Hosting

Instalar Firebase CLI si no esta instalada:

```bash
npm install -g firebase-tools
```

Iniciar sesion:

```bash
firebase login
```

Generar el build:

```bash
npm run build
```

Desplegar solo Hosting:

```bash
firebase deploy --only hosting
```

La configuracion de Hosting se encuentra en:

```txt
firebase.json
.firebaserc
```

El directorio publicado es:

```txt
dist
```

## Scripts Disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Repositorio

```txt
https://github.com/camiloGoca/prueba-tecnica-virtual-trainer.git
```
