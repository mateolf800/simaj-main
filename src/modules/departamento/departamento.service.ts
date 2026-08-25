import { prisma } from "../../lib/prisma";
import { createCrudService } from "../../core/crud/createCrudService";
import type {
  CreateDepartamentoInput,
  DepartamentoQueryInput,
  DepartamentoSaveInput,
} from "./departamento.schema";

export const departamentoService = createCrudService<
  Awaited<ReturnType<typeof prisma.departamento.create>>,
  CreateDepartamentoInput,
  DepartamentoSaveInput,
  DepartamentoQueryInput
>(prisma.departamento, {
  entityName: "Departamento",
  buildWhere: (query) =>
    query.nombre
      ? { nombre: { contains: query.nombre, mode: "insensitive" } }
      : {},
});
