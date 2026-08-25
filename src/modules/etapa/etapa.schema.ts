import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createEtapaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean().optional().default(true),
});

export const replaceEtapaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean(),
});

export const updateEtapaSchema = replaceEtapaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const etapaQuerySchema = paginationSchema.extend({
  sort: z.enum(["nombre", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  nombre: z.string().min(1).optional(),
  // z.coerce.boolean() no sirve para query strings: Boolean("false") es true.
  activo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateEtapaInput = z.infer<typeof createEtapaSchema>;
export type ReplaceEtapaInput = z.infer<typeof replaceEtapaSchema>;
export type UpdateEtapaInput = z.infer<typeof updateEtapaSchema>;
export type EtapaQueryInput = z.infer<typeof etapaQuerySchema>;
export type EtapaSaveInput = Partial<ReplaceEtapaInput>;
