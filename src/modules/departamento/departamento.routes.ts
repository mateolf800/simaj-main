import { Router } from "express";
import { departamentoController } from "./departamento.controller";
import { validate } from "../../middlewares/validate";
import {
  createDepartamentoSchema,
  replaceDepartamentoSchema,
  updateDepartamentoSchema,
  departamentoQuerySchema,
} from "./departamento.schema";
import { idParamSchema } from "../../core/schemas/idParam.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/departamentos:
 *   post:
 *     summary: Crear un nuevo departamento
 *     tags: [Departamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartamento'
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe un departamento con ese nombre
 */
router.post(
  "/",
  validate(createDepartamentoSchema),
  departamentoController.crear,
);

/**
 * @openapi
 * /api/v1/departamentos:
 *   get:
 *     summary: Listar departamentos (paginado)
 *     tags: [Departamento]
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
 *         description: Por defecto solo se listan los departamentos activos
 *         schema: { type: boolean, default: true }
 *     responses:
 *       200:
 *         description: Página de departamentos junto con metadatos de paginación
 */
router.get(
  "/",
  validate(departamentoQuerySchema, "query"),
  departamentoController.listar,
);

/**
 * @openapi
 * /api/v1/departamentos/{id}:
 *   get:
 *     summary: Obtener un departamento por ID
 *     tags: [Departamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento encontrado
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Departamento no encontrado
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  departamentoController.obtenerPorId,
);

/**
 * @openapi
 * /api/v1/departamentos/{id}:
 *   put:
 *     summary: Actualizar un departamento existente
 *     tags: [Departamento]
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
 *             $ref: '#/components/schemas/ReplaceDepartamento'
 *     responses:
 *       200:
 *         description: Departamento actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Departamento no encontrado
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(replaceDepartamentoSchema),
  departamentoController.reemplazar,
);

/**
 * @openapi
 * /api/v1/departamentos/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un departamento
 *     description: Requiere al menos un campo en el body.
 *     tags: [Departamento]
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
 *             $ref: '#/components/schemas/UpdateDepartamento'
 *     responses:
 *       200:
 *         description: Departamento actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Departamento no encontrado
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateDepartamentoSchema),
  departamentoController.actualizar,
);

/**
 * @openapi
 * /api/v1/departamentos/{id}:
 *   delete:
 *     summary: Dar de baja un departamento (baja lógica)
 *     description: >
 *       No elimina el registro físicamente, marca el departamento como
 *       inactivo. Para reactivarlo, enviar un PATCH con activo en true.
 *     tags: [Departamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento dado de baja
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Departamento no encontrado
 *       409:
 *         description: El departamento ya estaba dado de baja
 */
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  departamentoController.eliminar,
);

export default router;
