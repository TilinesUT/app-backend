# Backend "Tilines" — Funcionamiento completo del código

> Documento para la exposición del proyecto. Explica **cómo funciona** el sistema de punta a punta: arquitectura, cada capa, cada archivo, el recorrido de una petición y el contrato completo de la API.

---

## 1. ¿Qué es este proyecto?

Es una **API REST** (servidor HTTP) escrita en **TypeScript** sobre **Express**, que expone dos recursos —**productos** y **usuarios**— almacenados en una base de datos **MariaDB/MySQL**. No tiene interfaz gráfica propia: se consume desde cualquier cliente HTTP (Bruno, Postman, curl, frontend, etc.).

| Elemento | Tecnología | Para qué sirve |
|---|---|---|
| Lenguaje | TypeScript 7 | Tipado estático sobre todo el código |
| Ejecución | `tsx` | Corre los `.ts` directamente, sin compilar a JS |
| Servidor HTTP | Express 5.2.1 | Recibe peticiones, enruta, ejecuta middlewares y controladores |
| Base de datos | MariaDB (`tilines_db`) | Almacena `products` y `users` |
| Driver de BD | mysql2 3.24.5 | Conexión con pool + consultas parametrizadas |
| Validación | express-validator 7.3.2 | Valida el cuerpo/params de las peticiones antes del controlador |
| Puerto | `3000` | Fijo, definido en `index.ts` |

**En una frase:** el cliente manda una petición HTTP → Express la enruta → un middleware valida los datos → el controlador ejecuta la lógica → el modelo construye la consulta SQL → el pool de conexiones habla con la base de datos → la respuesta viaja de vuelta dentro de un sobre JSON uniforme.

---

## 2. Estructura del proyecto (con líneas exactas de cada archivo)

> **Convención usada en todo el documento:** `archivo:Lx–Ly` indica las líneas 1-based del archivo real, por ejemplo `products-routes.ts:L10` = la línea 10 de ese archivo. Así podrás ir directo al código durante la exposición.

```
Backend/
├── index.ts                          L1–L15   ← Punto de entrada: crea la app Express y monta rutas
├── package.json                      L1–L23   ← Dependencias y configuración del paquete
├── tsconfig.json                     L1–L44   ← Configuración estricta de TypeScript
├── EXPOSICION.md                              ← Este documento
├── node_modules/                              ← Dependencias instaladas
└── src/
    ├── types/
    │   └── api-types.ts              L1–L11   ← Tipos del sobre de respuesta (ApiResponse / ApiPromise)
    ├── routes/
    │   ├── users-routes.ts           L1–L10   ← Define los endpoints de /users
    │   └── products-routes.ts        L1–L14   ← Define los endpoints de /products
    ├── middlewares/
    │   ├── global-middlewares.ts     L1–L20   ← validateFields(): corta la petición si hay errores
    │   ├── users-middlewares.ts      L1–L24   ← Reglas de validación para usuarios
    │   └── products-middlewares.ts   L1–L84   ← Reglas de validación para productos
    ├── controllers/
    │   ├── api-controllers.ts        L1–L58   ← Pool de conexiones a la BD + helpers get()/execute()
    │   ├── products-controllers.ts   L1–L160  ← 6 handlers de productos
    │   └── users-controllers.ts      L1–L47   ← 2 handlers de usuarios
    └── models/
        ├── products-model.ts         L1–L128  ← Consultas SQL de productos + mapeo de filas
        └── users-model.ts            L1–L28   ← Consultas SQL de usuarios + mapeo de filas
```

**Total: 666 líneas de código en 14 archivos `.ts`.**

La regla de organización es **una responsabilidad por carpeta**: `routes` sabe *qué* URL existe, `middlewares` sabe *qué* datos son válidos, `controllers` sabe *qué* hacer, `models` sabe *cómo* hablar con la base de datos, y `api-controllers` sabe *cómo* abrir y cerrar conexiones.

---

## 3. Arquitectura en capas (MVC)

```
        Cliente (Bruno / Postman / frontend / curl)
                          │  HTTP
                          ▼
   ┌──────────────────────────────────────────────┐
   │  index.ts  ·  Punto de entrada               │
   │  express.json()  →  parsea el body JSON      │
   │  express.static('public') → archivos fijos   │
   │  app.use("/users")  app.use("/products")     │
   └──────────────────────┬───────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────┐
   │  src/routes/  ·  Enrutamiento                │
   │  Método HTTP + path + cadena de middlewares  │
   │  + controlador destino                       │
   └──────────────────────┬───────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────┐
   │  src/middlewares/  ·  Validación de entrada  │
   │  express-validator acumula errores           │
   │  validateFields():                           │
   │     · hay errores → responde 400 y corta     │
   │     · no hay errores → next() continúa       │
   └──────────────────────┬───────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────┐
   │  src/controllers/  ·  Lógica de negocio      │
   │  try/catch, llama al modelo, decide status,  │
   │  arma el JSON de respuesta                   │
   └──────────────────────┬───────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────┐
   │  src/models/  ·  Acceso a datos              │
   │  Construye SQL parametrizado (¿), mapea      │
   │  filas de la BD → objetos TypeScript         │
   └──────────────────────┬───────────────────────┘
                          ▼
   ┌──────────────────────────────────────────────┐
   │  src/controllers/api-controllers.ts          │
   │  Pool de conexiones → base de datos          │
   │  tilines_db (127.0.0.1, usuario root)        │
   └──────────────────────────────────────────────┘
```

Cada capa **solo habla con la de abajo**. El controlador nunca escribe SQL; el modelo nunca decide códigos HTTP; el middleware nunca toca la base de datos.

### 3.1 Dónde vive cada capa en el código

