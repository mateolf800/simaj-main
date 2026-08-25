import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message = "Ya existe un registro con ese valor") {
    super(409, message);
  }
}
