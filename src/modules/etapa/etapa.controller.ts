import { createCrudController } from "../../core/crud/createCrudController";
import { etapaService } from "./etapa.service";

export const etapaController = createCrudController(etapaService);
