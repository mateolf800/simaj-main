import { createCrudController } from "../../core/crud/createCrudController";
import { mineralService } from "./mineral.service";

export const mineralController = createCrudController(mineralService);
