# Configuración del Proyecto

## Puesta en marcha

```bash
npm install
node seed.mjs      # carga usuarios y artículos de ejemplo
npm run dev        # levanta la API en http://localhost:3000
```

Variables de entorno (archivo `.env`):

| Variable       | Descripción                                  |
| -------------- | -------------------------------------------- |
| `DB_HOST`      | Host de la base de datos                     |
| `DB_PORT`      | Puerto de la base de datos                   |
| `DB_USERNAME`  | Usuario de la base de datos                  |
| `DB_PASSWORD`  | Contraseña de la base de datos               |
| `DB_DATABASE`  | Nombre de la base de datos                   |
| `PORT`         | Puerto HTTP de la API (por defecto `3000`)   |

## Datos de ejemplo

`seed.mjs` carga 10 usuarios y 20 artículos tomados de la FakeStore API. El
script es idempotente: si el registro ya existe (mismo `id`), lo actualiza.

| Usuario     | Contraseña  | Rol     |
| ----------- | ----------- | ------- |
| `johnd`     | `m38rmF$`   | ADMIN   |
| `mor_2314`  | `83r5^_`    | AUDITOR |
| `kevinryan` | `kev02937@` | CLIENT  |
| `donero`    | `ewedon`    | CLIENT  |

Para cargar el esquema y los datos desde cero en MariaDB/MySQL local:

```bash
node setup.mjs
```

## Rutas disponibles

| Método | Ruta                   | Descripción                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/health`              | Estado de la API                     |
| GET    | `/users`               | Lista de usuarios (sin contraseñas)  |
| POST   | `/users/login`         | Inicio de sesión                     |
| POST   | `/users`               | Crear usuario                        |
| GET    | `/products`            | Lista de artículos                   |
| GET    | `/products/categories` | Categorías disponibles               |
| GET    | `/products/:id`        | Artículo por id                      |
| POST   | `/products`            | Crear artículo                       |
| PUT    | `/products`            | Actualizar artículo (id en el body)  |
| DELETE | `/products/:id`        | Eliminar artículo                    |
