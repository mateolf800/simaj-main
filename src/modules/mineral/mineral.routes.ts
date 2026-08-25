import { Router } from "express";
import { mineralController } from "./mineral.controller";
import { validate } from "../../middlewares/validate";
import {
  createMineralSchema,
  replaceMineralSchema,
  updateMineralSchema,
  mineralQuerySchema,
} from "./mineral.schema";
import { idParamSchema } from "../../core/schemas/idParam.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/minerales:
 *   post:
 *     summary: Crear un nuevo mineral
 *     tags: [Mineral]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMineral'
 *     responses:
 *       201:
 *         description: Mineral creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe un mineral con ese nombre
 */
router.post("/", validate(createMineralSchema), mineralController.crear);

/**
 * @openapi
 * /api/v1/minerales:
 *   get:
 *     summary: Listar minerales (paginado)
 *     tags: [Mineral]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [nombre, createdAt], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: nombre
 *         description: Filtra por coincidencia parcial de nombre
 *         schema: { type: string }
 *       - in: query
 *         name: activo
 *         description: Por defecto solo se listan los minerales activos
 *         schema: { type: boolean, default: true }
 *     responses:
 *       200:
 *         description: Página de minerales junto con metadatos de paginación
 */
router.get(
  "/",
  validate(mineralQuerySchema, "query"),
  mineralController.listar,
);

/**
 * @openapi
 * /api/v1/minerales/{id}:
 *   get:
 *     summary: Obtener un mineral por ID
 *     tags: [Mineral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mineral encontrado
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Mineral no encontrado
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  mineralController.obtenerPorId,
);

/**
 * @openapi
 * /api/v1/minerales/{id}:
 *   put:
 *     summary: Actualizar un mineral existente
 *     tags: [Mineral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplaceMineral'
 *     responses:
 *       200:
 *         description: Mineral actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Mineral no encontrado
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(replaceMineralSchema),
  mineralController.reemplazar,
);

/**
 * @openapi
 * /api/v1/minerales/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un mineral
 *     description: Requiere al menos un campo en el body.
 *     tags: [Mineral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMineral'
 *     responses:
 *       200:
 *         description: Mineral actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Mineral no encontrado
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateMineralSchema),
  mineralController.actualizar,
);

/**
 * @openapi
 * /api/v1/minerales/{id}:
 *   delete:
 *     summary: Dar de baja un mineral (baja lógica)
 *     description: >
 *       No elimina el registro físicamente, marca el mineral como inactivo.
 *       Para reactivarlo, enviar un PATCH con activo en true.
 *     tags: [Mineral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mineral dado de baja
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Mineral no encontrado
 *       409:
 *         description: El mineral ya estaba dado de baja
 */
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  mineralController.eliminar,
);

export default router;
