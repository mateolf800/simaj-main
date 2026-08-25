import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url({
    message: "DATABASE_URL debe ser una URL de conexión válida",
  }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variables de entorno inválidas:");
  console.error(z.flattenError(result.error).fieldErrors);
  process.exit(1);
}

export const env = result.data;
