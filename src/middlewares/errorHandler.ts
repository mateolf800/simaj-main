import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../core/errors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. Errores propios de negocio (AppError y subclases: NotFoundError, ConflictError, BadRequestError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // 2. Errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025": {
        // Registro no encontrado (ej: update/delete/findUniqueOrThrow a un id inexistente)
        const modelName = (err.meta as { modelName?: string })?.modelName;
        return res.status(404).json({
          error: modelName
            ? `${modelName} no encontrado`
            : "Recurso no encontrado",
        });
      }
      case "P2002":
        // Violación de constraint unique
        return res.status(409).json({
          error: "Ya existe un registro con ese valor único.",
        });
      case "P2003":
        // Violación de foreign key
        return res
          .status(400)
          .json({ error: "Referencia inválida a otro recurso" });
    }
  }

  // 3. Todo lo demás: error no controlado -> se loguea y se devuelve 500 genérico
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
