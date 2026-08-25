import { prisma } from "../../lib/prisma";
import { createCrudService } from "../../core/crud/createCrudService";
import type {
  CreateProyectoInput,
  ProyectoQueryInput,
  ProyectoSaveInput,
} from "./proyecto.schema";

const baseService = createCrudService<
  Awaited<ReturnType<typeof prisma.proyecto.create>>,
  CreateProyectoInput,
  ProyectoSaveInput,
  ProyectoQueryInput
>(prisma.proyecto, {
  entityName: "Proyecto",
  buildWhere: (query) => ({
    ...(query.nombre
      ? { nombre: { contains: query.nombre, mode: "insensitive" } }
      : {}),
    ...(query.empresaId ? { empresaId: query.empresaId } : {}),
    ...(query.departamentoId ? { departamentoId: query.departamentoId } : {}),
  }),
});

export const proyectoService = {
  ...baseService,
  // El alta de un proyecto siempre viene con al menos un mineral asociado
  // (mineralIds), así que se crea junto con sus vínculos en la misma
  // operación en vez de requerir un POST /proyecto-minerales por separado.
  crear: ({ mineralIds, ...data }: CreateProyectoInput) =>
    prisma.proyecto.create({
      data: {
        ...data,
        proyectoMinerales: {
          create: mineralIds.map((mineralId) => ({ mineralId })),
        },
      },
      include: { proyectoMinerales: true },
    }),
};