| Capa | Archivo(s) | Líneas |
|---|---|---|
| Punto de entrada | `index.ts` | L1–L15 |
| Enrutamiento | `src/routes/users-routes.ts` · `src/routes/products-routes.ts` | L1–L10 · L1–L14 |
| Validación | `src/middlewares/global-middlewares.ts` · `users-middlewares.ts` · `products-middlewares.ts` | L1–L20 · L1–L24 · L1–L84 |
| Controladores | `src/controllers/users-controllers.ts` · `products-controllers.ts` | L1–L47 · L1–L160 |
| Modelos | `src/models/users-model.ts` · `products-model.ts` | L1–L28 · L1–L128 |
| Conexión a BD | `src/controllers/api-controllers.ts` | L1–L58 |
| Tipos compartidos | `src/types/api-types.ts` | L1–L11 |

---

## 4. Recorrido completo de una petición

Ejemplo real: `POST http://localhost:3000/products` con un JSON en el cuerpo.

### Paso 1 — Llegada al servidor → `index.ts:L1–L15`

```ts
 1  import express from "express"
 2  import users_routes from "./src/routes/users-routes"
 3  import products_routes from "./src/routes/products-routes"
 4
 5  const app = express()
 6
 7  app.use(express.json());              // ① parsea el body JSON en req.body
 8  app.use(express.static('public'));    // ② sirve archivos estáticos (carpeta 'public')
 9
10  app.use("/users", users_routes)       // ③ monta el router de usuarios
11  app.use("/products", products_routes) // ④ monta el router de productos
12
13  app.listen(3000, _ => {
14      console.log("El servidor esta corriendo en puerto 3000")
15  })
```

1. **`index.ts:L7`** — `express.json()` transforma el cuerpo de la petición en un objeto JavaScript dentro de `req.body`. Sin esta línea, `req.body` sería `undefined`.
2. **`index.ts:L8`** — `express.static('public')` expondría archivos frontales (HTML/CSS/imágenes) si existiera la carpeta `public`.
3. **`index.ts:L10–L11`** — `app.use("/products", ...)` **desprefija** la ruta: Express entrega al router solo el resto de la URL. `/products/categories` llega al router como `/categories`.
4. **`index.ts:L13–L15`** — `app.listen(3000)` abre el puerto y solo a partir de ahí empiezan a llegar peticiones.

### Paso 2 — Enrutamiento → `src/routes/products-routes.ts:L1–L14`

```ts
 1  import { Router } from "express"
 2  import { productsControllers } from "../controllers/products-controllers";
 3  import { createProductValidator, deleteProductValidator, updateProductValidator } from "../middlewares/products-middlewares";
 4
 5  const router = Router();
 6
 7  router.get("/",          productsControllers.getProducts)
 8  router.get("/categories", productsControllers.getCategories)
 9  router.get("/:id",       deleteProductValidator, productsControllers.findProduct)
10  router.post("/",         createProductValidator, productsControllers.addProduct)
11  router.put("/",          updateProductValidator, productsControllers.updateProduct)
12  router.delete("/:id",    deleteProductValidator, productsControllers.deleteProduct)
13
14  export default router;
```

Aquí se empareja **método HTTP + path** con una **cadena de middlewares** y un **controlador**. Cada endpoint ocupa exactamente una línea: **`L7` a `L12`**. La regla de Express es que los middlewares intermedios se ejecutan en orden y cada uno decide si llama a `next()` para pasar al siguiente o si responde y detiene la cadena.

En nuestro ejemplo, `POST /` coincide con la **línea 10** → se ejecuta primero `createProductValidator` y, si todo está bien, `productsControllers.addProduct`.

El equivalente en usuarios está en `users-routes.ts:L7` (`GET /`) y `users-routes.ts:L8` (`POST /` con `createUserValidator`).

### Paso 3 — Validación → `src/middlewares/products-middlewares.ts:L4–L38`

`createProductValidator` (declarado en la **`L4`**, hasta la **`L38`**) es un **arreglo** de validaciones individuales, cada una sobre un campo del body:

```ts
 4  export const createProductValidator = [
 5      body("title")
 6          .notEmpty().withMessage("El título es obligatorio")
 7          .isString().withMessage("El título tiene que ser una cadena de texto")
 8          .isLength({ min: 2, max: 70 }).withMessage("Ingrese un título valido entre 2 y 70 caracteres"),
 9
10      body("category")
11          .notEmpty().withMessage("La categoría es obligatoria")
12          .isString().withMessage("La categoría tiene que ser una cadena de texto")
13          .isLength({ min: 2, max: 50 }).withMessage("Ingrese una categoría valida entre 2 y 50 caracteres"),
14
15      body("description")
16          .notEmpty().withMessage("La descripción es obligatoria")
17          .isString()...
18          .isLength({ min: 2, max: 100 })...
19
20      body("image")
21          .notEmpty().withMessage("La imagen es obligatoria")
22          .isString()...
23          .isLength({ min: 5, max: 200 })...
24
25      body("price")
26          .notEmpty().withMessage("El precio es obligatorio")
27          .isFloat({ min: 0 }).withMessage("Ingrese un precio valido mayor o igual a 0"),
28
29      body("rating_rate")
30          .optional({ nullable: true })
31          .isInt({ min: 0, max: 5 }).withMessage("Ingrese una calificación valida entre 0 y 5"),
32
33      body("rating_count")
34          .optional({ nullable: true })
35          .isInt({ min: 0 }).withMessage("Ingrese un conteo de calificaciones valido mayor o igual a 0"),
36
37      validateFields      // ← último eslabón: revisa todo lo acumulado
38  ];
```

Cada `body("campo")` ocupa un bloque: `title` en **L5–L8**, `category` en **L10–L13**, `description` en **L15–L18**, `image` en **L20–L23**, `price` en **L25–L27**, `rating_rate` en **L29–L31**, `rating_count` en **L33–L35**. `express-validator` **no responde por sí solo**: solo acumula errores en la petición. El que toma la decisión es el último elemento de la cadena, `validateFields` en la **línea 37**.

