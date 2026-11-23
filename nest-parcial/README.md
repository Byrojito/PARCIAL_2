# Proyecto Base — Parcial Práctico Backend (NestJS + MongoDB)

API REST en NestJS y Mongoose para la gestión de **Usuarios (`/users`)** y **Tareas (`/tasks`)**.

---

## Requisitos Previos

- **Node.js** 18+ y **npm**
- **Docker Desktop** (o instancia local de MongoDB en el puerto `27017`)

---

## Instalación y Puesta en Marcha

1. **Levantar la base de datos MongoDB:**
   ```bash
   docker compose up -d
   ```
   *(Si utilizas una instancia local o MongoDB Atlas diferente a `mongodb://localhost:27017/nest-parcial`, configura la variable `MONGODB_URI` en un archivo `.env` tomando como base `.env.example`.)*

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

---

## Pruebas y Validación

- **Ejecutar pruebas unitarias:**
  ```bash
  npm test
  ```
- **Ejecutar pruebas end-to-end:**
  ```bash
  npm run test:e2e
  ```
- **Verificar compilación y linter:**
  ```bash
  npm run build
  npm run lint
  ```

---

## Endpoints del Sistema

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Verificación básica del servidor |
| `POST` | `/users` | Público | Crear usuario (`name`, `email`) |
| `GET` | `/users` | Público | Listar usuarios registrados |
| `GET` | `/users/:id` | Público | Consultar usuario por ID |
| `GET` | `/tasks` | Público | Listar tareas registradas |
| `GET` | `/tasks/:id` | Público | Consultar tarea por ID |
| `POST` | `/tasks` | Restringido (`Authorization: admin-secret-token`) | Crear una tarea asociada a un usuario |

También puedes importar `nest-parcial.postman_collection.json` en Postman o utilizar `requests.http` con la extensión REST Client de VS Code para probar manualmente los endpoints.

## Evidencia de corrección — Parcial 2

*CreateTaskDto.ts permite únicamente `title`, `description`, `completed` y `userId`. El `ValidationPipe` global rechaza propiedades no declaradas con `400 Bad Request`; `TaskSchema` también tiene `strict: true, cosa importnate.
*`TasksModule` consume `UsersService` exportado por `UsersModule` para comprobar al usuario. El módulo de tareas no registra el esquema de usuarios.
*`AuthGuard` se aplica solamente a `POST /tasks`; las consultas `GET /tasks` y `GET /tasks/:id` permanecen públicas, lo que permite arreglar lo dicho en el enunciado.
*`TasksController` depende únicamente de `TasksService`; la verificación del usuario/persistencia se realizan en `TasksService.create`, validando la persistencia en efecto.
*Las pruebas de `src/tasks/tasks.controller.spec.ts` verifican consulta pública, autorización, rechazo de propiedades extra y delegación al servicio. `src/tasks/tasks.service.spec.ts` verifica la validación del usuario y persistencia.


-> Copilot de vscode, me ayudo a crear un .gitignore, dado que aparecian garacias a la 
instalción de npm como 10.000 changes para el commit, algo 0 logico, entonces pues le pedi ayuda solo para eso.