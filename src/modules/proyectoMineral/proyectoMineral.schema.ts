import { z } from "zod";
import { paginationSchema } from "../../core/pagination";

export const createProyectoMineralSchema = z.object({
  proyectoId: z
    .number()
    .int()
    .positive("proyectoId debe ser un entero positivo"),
  mineralId: z.number().int().positive("mineralId debe ser un entero positivo"),
});

export const proyectoMineralQuerySchema = paginationSchema.extend({
  proyectoId: z.coerce.number().int().positive().optional(),
  mineralId: z.coerce.number().int().positive().optional(),
});

export const proyectoMineralParamsSchema = z.object({
  proyectoId: z.coerce
    .number({ error: "proyectoId debe ser un número" })
    .int()
    .positive("proyectoId debe ser un entero positivo"),
  mineralId: z.coerce
    .number({ error: "mineralId debe ser un número" })
    .int()
    .positive("mineralId debe ser un entero positivo"),
});

export type CreateProyectoMineralInput = z.infer<
  typeof createProyectoMineralSchema
>;
export type ProyectoMineralQueryInput = z.infer<
  typeof proyectoMineralQuerySchema
>;
export type ProyectoMineralParamsInput = z.infer<
  typeof proyectoMineralParamsSchema
>;