### Paso 4 — El cortocircuito de errores → `src/middlewares/global-middlewares.ts:L5–L20`

```ts
 5  export const validateFields = (req: Request, res: ApiPromise, next: NextFunction): any => {
 6      const errors = validationResult(req);          // recoge los errores acumulados
 7      if (!errors.isEmpty()) {
 8          const plainErrors = Object.fromEntries(
 9              Object.entries(errors.mapped()).map(([key, error]) => [key, error.msg])
10          );
11
12          return res.status(400).json({
13              ok: false,
14              status: 400,
15              err: plainErrors          // { campo: "mensaje", ... }
16          });
17      }
18
19      next();    // ← sin errores: la petición avanza al controlador
20  };
```

* **Si hay errores (`L7–L17`):** responde `400` con un mapa campo → mensaje (en español) y **no llama a `next()`**, así que el controlador jamás se ejecuta y la base de datos nunca se toca.
* **Si no hay errores (`L19`):** llama a `next()`, Express continúa con el siguiente middleware de la cadena, que es el controlador.

### Paso 5 — El controlador → `src/controllers/products-controllers.ts:L25–L46`

```ts
25      public addProduct = async (req: Request, res: Response): Promise<ApiPromise> => {
26          try {
27              const { title, price, description, category, image, rating_rate, rating_count } = req.body;
28              const newProduct = await ProductsModel.create({
29                  title, price, description, category, image, rating: { rate: rating_rate, count: rating_count }
30              });
31
32              return res.status(200).json({
33                  ok: true,
34                  status: 200,
35                  res: newProduct
36              });
37          }
38          catch (err: any) {
39              console.log(`Error en addProduct: ${err.message}`);
40              return res.status(500).json({
41                  ok: false,
42                  status: 500,
43                  msg: "Error interno del servidor al crear un producto"
44              })
45          }
46      }
```

El controlador hace tres cosas:

1. **Extrae** los datos ya validados de `req.body` (**`L27`**).
2. **Traduce** la forma "plana" que llega del cliente (`rating_rate`, `rating_count`) a la forma "anidada" que usa el modelo (`rating: { rate, count }`) (**`L28–L30`**).
3. **Responde** dentro del sobre JSON estándar (**`L32–L36`**), o captura cualquier excepción y devuelve un `500` con mensaje genérico (**`L38–L45`**); los detalles del error solo van al log del servidor (**`L39`**).

### Paso 6 — El modelo → `src/models/products-model.ts:L50–L69`

```ts
50      public static create = async (productData: ProductEntity): Promise<ProductEntity> => {
51          const { category, description, image, price, rating, title } = productData;
52          const rows = await apiControllers.execute<RowDataPacket[]>(
53              `INSERT INTO products
54                  (title, category, description, image, price, rating_rate, rating_count)
55              VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
56              [title, category, description, image, price, rating.rate, rating.count]
57          );
58
59          const row = rows[0] as any;
60          const product = {
61              ...row,
62              rating: {
63                  rate: row.rating_rate,
64                  count: row.rating_count
65              }
66          }
67
68          return product as ProductEntity;
69      }
```

Puntos clave de esta capa:

* **SQL parametrizado con `?`** (**`L53–L56`**): los valores nunca se concatenan en el string; se pasan como array (**`L56`**). Eso elimina de raíz la inyección SQL.
* **`RETURNING *`** (**`L55`**): la consulta devuelve la fila recién insertada, de modo que el modelo devuelve el objeto completo (con su `id` generado) **sin necesidad de una segunda consulta**.
* **Mapeo fila → entidad** (**`L59–L68`**): la base de datos guarda `rating_rate`/`rating_count` como columnas planas; el modelo las reagrupa en el objeto `rating { rate, count }` (**`L62–L65`**) que define la interfaz `ProductEntity` (`products-model.ts:L4–L15`).

### Paso 7 — La capa de conexión → `src/controllers/api-controllers.ts:L1–L58`

```ts
 1  import mysql, { type QueryResult } from "mysql2/promise"
 2
 3  class ApiControllers {
 4      private pool;
 5
 6      constructor() {
 7          this.pool = mysql.createPool({
 8              host: '127.0.0.1',
 9              user: 'root',
10              password: '',
11              database: 'tilines_db',
12              enableKeepAlive: true,
13              flags: ['-FOUND_ROWS']
14          })
15      }
16
17      private getConnection = async () => {
18          return this.pool.getConnection();
19      }
20
21      public get = async <T extends QueryResult = any>(query: string, values: any[] = []): Promise<T> => {
22          let conn;
23          try {
24              conn = await this.getConnection();
25              const response = values.length > 0
26                  ? await conn.execute<T>(query, values)   // con parámetros
27                  : await conn.query<T>(query);            // consulta sin parámetros
28              return response[0];
29          }
30          catch (err) {
31              throw err;
32          }
33          finally {
34              if (conn) {
35                  conn.release()                           // ← SIEMPRE se libera
36              }
37          }
38      }
39
40      public execute = async <T extends QueryResult>(query: string, values: any[]) => {
41          let conn;
42          try {
43              conn = await this.getConnection();
44              const response = await conn.execute<T>(query, values);
45              return response[0];
46          }
47          catch (err) {
48              throw err;
49          }
50          finally {
51              if (conn) {
52                  conn.release()
53              }
54          }
55      }
56  }
57
58  export const apiControllers = new ApiControllers()
```

* **Pool de conexiones** (**`L7–L14`**): en lugar de abrir y cerrar una conexión por consulta (muy costoso), el pool mantiene un conjunto de conexiones vivas que se reutilizan. La configuración concreta está en `L8–L13` (`host`, `user`, `password`, `database: 'tilines_db'`, `enableKeepAlive`, `flags`).
* **`getConnection()`** (**`L17–L19`**): único punto por el que se pide una conexión al pool.
* **`get()`** (**`L21–L38`**): consulta genérica. Elige entre `execute()` y `query()` según haya parámetros (**`L25–L27`**), devuelve siempre el primer elemento de la tupla (**`L28`**) y libera la conexión en el `finally` (**`L33–L37`**).
* **`execute()`** (**`L40–L55`**): variante para escrituras (`INSERT`/`UPDATE`/`DELETE`); siempre usa `conn.execute` con parámetros (**`L44`**) y también libera en `finally` (**`L50–L54`**).
* **Singleton** (**`L58`**): se exporta una única instancia (`export const apiControllers = new ApiControllers()`), de modo que todo el proyecto comparte el mismo pool.

### Paso 8 — Respuesta al cliente

El JSON vuelve por la misma cadena, con el sobre uniforme:

```json
{ "ok": true, "status": 200, "res": { "id": 12, "title": "Mouse Gamer", ... } }
```

---

## 5. Los tipos compartidos → `src/types/api-types.ts:L1–L11`

```ts
 1  import type { Response } from "express"
 2
 3  export type ApiResponse = {
 4      ok: boolean,      // ¿fue exitosa?
 5      status: number,   // código HTTP repetido dentro del cuerpo
 6      res?: any,        // datos del resultado
 7      msg?: any,        // mensaje informativo
 8      err?: any         // mapa de errores de validación
 9  }
