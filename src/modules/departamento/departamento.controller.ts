import { createCrudController } from "../../core/crud/createCrudController";
import { departamentoService } from "./departamento.service";

export const departamentoController = createCrudController(departamentoService);
