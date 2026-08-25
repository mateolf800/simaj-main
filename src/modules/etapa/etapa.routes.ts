import { Router } from "express";
import { etapaController } from "./etapa.controller";
import { validate } from "../../middlewares/validate";
import {
  createEtapaSchema,
  replaceEtapaSchema,
  updateEtapaSchema,
  etapaQuerySchema,
} from "./etapa.schema";
import { idParamSchema } from "../../core/schemas/idParam.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/etapas:
 *   post:
 *     summary: Crear una nueva etapa
 *     tags: [Etapa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEtapa'
 *     responses:
 *       201:
 *         description: Etapa creada exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe una etapa con ese nombre
 */
router.post("/", validate(createEtapaSchema), etapaController.crear);

/**
 * @openapi
 * /api/v1/etapas:
 *   get:
 *     summary: Listar etapas (paginado)
 *     tags: [Etapa]
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
 *         description: Por defecto solo se listan las etapas activas
 *         schema: { type: boolean, default: true }
 *     responses:
 *       200:
 *         description: Página de etapas junto con metadatos de paginación
 */
router.get("/", validate(etapaQuerySchema, "query"), etapaController.listar);

/**
 * @openapi
 * /api/v1/etapas/{id}:
 *   get:
 *     summary: Obtener una etapa por ID
 *     tags: [Etapa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etapa encontrada
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Etapa no encontrada
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  etapaController.obtenerPorId,
);

/**
 * @openapi
 * /api/v1/etapas/{id}:
 *   put:
 *     summary: Actualizar una etapa existente
 *     tags: [Etapa]
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
 *             $ref: '#/components/schemas/ReplaceEtapa'
 *     responses:
 *       200:
 *         description: Etapa actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Etapa no encontrada
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(replaceEtapaSchema),
  etapaController.reemplazar,
);

/**
 * @openapi
 * /api/v1/etapas/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una etapa
 *     description: Requiere al menos un campo en el body.
 *     tags: [Etapa]
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
 *             $ref: '#/components/schemas/UpdateEtapa'
 *     responses:
 *       200:
 *         description: Etapa actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Etapa no encontrada
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateEtapaSchema),
  etapaController.actualizar,
);

/**
 * @openapi
 * /api/v1/etapas/{id}:
 *   delete:
 *     summary: Dar de baja una etapa (baja lógica)
 *     description: >
 *       No elimina el registro físicamente, marca la etapa como inactiva.
 *       Para reactivarla, enviar un PATCH con activo en true.
 *     tags: [Etapa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etapa dada de baja
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Etapa no encontrada
 *       409:
 *         description: La etapa ya estaba dada de baja
 */
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  etapaController.eliminar,
);

export default router;
