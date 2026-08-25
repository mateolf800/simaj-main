import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createEmpresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean().optional().default(true),
});

export const replaceEmpresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean(),
});

export const updateEmpresaSchema = replaceEmpresaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const empresaQuerySchema = paginationSchema.extend({
  sort: z.enum(["nombre", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  nombre: z.string().min(1).optional(),
  // z.coerce.boolean() no sirve para query strings: Boolean("false") es true.
  activo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>;
export type ReplaceEmpresaInput = z.infer<typeof replaceEmpresaSchema>;
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>;
export type EmpresaQueryInput = z.infer<typeof empresaQuerySchema>;
export type EmpresaSaveInput = Partial<ReplaceEmpresaInput>;