10
11  export type ApiPromise = Response<ApiResponse>
```

Este par de tipos —`ApiResponse` en **`L3–L9`** y `ApiPromise` en **`L11`**— es el **contrato de salida** de toda la API. Cada controlador firma sus métodos con `Promise<ApiPromise>` (por ejemplo `products-controllers.ts:L25`, `users-controllers.ts:L6`), lo que obliga en compilación a devolver un `Response` con esa forma. Por eso todas las respuestas del sistema comparten la misma estructura y un cliente puede parsearlas siempre de la misma manera.

| Campo | Cuándo se usa |
|---|---|
| `ok` | `true` en éxito, `false` en error |
| `status` | Reproduce el código HTTP dentro del JSON |
| `res` | Trae los datos (listas, objetos creados, filas borradas) |
| `msg` | Trae texto explicativo o, en algunos endpoints, el objeto encontrado |
| `err` | Solo en errores de validación: `{ campo: "mensaje" }` |

---

## 6. El esquema de base de datos

Base de datos **`tilines_db`**, dos tablas InnoDB con `utf8mb4_unicode_ci`.

### Tabla `products`

```sql
CREATE TABLE `products` (
  `id`           int(11)      NOT NULL AUTO_INCREMENT,
  `title`        varchar(70)  NOT NULL,
  `category`     varchar(50)  NOT NULL,
  `description`  varchar(100) NOT NULL,
  `image`        varchar(200) NOT NULL,
  `price`        float        NOT NULL,
  `rating_rate`  int(11)      DEFAULT NULL,
  `rating_count` int(11)      DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabla `users`

```sql
CREATE TABLE `users` (
  `id`       int(11) NOT NULL AUTO_INCREMENT,
  `name`     varchar(50) NOT NULL,
  `role`     enum('ADMIN','AUDITOR','CLIENT') NOT NULL DEFAULT 'CLIENT',
  `user`     varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### El papel de `RETURNING *`

El proyecto usa la cláusula `RETURNING *` en las tres operaciones de escritura:

```sql
INSERT INTO products (...) VALUES (...) RETURNING *
UPDATE products SET ... WHERE id = ? RETURNING *
DELETE FROM products WHERE id = ? RETURNING *
```

Esto permite que **una única consulta** ejecute la escritura **y** devuelva la fila afectada. Por eso los endpoints de crear, actualizar y eliminar pueden responder con el objeto completo sin hacer un `SELECT` adicional. Es una característica de **MariaDB** (desde la versión 10.5).

**Dónde están esas sentencias en el código:**

| Sentencia | Ubicación |
|---|---|
| `INSERT ... RETURNING *` (productos) | `src/models/products-model.ts:L53–L55` |
| `UPDATE ... RETURNING *` | `src/models/products-model.ts:L74` |
| `DELETE ... RETURNING *` | `src/models/products-model.ts:L108` |
| `INSERT ... RETURNING *` (usuarios) | `src/models/users-model.ts:L22` |

### El aplanamiento de `rating`

La interfaz TypeScript agrupa la valoración en un objeto (`products-model.ts:L4–L15`):

```ts
 4  export interface ProductEntity {
 5      id?: number,
 6      title: string,
 7      price: number,
 8      description: string,
 9      category: string,
10      image: string,
11      rating: {
12          rate: number,      // ↔ columna rating_rate
13          count: number      // ↔ columna rating_count
14      }
15  }
```

Pero en la base de datos son **dos columnas planas** (`rating_rate`, `rating_count`). Esa traducción "plano ↔ anidado" es responsabilidad de la capa de modelos (al leer) y del controlador (al escribir). Es el detalle que explica por qué cada método del modelo incluye líneas de mapeo manual.

---

## 7. Capa de modelos en detalle

### `ProductsModel` — 6 métodos (`src/models/products-model.ts`, clase en `L17–L128`)

| Método | Líneas | SQL | Devuelve |
|---|---|---|---|
| `get()` | L18–L21 | `SELECT * FROM products` | `ProductEntity[]` (sin mapear: conserva las columnas planas) |
| `getById(id)` | L23–L43 | `SELECT * FROM products WHERE id = ?` | Objeto con `rating` anidado, o `undefined` si no existe |
| `getCategories()` | L45–L48 | `SELECT DISTINCT category FROM products` | Array de strings de categorías |
| `create(data)` | L50–L69 | `INSERT ... RETURNING *` | El producto recién creado |
| `update(data, id)` | L71–L105 | `UPDATE ... WHERE id = ? RETURNING *` | El producto actualizado; si no hay fila, hace un `SELECT` de apoyo (`L82–L87`) para distinguir "no existe" |
| `delete(id)` | L107–L127 | `DELETE ... WHERE id = ? RETURNING *` | El producto eliminado, o `undefined` |

`getById`, `update` y `delete` devuelven `undefined` cuando la fila no existe (`L27–L29`, `L89–L91`, `L111–L113`); el controlador interpreta ese `undefined` como un **404**.

### `UserModel` — 2 métodos (`src/models/users-model.ts`)

| Método | Líneas | SQL |
|---|---|---|
| `get()` | L13–L16 | `SELECT * FROM users` |
| `create(userData)` | L18–L27 | `INSERT INTO users (user, name, role, password) VALUES (?,?,?,?) RETURNING *` (L21–L24) |

La interfaz `UserModel` (`users-model.ts:L4–L10`) limita el rol a una unión de tipos: `"ADMIN" | "AUDITOR" | "CLIENT"` (**`L8`**), lo que hace imposible compilar con un rol fuera de ese conjunto (y coincide con el `ENUM` de la base de datos y con la validación del middleware `users-middlewares.ts:L14–L17`).

---

## 8. Capa de controladores en detalle

### `ProductsControllers` (`src/controllers/products-controllers.ts`, clase en `L5–L158`, instancia única en `L160`)

| Handler | Líneas | Flujo |
|---|---|---|
| `getProducts` | L6–L23 | `ProductsModel.get()` → `200` con `res: lista` |
| `addProduct` | L25–L46 | Lee `req.body`, reconstruye `rating` → `create()` → `200` con el objeto |
| `updateProduct` | L48–L78 | Lee `id` del **body** → `update()` → `200`, o `404` (`L56–L62`) si no existía |
| `deleteProduct` | L80–L108 | Lee `req.params.id` → `delete()` → `200` con mensaje + fila borrada, o `404` (`L85–L91`) |
| `findProduct` | L110–L137 | Lee `req.params.id` → `getById()` → `200` (`L123–L127`) o `404` (`L115–L121`) |
| `getCategories` | L139–L157 | `ProductsModel.getCategories()` → `200` con `res: array de strings` |

Todos comparten la misma estructura: `try` para el camino feliz, `catch` que registra el error en consola y responde `500` con un mensaje genérico en español.

### `UsersController` (`src/controllers/users-controllers.ts`, clase en `L5–L45`, instancia única en `L47`)

| Handler | Líneas | Flujo |
|---|---|---|
| `getUsers` | L6–L23 | `UserModel.get()` → `200` con `res: lista` (L9–L13); `catch` → `500` (L15–L22) |
| `addUser` | L25–L44 | Extrae `name, role, user, password` del body (L27) → `UserModel.create()` (L28) → `201` con el usuario creado (L30–L34); `catch` → `500` (L36–L43) |

---

## 9. Tabla completa de endpoints

### Productos — base `http://localhost:3000/products`

| Método | Ruta | Definida en | Middlewares (definición) | Controlador (definición) | Éxito |
|---|---|---|---|---|---|
| `GET` | `/products` | `products-routes.ts:L7` | — | `getProducts` (products-controllers L6) | 200 |
| `GET` | `/products/categories` | `products-routes.ts:L8` | — | `getCategories` (L139) | 200 |
| `GET` | `/products/:id` | `products-routes.ts:L9` | `deleteProductValidator` (products-middlewares L78–L84) | `findProduct` (L110) | 200 / 404 |
| `POST` | `/products` | `products-routes.ts:L10` | `createProductValidator` (products-middlewares L4–L38) | `addProduct` (L25) | 200 / 400 |
| `PUT` | `/products` | `products-routes.ts:L11` | `updateProductValidator` (products-middlewares L40–L76) | `updateProduct` (L48) | 200 / 400 / 404 |
| `DELETE` | `/products/:id` | `products-routes.ts:L12` | `deleteProductValidator` (products-middlewares L78–L84) | `deleteProduct` (L80) | 200 / 400 / 404 |

### Usuarios — base `http://localhost:3000/users`

| Método | Ruta | Definida en | Middlewares (definición) | Controlador (definición) | Éxito |
|---|---|---|---|---|---|
| `GET` | `/users` | `users-routes.ts:L7` | — | `getUsers` (users-controllers L6) | 200 |
| `POST` | `/users` | `users-routes.ts:L8` | `createUserValidator` (users-middlewares L4–L24) | `addUser` (L25) | 201 / 400 |

### Nota sobre `PUT /products`

A diferencia del resto, la actualización recibe el `id` **dentro del cuerpo JSON**, no en la URL:

```json
PUT /products
{ "id": 12, "title": "Mouse Gamer v2", "price": 55.5, ... }
```

La validación correspondiente lo exige explícitamente: `body("id").notEmpty().isInt({ min: 1 })` en `products-middlewares.ts:L41–L43`; y el controlador lo lee de `req.body` en `products-controllers.ts:L50`.

---

## 10. Contrato de respuestas con ejemplos reales

**Quién construye cada respuesta (líneas exactas):**

| Respuesta | Controlador y líneas |
|---|---|
| `200` de `GET /products` | `products-controllers.ts:L9–L13` |
| `200` de `GET /products/categories` | `products-controllers.ts:L143–L147` |
| `200`/`404` de `GET /products/:id` | `products-controllers.ts:L123–L127` / `L115–L121` |
| `200` de `POST /products` | `products-controllers.ts:L32–L36` |
| `400` de validación (cualquier endpoint) | `global-middlewares.ts:L12–L16` |
| `200`/`404` de `PUT /products` | `products-controllers.ts:L64–L68` / `L57–L62` |
| `200` de `DELETE /products/:id` | `products-controllers.ts:L93–L98` |
| `500` genérico | `catch` de cada handler: products L38–L45, L70–L77, L100–L107, L129–L136, L149–L156, L15–L22; users L36–L43, L15–L22 |
| `200` de `GET /users` | `users-controllers.ts:L9–L13` |
| `201` de `POST /users` | `users-controllers.ts:L30–L34` |

### `GET /products` — listar todos

```json
HTTP 200
{
  "ok": true,
  "status": 200,
  "res": [
    { "id": 10, "title": "Teclado Mecánico RGB", "category": "Electrónica",
      "description": "Teclado mecánico switch azul con iluminación RGB",
      "image": "https://example.com/images/teclado.jpg",
      "price": 850.5, "rating_rate": 4, "rating_count": 120 }
  ]
}
```

### `GET /products/categories`

```json
HTTP 200
{ "ok": true, "status": 200, "res": ["Electrónica", "Periféricos"] }
```

### `GET /products/:id`

```json
HTTP 200
{ "ok": true, "status": 200,
  "msg": { "id": 10, "title": "Teclado Mecánico RGB", "category": "Electrónica",
           "price": 850.5, "rating": { "rate": 4, "count": 120 } } }
```

```json
HTTP 404
{ "ok": false, "status": 404, "msg": "Producto con ID 999 no encontrado" }
```

### `POST /products` — crear

```json
Petición:
POST /products
{ "title": "Mouse Gamer", "category": "Periféricos",
  "description": "Mouse 8000 DPI", "image": "https://ex.com/m.png",
  "price": 45.9, "rating_rate": 4, "rating_count": 30 }

Respuesta HTTP 200:
{ "ok": true, "status": 200,
  "res": { "id": 12, "title": "Mouse Gamer", "category": "Periféricos",
           "price": 45.9, "rating_rate": 4, "rating_count": 30,
           "rating": { "rate": 4, "count": 30 } } }
```

### `POST /products` con datos inválidos → validación

```json
HTTP 400
{ "ok": false, "status": 400,
  "err": {
    "title": "El título es obligatorio",
    "category": "La categoría es obligatoria",
    "price": "Ingrese un precio valido mayor o igual a 0"
  } }
```

Cada campo inválido aporta su propio mensaje en español; el controlador no se ejecuta.

### `PUT /products` — actualizar

```json
HTTP 200
{ "ok": true, "status": 200,
  "res": { "id": 12, "title": "Mouse Gamer v2", "price": 55.5,
           "rating": { "rate": 5, "count": 40 } } }
```

```json
HTTP 404
{ "ok": false, "status": 404, "msg": "Producto con ID 9999 no encontrado" }
```

### `DELETE /products/:id` — eliminar

```json
HTTP 200
{ "ok": true, "status": 200, "msg": "Producto eliminado exitosamente",
  "res": { "id": 12, "title": "Mouse Gamer v2", ... } }
```

La fila borrada se devuelve gracias a `DELETE ... RETURNING *`.

### `GET /users`

```json
HTTP 200
{ "ok": true, "status": 200,
  "res": [ { "id": 1, "name": "Carlos Gómez", "role": "ADMIN",
             "user": "carlos_admin", "password": "claveSegura123" }, ... ] }
```

### `POST /users`

```json
Petición:
POST /users
{ "name": "Alan Saul", "role": "ADMIN", "user": "AlanMO", "password": "1234" }

Respuesta HTTP 201:
{ "ok": true, "status": 201,
  "res": { "id": 7, "name": "Alan Saul", "role": "ADMIN",
           "user": "AlanMO", "password": "1234" } }
```

### Resumen de códigos HTTP utilizados

| Código | Cuándo lo emite la API |
|---|---|
| `200` | Cualquier operación exitosa (incluye crear y eliminar) |
| `201` | Creación de usuario (`POST /users`) |
| `400` | Validación fallida — cuerpo `err` con mapa campo → mensaje |
| `404` | Recurso no encontrado por `id` |
| `500` | Excepción no controlada — mensaje genérico en `msg` |

---

## 11. Las validaciones, en una sola vista

### Productos

| Campo | Regla en `POST` (`createProductValidator`, L4–L38) | Regla en `PUT` (`updateProductValidator`, L40–L76) |
|---|---|---|
| `id` | — | obligatorio, entero ≥ 1 → **L41–L43** |
| `title` | obligatorio, string, 2–70 → **L5–L8** | opcional, string, 2–70 → **L45–L48** |
| `category` | obligatorio, string, 2–50 → **L10–L13** | opcional, string, 2–50 → **L50–L53** |
| `description` | obligatorio, string, 2–100 → **L15–L18** | opcional, string, 2–100 → **L55–L58** |
| `image` | obligatorio, string, 5–200 → **L20–L23** | opcional, string, 5–200 → **L60–L63** |
| `price` | obligatorio, decimal ≥ 0 → **L25–L27** | opcional, decimal ≥ 0 → **L65–L67** |
| `rating_rate` | opcional, entero 0–5 → **L29–L31** | obligatorio, entero 0–5 → **L69–L70** |
| `rating_count` | opcional, entero ≥ 0 → **L33–L35** | obligatorio, entero ≥ 0 → **L72–L73** |
| cierre de cadena | `validateFields` → **L37** | `validateFields` → **L75** |
| `id` en URL (`:id`) | `deleteProductValidator` → **L78–L84** (regla en L79–L81, cierre L83) — se usa en `GET /:id` y `DELETE /:id` | |

*(Todas las líneas son de `src/middlewares/products-middlewares.ts`.)*

### Usuarios (`createUserValidator` en `src/middlewares/users-middlewares.ts:L4–L24`)

| Campo | Regla | Líneas |
|---|---|---|
| `user` | obligatorio, 2–30 caracteres | L5–L7 |
| `name` | obligatorio, string, 2–50 caracteres | L9–L12 |
| `role` | obligatorio, string, debe ser `ADMIN`, `AUDITOR` o `CLIENT` | L14–L17 |
| `password` | obligatorio, 2–50 caracteres | L19–L21 |
| cierre de cadena | `validateFields` | L23 |

La triple capa de seguridad del rol (middleware `isIn(...)` → `users-middlewares.ts:L17` → tipo `"ADMIN" | "AUDITOR" | "CLIENT"` en `users-model.ts:L8` → `ENUM` en la BD) garantiza que solo esos tres valores puedan existir en cualquier nivel del sistema.

---

## 12. Configuración del proyecto

### `package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "commonjs",
  "dependencies": {
    "express": "^5.2.1",
    "express-validator": "^7.3.2",
    "mysql2": "^3.24.5"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^26.6.4",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2"
  }
}
```

* **`dependencies`**: lo necesario en producción (servidor, validación, driver de BD).
* **`devDependencies`**: tipos para el editor y las herramientas de desarrollo (`tsx` para ejecutar, `typescript` para comprobar tipos).

### `tsconfig.json` — las opciones que afectan al código

```jsonc
10    "module": "esnext",
11    "target": "es2025",
19    "sourceMap": true,                 // depuración con breakpoints sobre .ts
24    "noUncheckedIndexedAccess": true,  // arr[i] puede ser undefined
36    "strict": true,                    // comprobación de tipos exigente
38    "verbatimModuleSyntax": true,      // exige `import type` para tipos
39    "isolatedModules": true,
40    "noUncheckedSideEffectImports": true
```
*(Líneas reales de `tsconfig.json`; el archivo completo ocupa L1–L44.)*

`strict: true` (**`tsconfig.json:L36`**) + `noUncheckedIndexedAccess` (**`L24`**) explican por qué en el código aparecen comprobaciones como `if (!row) return undefined` antes de usar un elemento de un array (`products-model.ts:L27`, `L81`, `L111`): el compilador obliga a considerar que la fila puede no existir. `verbatimModuleSyntax` (**`L38`**) explica los `import type { Request }` de los controladores (`products-controllers.ts:L1`).

---

## 13. Cómo se ejecuta

**Requisitos:** Node.js, y una instancia MariaDB/MySQL corriendo en `127.0.0.1` con la base `tilines_db` y las tablas `products` y `users`.

```bash
cd ~/Projects/Backend
npm install          # instala dependencias (solo la primera vez)
npx tsx index.ts     # arranca el servidor en el puerto 3000
```

Salida esperada:

```
El servidor esta corriendo en puerto 3000
```

Para verificar:

```bash
curl http://localhost:3000/products
curl http://localhost:3000/users
```

Se puede añadir un script de arranque en `package.json`:

```json
"scripts": {
  "dev": "tsx index.ts"
}
```

```bash
npm run dev
```

---

## 14. Diagrama de secuencia de `POST /products`

```
Cliente                Express            Middleware           Controller            Model               Pool / MariaDB
  │                       │                    │                    │                   │                       │
  │ POST /products (JSON) │                    │                    │                   │                       │
  │──────────────────────▶│                    │                    │                   │                       │
  │                       │ express.json()     │                    │                   │                       │
  │                       │  parsea body       │                    │                   │                       │
  │                       │───────────────────▶│ createProductValidator                 │                       │
  │                       │                    │  valida campos     │                   │                       │
  │                       │                    │  validationResult()│                   │                       │
  │                       │                    │  ¿errores? ──sí──▶ 400 + err (FIN)      │                       │
  │                       │                    │  no → next()       │                   │                       │
  │                       │                    │───────────────────▶│ addProduct()       │                       │
  │                       │                    │                    │  arma rating{}     │                       │
  │                       │                    │                    │──────────────────▶│ create()              │
  │                       │                    │                    │                   │ INSERT ... RETURNING * │
  │                       │                    │                    │                   │──────────────────────▶│
  │                       │                    │                    │                   │◀── fila creada ───────│
  │                       │                    │                    │◀── ProductEntity ─│                       │
  │                       │◀── 200 {ok,res} ───│────────────────────│                   │                       │
  │◀── JSON de respuesta ─│                    │                    │                   │                       │
