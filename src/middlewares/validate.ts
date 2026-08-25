import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";

type RequestSource = "body" | "params" | "query";

export const validate =
  (schema: ZodType, source: RequestSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({ errors: z.flattenError(result.error) });
    }
    if (source === "body") {
      req.body = result.data; // pisamos con el dato parseado (aplica defaults de Zod, etc.)
    } else if (source === "query") {
      // req.query es un getter en Express 5 que reparsea la URL en cada acceso
      // (ver express/lib/request.js): mutar el objeto que devuelve no persiste.
      // Hay que reemplazar la propiedad entera por el resultado ya parseado.
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      // req.params sí es una propiedad normal: alcanza con mutarla.
      Object.assign(req.params, result.data);
    }
    next();
  };
