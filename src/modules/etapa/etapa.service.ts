import { prisma } from "../../lib/prisma";
import { createCrudService } from "../../core/crud/createCrudService";
import type {
  CreateEtapaInput,
  EtapaQueryInput,
  EtapaSaveInput,
} from "./etapa.schema";

export const etapaService = createCrudService<
  Awaited<ReturnType<typeof prisma.etapa.create>>,
  CreateEtapaInput,
  EtapaSaveInput,
  EtapaQueryInput
>(prisma.etapa, {
  entityName: "Etapa",
  buildWhere: (query) =>
    query.nombre
      ? { nombre: { contains: query.nombre, mode: "insensitive" } }
      : {},
});
