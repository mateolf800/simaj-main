import { Router } from "express";
import { proyectoController } from "./proyecto.controller";
import { validate } from "../../middlewares/validate";
import {
  createProyectoSchema,
  replaceProyectoSchema,
  updateProyectoSchema,
  proyectoQuerySchema,
} from "./proyecto.schema";
import { idParamSchema } from "../../core/schemas/idParam.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/proyectos:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     description: >
 *       mineralIds requiere al menos un mineral y crea también las
 *       asociaciones en proyecto_minerales en la misma operación.
 *     tags: [Proyecto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProyecto'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente, junto con sus proyectoMinerales
 *       400:
 *         description: >
 *           Error de validación, o empresaId/departamentoId/algún mineralId
 *           inexistentes
 */
router.post("/", validate(createProyectoSchema), proyectoController.crear);

/**
 * @openapi
 * /api/v1/proyectos:
 *   get:
 *     summary: Listar proyectos (paginado)
 *     tags: [Proyecto]
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
 *         name: empresaId
 *         description: Filtra por empresa
 *         schema: { type: integer }
 *       - in: query
 *         name: departamentoId
 *         description: Filtra por departamento
 *         schema: { type: integer }
 *       - in: query
 *         name: activo
 *         description: Por defecto solo se listan los proyectos activos
 *         schema: { type: boolean, default: true }
 *     responses:
 *       200:
 *         description: Página de proyectos junto con metadatos de paginación
 */
router.get(
  "/",
  validate(proyectoQuerySchema, "query"),
  proyectoController.listar,
);

/**
 * @openapi
 * /api/v1/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Proyecto no encontrado
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  proyectoController.obtenerPorId,
);

/**
 * @openapi
 * /api/v1/proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Proyecto]
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
 *             $ref: '#/components/schemas/ReplaceProyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       400:
 *         description: Error de validación, o empresaId/departamentoId inexistentes
 *       404:
 *         description: Proyecto no encontrado
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(replaceProyectoSchema),
  proyectoController.reemplazar,
);

/**
 * @openapi
 * /api/v1/proyectos/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un proyecto
 *     description: Requiere al menos un campo en el body.
 *     tags: [Proyecto]
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
 *             $ref: '#/components/schemas/UpdateProyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       400:
 *         description: Error de validación, o empresaId/departamentoId inexistentes
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProyectoSchema),
  proyectoController.actualizar,
);

/**
 * @openapi
 * /api/v1/proyectos/{id}:
 *   delete:
 *     summary: Dar de baja un proyecto (baja lógica)
 *     description: >
 *       No elimina el registro físicamente, marca el proyecto como inactivo.
 *       Para reactivarlo, enviar un PATCH con activo en true.
 *     tags: [Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto dado de baja
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Proyecto no encontrado
 *       409:
 *         description: El proyecto ya estaba dado de baja
 */
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  proyectoController.eliminar,
);

export default router;
