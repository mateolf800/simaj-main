import { prisma } from "../../lib/prisma";
import { createCrudService } from "../../core/crud/createCrudService";
import type {
  CreateMineralInput,
  MineralQueryInput,
  MineralSaveInput,
} from "./mineral.schema";

export const mineralService = createCrudService<
  Awaited<ReturnType<typeof prisma.mineral.create>>,
  CreateMineralInput,
  MineralSaveInput,
  MineralQueryInput
>(prisma.mineral, {
  entityName: "Mineral",
  buildWhere: (query) =>
    query.nombre
      ? { nombre: { contains: query.nombre, mode: "insensitive" } }
      : {},
});
