import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createMineralSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean().optional().default(true),
});

export const replaceMineralSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  activo: z.boolean(),
});

export const updateMineralSchema = replaceMineralSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const mineralQuerySchema = paginationSchema.extend({
  sort: z.enum(["nombre", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  nombre: z.string().min(1).optional(),
  // z.coerce.boolean() no sirve para query strings: Boolean("false") es true.
  activo: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type CreateMineralInput = z.infer<typeof createMineralSchema>;
export type ReplaceMineralInput = z.infer<typeof replaceMineralSchema>;
export type UpdateMineralInput = z.infer<typeof updateMineralSchema>;
export type MineralQueryInput = z.infer<typeof mineralQuerySchema>;
export type MineralSaveInput = Partial<ReplaceMineralInput>;
