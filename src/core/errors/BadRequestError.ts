import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message = "Solicitud inválida") {
    super(400, message);
  }
}
