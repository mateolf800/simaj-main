import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: "El id debe ser un número" })
    .int()
    .positive({ message: "El id debe ser un número entero positivo" }),
});
