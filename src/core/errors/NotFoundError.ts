import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(entity = "Recurso") {
    super(404, `${entity} no encontrado`);
  }
}
