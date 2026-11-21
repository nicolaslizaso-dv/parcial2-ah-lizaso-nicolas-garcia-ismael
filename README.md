# Bodegón Don Ramón — Parcial 2 (Aplicaciones Híbridas)

Aplicación **full stack MERN** (MongoDB, Express, React, Node) para el Bodegón Don Ramón.
Continúa el parcial 1: la carta del bodegón ahora es una **API REST** separada y un **frontend en React**.

- Cualquiera puede ver la carta, buscar platos y leer reseñas.
- Los usuarios registrados (rol `cliente`) pueden escribir, editar y borrar **sus** reseñas.
- El rol `admin` administra los platos (alta, edición, baja), los usuarios (cambiar rol, borrar) y modera las reseñas (ve todas y puede borrar cualquiera, pero no editar las ajenas).

## Estructura

```
parcial2-ah-lizaso-garcia/
├── back/                    API REST (Express + MongoDB)
│   ├── main.js              arranca el servidor y registra los routers
│   ├── seed.js              carga datos de ejemplo
│   ├── api/routes/          URIs y middlewares de cada recurso
│   ├── api/controllers/     reciben el request y arman la respuesta (status + JSON)
│   ├── services/            lógica y acceso a la base de datos
│   ├── middlewares/         validateToken, validateRol, validate(schema), validateId, uploads (multer + sharp)
│   ├── schemas/             validaciones con zod
│   ├── uploads/             fotos de los platos subidas desde el panel (.webp)
│   └── data/                platos, reseñas y secciones de ejemplo
└── front/                   React + Vite
    └── src/
        ├── main.jsx         rutas (react-router) y SessionProvider
        ├── context/         sesión del usuario (Context + hooks propios)
        ├── services/        llamadas a la API (separadas de las vistas)
        ├── schemas/         validaciones del front con zod
        ├── components/      piezas reutilizables (formularios, tarjetas, filas, nav)
        └── pages/           una página por ruta (públicas, auth y admin)
```

## Requisitos

- Node.js 20.6 o superior (se usa `node --env-file` para leer el `.env`)
- MongoDB corriendo en local (`mongodb://127.0.0.1:27017`) o una URI de MongoDB Atlas

## Cómo levantarlo

### 1. Backend

```bash
cd back
npm install
# crear el archivo .env (ver .env.example o el .env entregado aparte)
npm run seed      # carga usuarios, platos y reseñas de ejemplo
npm run dev       # http://localhost:3333/api
```

`.env` del back:

```
PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=bodegon
JWT_SECRET=una-clave-secreta
```

### 2. Frontend (en otra terminal)

```bash
cd front
npm install
# crear el archivo .env.development con la URL de la API
npm run dev       # http://localhost:5173
```

`.env.development` del front:

```
VITE_API_URL=http://localhost:3333/api
```

## Usuarios de prueba (los crea el seed)

| Rol     | Email                 | Contraseña   |
|---------|-----------------------|--------------|
| admin   | admin@bodegon.com     | Admin1234    |
| cliente | cliente@bodegon.com   | Cliente1234  |
| cliente | marta@bodegon.com     | Cliente1234  |
| cliente | julian@bodegon.com    | Cliente1234  |

## Endpoints de la API

Base: `http://localhost:3333/api`. Las rutas protegidas necesitan el header `Authorization: Bearer <token>`.

### Usuarios

| Método | URI                      | Acceso   | Descripción                           |
|--------|--------------------------|----------|---------------------------------------|
| POST   | /usuarios                | público  | Registro (contraseña encriptada con bcrypt) |
| POST   | /usuarios/login          | público  | Login, devuelve el JWT                |
| GET    | /usuarios/perfil         | logueado | Datos del usuario del token           |
| GET    | /usuarios                | admin    | Lista de usuarios (sin contraseñas)   |
| PATCH  | /usuarios/:id            | admin    | Cambia el rol `{ "rol": "admin" }`    |
| DELETE | /usuarios/:id            | admin    | Borra un usuario                      |

### Platos

| Método | URI                      | Acceso   | Descripción                                   |
|--------|--------------------------|----------|-----------------------------------------------|
| GET    | /secciones               | público  | Secciones de la carta                         |
| GET    | /platos                  | público  | Filtros: `?seccion=pastas&nombre=mila&etiqueta=veggie` |
| GET    | /platos/:id              | público  | Detalle                                       |
| POST   | /platos                  | admin    | Crear (form-data con la foto en el campo `imagen`) |
| PUT    | /platos/:id              | admin    | Reemplazar (foto nueva opcional)              |
| PATCH  | /platos/:id              | admin    | Modificar algunos campos                      |
| DELETE | /platos/:id              | admin    | Borrado lógico (`eliminado: true`)            |
| GET    | /platos/:id/resenas      | público  | Reseñas de un plato                           |
| POST   | /platos/:id/resenas      | logueado | Escribir una reseña de ese plato              |

### Reseñas

| Método | URI                      | Acceso          | Descripción                          |
|--------|--------------------------|-----------------|--------------------------------------|
| GET    | /resenas                 | público         | Filtros: `?plato=<id>&usuario=<id>&limit=3` |
| GET    | /resenas/:id             | público         | Detalle                              |
| PUT    | /resenas/:id             | solo el autor   | Editar                               |
| DELETE | /resenas/:id             | autor o admin   | Borrar                               |

### Códigos de respuesta

`200` OK · `201` creado · `202` modificado/borrado · `400` datos inválidos · `401` sin token o token inválido ·
`403` sin permiso · `404` no existe · `500` error del servidor.

## Modelo de datos (MongoDB)

- **Usuarios**: `{ name, email, password (hash), rol: "cliente" | "admin", creado }`
- **Platos**: `{ nombre, descripcion, precio, etiquetas[], link, imagen (URL), seccion, eliminado? }`
- **Resenas**: `{ descripcion, puntaje (1-5), fecha, plato: { _id, nombre }, usuario: { _id, name } }`

Cada reseña guarda una copia chica del plato y del autor (lo que se muestra en pantalla), así se listan
sin tener que cruzar colecciones. Si un plato cambia de nombre, el service actualiza esas copias.

## Tecnologías

Back: express, mongodb, bcrypt, jsonwebtoken, zod, cors, multer, sharp, nodemon.
Front: react, react-router, react-hook-form, @hookform/resolvers, zod, jwt-decode, react-toastify, bootstrap, vite.

## Fotos de los platos

Desde el panel, el admin sube la foto como archivo. En el back:

1. **multer** la recibe (`upload.single("imagen")`) y la guarda con un nombre temporal en `uploads/`.
2. **sharp** controla que sea una imagen de hasta 5 MB, la achica a 800px de ancho, la convierte a `.webp` y borra la temporal.
3. En el plato se guarda la URL pública (`http://localhost:3333/uploads/<id>.webp`), que sirve `express.static("uploads")`.

Si al editar se sube otra foto, la anterior se borra del disco. Si los datos del plato no pasan la validación, la foto recién subida también se borra.

La API también acepta el plato en JSON con una URL externa en `imagen`; así carga el seed sus fotos, que son de Wikimedia Commons.
