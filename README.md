# SIMAJ — Backend

API REST del backend de SIMAJ. Hoy implementa la entidad **Empresa**; el resto
de las entidades del DER se van a ir agregando como módulos nuevos siguiendo
las convenciones descriptas en este documento.

## Stack

- Node.js + [Express 5](https://expressjs.com/)
- [Prisma 7](https://www.prisma.io/) sobre PostgreSQL (driver adapter `@prisma/adapter-pg`)
- [Zod](https://zod.dev/) para validación de entrada
- Swagger / OpenAPI (`swagger-jsdoc` + `swagger-ui-express`), generado a partir de los mismos schemas de Zod
- ESLint + Prettier

## Instalación

1. Clonar el repo e instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar las variables de entorno:

   ```bash
   cp .env.example .env
   ```

   y completar `DATABASE_URL` con una base de PostgreSQL propia.

3. Generar el cliente de Prisma y aplicar las migraciones:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Levantar el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   La API queda en `http://localhost:3000/api/v1`, y la documentación
   interactiva en `http://localhost:3000/api-docs`.

## Scripts disponibles

| Script                            | Qué hace                                                         |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                     | Servidor en modo desarrollo con recarga automática (`tsx watch`) |
| `npm run build`                   | Compila TypeScript a `dist/`                                     |
| `npm start`                       | Corre el build compilado (`dist/server.js`)                      |
| `npm run prisma:generate`         | Regenera el cliente de Prisma                                    |
| `npm run prisma:migrate`          | Crea/aplica una migración en desarrollo                          |
| `npm run lint` / `lint:fix`       | Corre ESLint (con o sin autofix)                                 |
| `npm run format` / `format:check` | Aplica o verifica el formato de Prettier                         |

## Estructura de carpetas

```
src/
  app.ts                  # Express app (middlewares, montaje de rutas, error handler)
  server.ts               # Arranque del servidor HTTP
  config/                 # env, swagger
  core/
    catchAsync.ts          # wrapper para no repetir try/catch en controllers
    errors/                # AppError y subclases (NotFoundError, ConflictError, BadRequestError)
    pagination.ts           # paginationSchema + helper paginate()
    crud/                   # createCrudService / createCrudController genéricos
    schemas/                # schemas Zod compartidos (ej. idParam)
  middlewares/             # validate, errorHandler
  modules/
    empresa/                # routes + controller + service + schema (un módulo por entidad)
  routes/                  # agregador de routers de cada módulo
prisma/
  schema.prisma
  migrations/
```

## Convenciones

### Módulos

Cada entidad es una carpeta en `src/modules/<entidad>/` con cuatro archivos:
`*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.schema.ts`. El controller
y el service de un módulo CRUD estándar se arman con los helpers de
`src/core/crud` (ver [empresa.service.ts](src/modules/empresa/empresa.service.ts)
y [empresa.controller.ts](src/modules/empresa/empresa.controller.ts) como
referencia) — así cada entidad nueva solo escribe lo que la hace distinta:
sus rutas, su documentación Swagger y sus schemas Zod.

### Baja lógica

Toda entidad con soporte de borrado usa baja lógica, no `DELETE` físico:
declara `activo Boolean @default(true)` en el schema de Prisma y usa
`createCrudService`, que:

- filtra `listar()` por `activo: true` salvo que la query diga lo contrario,
- hace que "eliminar" sea `activo -> false`,
- devuelve 409 si se intenta dar de baja algo que ya está inactivo,
- no necesita un endpoint de "restaurar" aparte: alcanza con
  `PATCH { "activo": true }`.

### Paginación, filtro y orden

Todo listado usa `paginationSchema` (`src/core/pagination.ts`) como base:
`page` (default 1) y `limit` (default 20, máximo 100). Cada módulo extiende
ese schema con sus propios filtros (ver `empresaQuerySchema`) y valida la
query con `validate(schema, "query")`.

### Errores

La lógica de negocio lanza subclases de `AppError`
(`NotFoundError`, `ConflictError`, `BadRequestError`); nunca depende del
mensaje/código interno de Prisma para decidir un status HTTP — eso lo resuelve
el `errorHandler` centralizado ([src/middlewares/errorHandler.ts](src/middlewares/errorHandler.ts)),
que además traduce los códigos conocidos de Prisma (`P2002`, `P2025`, `P2003`)
como red de seguridad para los casos no cubiertos explícitamente.

### Documentación (Swagger)

El body de cada request se documenta con `$ref` a un componente generado a
partir del schema de Zod correspondiente (`z.toJSONSchema(...)` en
[src/config/swagger.ts](src/config/swagger.ts)), no a mano. La validación real
y la documentación salen siempre del mismo Zod schema.

### Relaciones en Prisma

Como referencia para cuando se agreguen las próximas entidades del DER:

- Modelo en PascalCase singular (`Proyecto`); tabla mapeada a snake_case
  plural con `@@map` (`proyectos`); columnas camelCase mapeadas a snake_case
  con `@map` (igual que ya hace `Empresa`).
- Timestamps siempre `@db.Timestamptz(6)`.
- Toda relación declara `onDelete` **explícito**, nunca el default de Prisma:
  - `Restrict` por defecto, para no borrar en cadena por accidente.
  - `Cascade` solo para datos subordinados sin valor propio fuera del padre.
  - `SetNull` solo si la FK es explícitamente opcional.
- Las columnas de foreign key llevan índice explícito.
- Tablas puente (muchos-a-muchos): nombre `<EntidadA><EntidadB>` en orden
  alfabético, `@@map` a snake_case, y PK compuesta (`@@id([...])`).

## Pendiente

- **Autenticación/autorización**: todavía no implementada. Se define en
  equipo el viernes 21/08/2026; hasta entonces ningún endpoint requiere login.
- **Tests automatizados**: todavía no hay suite de tests en el proyecto; se va
  a incorporar más adelante.
