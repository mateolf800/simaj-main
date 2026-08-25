import { createCrudController } from "../../core/crud/createCrudController";
import { proyectoService } from "./proyecto.service";

export const proyectoController = createCrudController(proyectoService);
