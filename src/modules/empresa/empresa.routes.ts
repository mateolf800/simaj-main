import { Router } from "express";
import { empresaController } from "./empresa.controller";
import { validate } from "../../middlewares/validate";
import {
  createEmpresaSchema,
  replaceEmpresaSchema,
  updateEmpresaSchema,
  empresaQuerySchema,
} from "./empresa.schema";
import { idParamSchema } from "../../core/schemas/idParam.schema";

const router = Router();

/**
 * @openapi
 * /api/v1/empresas:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmpresa'
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe una empresa con ese nombre
 */
router.post("/", validate(createEmpresaSchema), empresaController.crear);

/**
 * @openapi
 * /api/v1/empresas:
 *   get:
 *     summary: Listar empresas (paginado)
 *     tags: [Empresa]
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
 *         description: Por defecto solo se listan las empresas activas
 *         schema: { type: boolean, default: true }
 *     responses:
 *       200:
 *         description: Página de empresas junto con metadatos de paginación
 */
router.get(
  "/",
  validate(empresaQuerySchema, "query"),
  empresaController.listar,
);

/**
 * @openapi
 * /api/v1/empresas/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags: [Empresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Empresa no encontrada
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  empresaController.obtenerPorId,
);

/**
 * @openapi
 * /api/v1/empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa existente
 *     tags: [Empresa]
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
 *             $ref: '#/components/schemas/ReplaceEmpresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Empresa no encontrada
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(replaceEmpresaSchema),
  empresaController.reemplazar,
);

/**
 * @openapi
 * /api/v1/empresas/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una empresa
 *     description: Requiere al menos un campo en el body.
 *     tags: [Empresa]
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
 *             $ref: '#/components/schemas/UpdateEmpresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Empresa no encontrada
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateEmpresaSchema),
  empresaController.actualizar,
);

/**
 * @openapi
 * /api/v1/empresas/{id}:
 *   delete:
 *     summary: Dar de baja una empresa (baja lógica)
 *     description: >
 *       No elimina el registro físicamente, marca la empresa como inactiva.
 *       Para reactivarla, enviar un PATCH con activo en true.
 *     tags: [Empresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa dada de baja
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Empresa no encontrada
 *       409:
 *         description: La empresa ya estaba dada de baja
 */
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  empresaController.eliminar,
);

export default router;
