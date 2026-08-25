import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createDepartamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean().optional().default(true),
});

export const replaceDepartamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean(),
});

export const updateDepartamentoSchema = replaceDepartamentoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const departamentoQuerySchema = paginationSchema.extend({
  sort: z.enum(["nombre", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  nombre: z.string().min(1).optional(),
  // z.coerce.boolean() no sirve para query strings: Boolean("false") es true.
  activo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateDepartamentoInput = z.infer<typeof createDepartamentoSchema>;
export type ReplaceDepartamentoInput = z.infer<
  typeof replaceDepartamentoSchema
>;
export type UpdateDepartamentoInput = z.infer<typeof updateDepartamentoSchema>;
export type DepartamentoQueryInput = z.infer<typeof departamentoQuerySchema>;
export type DepartamentoSaveInput = Partial<ReplaceDepartamentoInput>;
