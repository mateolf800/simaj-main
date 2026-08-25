import { createCrudController } from "../../core/crud/createCrudController";
import { empresaService } from "./empresa.service";

export const empresaController = createCrudController(empresaService);