```

---

## 15. Ideas clave para exponer

1. **Arquitectura en capas**: `routes → middlewares → controllers → models → pool`. Cada capa tiene una única responsabilidad y solo se comunica con la de abajo.
2. **Separación entre HTTP y datos**: los controladores deciden códigos de estado; los modelos escriben SQL. Ninguno de los dos hace el trabajo del otro.
3. **Validación antes de todo**: `express-validator` acumula reglas y `validateFields()` actúa como interruptor: si hay errores responde `400` y el resto de la cadena no se ejecuta, por lo que la base de datos queda protegida de datos inválidos.
4. **SQL parametrizado (`?`)** en todas las consultas: los valores nunca se interpolan en el string SQL.
5. **Connection pool + `finally { release() }`**: las conexiones se reutilizan y siempre se devuelven al pool, incluso cuando la consulta lanza una excepción.
6. **`RETURNING *`**: una sola consulta escribe *y* devuelve la fila, evitando un segundo `SELECT` en crear/actualizar/eliminar.
7. **Traducción plano ↔ anidado**: la BD guarda `rating_rate`/`rating_count`; la API/modelo trabaja con `rating: { rate, count }`. El mapeo ocurre en el modelo al leer y en el controlador al escribir.
8. **Contrato de respuesta único**: todas las respuestas usan el sobre `{ ok, status, res | msg | err }` definido por el tipo `ApiResponse`, lo que hace predecible el consumo desde cualquier cliente.
9. **Manejo de errores centralizado**: `try/catch` en cada controlador → `500` con mensaje genérico al cliente y detalle real solo en el log del servidor.
10. **Tipos como documentación**: uniones de tipos para `role`, interfaces `UserEntity`/`ProductEntity` y las reglas de validación reflejan el mismo modelo de datos en tres lugares distintos a la vez (TypeScript, validación y esquema SQL).

---

## 16. Índice de líneas — "¿dónde está esto?" (consulta rápida durante la exposición)

| Quiero mostrar... | Archivo | Línea(s) |
|---|---|---|
| El `import` de Express y los routers | `index.ts` | L1–L3 |
| La creación de la app | `index.ts` | L5 |
| El body-parser JSON | `index.ts` | L7 |
| Los archivos estáticos | `index.ts` | L8 |
| El montaje de `/users` y `/products` | `index.ts` | L10–L11 |
| El puerto 3000 | `index.ts` | L13–L15 |
| El tipo de sobre de respuesta | `src/types/api-types.ts` | L3–L9 |
| El tipo de retorno de los handlers | `src/types/api-types.ts` | L11 |
| **Rutas de productos** (los 6 endpoints) | `src/routes/products-routes.ts` | L7–L12 |
| **Rutas de usuarios** (los 2 endpoints) | `src/routes/users-routes.ts` | L7–L8 |
| El validador global `validateFields` | `src/middlewares/global-middlewares.ts` | L5–L20 |
| Respuesta `400` de validación | `src/middlewares/global-middlewares.ts` | L12–L16 |
| El `next()` que deja pasar la petición | `src/middlewares/global-middlewares.ts` | L19 |
| Validador de creación de producto | `src/middlewares/products-middlewares.ts` | L4–L38 |
| Validador de actualización de producto | `src/middlewares/products-middlewares.ts` | L40–L76 |
| Validador de borrado/búsqueda por `:id` | `src/middlewares/products-middlewares.ts` | L78–L84 |
| Validación del campo `price` | `src/middlewares/products-middlewares.ts` | L25–L27 |
| Validación del rol (ADMIN/AUDITOR/CLIENT) | `src/middlewares/users-middlewares.ts` | L14–L17 |
| Handler `GET /products` | `src/controllers/products-controllers.ts` | L6–L23 |
| Handler `POST /products` | `src/controllers/products-controllers.ts` | L25–L46 |
| Handler `PUT /products` | `src/controllers/products-controllers.ts` | L48–L78 |
| Handler `DELETE /products/:id` | `src/controllers/products-controllers.ts` | L80–L108 |
| Handler `GET /products/:id` | `src/controllers/products-controllers.ts` | L110–L137 |
| Handler `GET /products/categories` | `src/controllers/products-controllers.ts` | L139–L157 |
| Handler `GET /users` | `src/controllers/users-controllers.ts` | L6–L23 |
| Handler `POST /users` (respuesta 201) | `src/controllers/users-controllers.ts` | L25–L44 (201 en L30) |
| El `catch` que devuelve 500 (ejemplo) | `src/controllers/products-controllers.ts` | L38–L45 |
| Configuración de la conexión a la BD | `src/controllers/api-controllers.ts` | L7–L14 |
| El helper `get()` (SELECT) | `src/controllers/api-controllers.ts` | L21–L38 |
| El helper `execute()` (escrituras) | `src/controllers/api-controllers.ts` | L40–L55 |
| La liberación de conexión (`release`) | `src/controllers/api-controllers.ts` | L33–L37 y L50–L54 |
| El singleton del pool | `src/controllers/api-controllers.ts` | L58 |
| La entidad `ProductEntity` | `src/models/products-model.ts` | L4–L15 |
| `SELECT` de todos los productos | `src/models/products-model.ts` | L18–L21 |
| `SELECT` por id con mapeo `rating` | `src/models/products-model.ts` | L23–L43 |
| `SELECT DISTINCT` de categorías | `src/models/products-model.ts` | L45–L48 |
| `INSERT ... RETURNING *` de productos | `src/models/products-model.ts` | L52–L57 |
| `UPDATE ... RETURNING *` | `src/models/products-model.ts` | L73–L76 |
| `DELETE ... RETURNING *` | `src/models/products-model.ts` | L108 |
| La entidad `UserEntity` (unión de roles) | `src/models/users-model.ts` | L4–L10 |
| `SELECT` de usuarios | `src/models/users-model.ts` | L13–L16 |
| `INSERT` de usuarios | `src/models/users-model.ts` | L21–L24 |
| Dependencias del proyecto | `package.json` | L11–L22 |
| Opción `strict` de TypeScript | `tsconfig.json` | L36 |

---

## 17. Guion rápido de la exposición (5 minutos)

1. **Presentar el proyecto** (§1): API REST en TypeScript/Express que gestiona productos y usuarios en MariaDB.
2. **Mostrar la estructura de carpetas** (§2) y decir que cada carpeta es una capa.
3. **Dibujar/recorrer el diagrama de capas** (§3) y explicar que cada capa solo habla con la de abajo.
4. **Seguir una petición real paso a paso** (§4): `index.ts:L7` → `products-routes.ts:L10` → `products-middlewares.ts:L4` → `global-middlewares.ts:L19` → `products-controllers.ts:L25` → `products-model.ts:L50` → `api-controllers.ts:L21`.
5. **Abrir el código en el editor** saltando con el índice del §16.
6. **Enseñar los endpoints y sus respuestas** (§9 y §10) con una petición en vivo (`curl` o Bruno).
7. **Cerrar con las ideas clave** (§15).
