import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createProyectoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(200),
  empresaId: z.number().int().positive("empresaId debe ser un entero positivo"),
  departamentoId: z
    .number()
    .int()
    .positive("departamentoId debe ser un entero positivo"),
  superficieTotalPedimento: z.number().positive("Debe ser un número positivo"),
  areaUtilizada: z.number().positive("Debe ser un número positivo"),
  poligonoPedimento: z.string().min(1, "El polígono es obligatorio"),
  activo: z.boolean().optional().default(true),
  mineralIds: z
    .array(
      z.number().int().positive("cada mineralId debe ser un entero positivo"),
    )
    .min(1, "Debe seleccionar al menos un mineral")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "No se puede repetir el mismo mineralId",
    }),
});

export const replaceProyectoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(200),
  empresaId: z.number().int().positive(),
  departamentoId: z.number().int().positive(),
  superficieTotalPedimento: z.number().positive(),
  areaUtilizada: z.number().positive(),
  poligonoPedimento: z.string().min(1),
  activo: z.boolean(),
});

export const updateProyectoSchema = replaceProyectoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const proyectoQuerySchema = paginationSchema.extend({
  sort: z.enum(["nombre", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  nombre: z.string().min(1).optional(),
  empresaId: z.coerce.number().int().positive().optional(),
  departamentoId: z.coerce.number().int().positive().optional(),
  // z.coerce.boolean() no sirve para query strings: Boolean("false") es true.
  activo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateProyectoInput = z.infer<typeof createProyectoSchema>;
export type ReplaceProyectoInput = z.infer<typeof replaceProyectoSchema>;
export type UpdateProyectoInput = z.infer<typeof updateProyectoSchema>;
export type ProyectoQueryInput = z.infer<typeof proyectoQuerySchema>;
export type ProyectoSaveInput = Partial<ReplaceProyectoInput>;
