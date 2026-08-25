import { Router } from "express";
import { proyectoMineralController } from "./proyectoMineral.controller";
import { validate } from "../../middlewares/validate";
import {
  createProyectoMineralSchema,
  proyectoMineralQuerySchema,
  proyectoMineralParamsSchema,
} from "./proyectoMineral.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/proyecto-minerales:
 *   post:
 *     summary: Asociar un mineral a un proyecto
 *     tags: [ProyectoMineral]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProyectoMineral'
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *       400:
 *         description: Error de validación, o proyectoId/mineralId inexistentes
 *       409:
 *         description: El mineral ya está asociado a ese proyecto
 */
router.post(
  "/",
  validate(createProyectoMineralSchema),
  proyectoMineralController.crear,
);

/**
 * @openapi
 * /api/v1/proyecto-minerales:
 *   get:
 *     summary: Listar asociaciones proyecto-mineral (paginado)
 *     tags: [ProyectoMineral]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: proyectoId
 *         description: Filtra por proyecto
 *         schema: { type: integer }
 *       - in: query
 *         name: mineralId
 *         description: Filtra por mineral
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Página de asociaciones junto con metadatos de paginación
 */
router.get(
  "/",
  validate(proyectoMineralQuerySchema, "query"),
  proyectoMineralController.listar,
);

/**
 * @openapi
 * /api/v1/proyecto-minerales/{proyectoId}/{mineralId}:
 *   delete:
 *     summary: Quitar la asociación entre un proyecto y un mineral
 *     description: >
 *       Elimina el vínculo físicamente: a diferencia de las entidades del
 *       DER, esta tabla puente no tiene baja lógica, solo representa si la
 *       asociación existe o no.
 *     tags: [ProyectoMineral]
 *     parameters:
 *       - in: path
 *         name: proyectoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: mineralId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asociación eliminada
 *       400:
 *         description: proyectoId o mineralId inválidos
 *       404:
 *         description: La asociación no existe
 */
router.delete(
  "/:proyectoId/:mineralId",
  validate(proyectoMineralParamsSchema, "params"),
  proyectoMineralController.eliminar,
);

export default router;
