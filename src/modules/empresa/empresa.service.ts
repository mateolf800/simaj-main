import { prisma } from "../../lib/prisma";
import { createCrudService } from "../../core/crud/createCrudService";
import type {
  CreateEmpresaInput,
  EmpresaQueryInput,
  EmpresaSaveInput,
} from "./empresa.schema";

export const empresaService = createCrudService<
  Awaited<ReturnType<typeof prisma.empresa.create>>,
  CreateEmpresaInput,
  EmpresaSaveInput,
  EmpresaQueryInput
>(prisma.empresa, {
  entityName: "Empresa",
  buildWhere: (query) =>
    query.nombre
      ? { nombre: { contains: query.nombre, mode: "insensitive" } }
      : {},
});
