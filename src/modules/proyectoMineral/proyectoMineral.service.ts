import { prisma } from "../../lib/prisma";
import { paginate } from "../../core/pagination";
import { NotFoundError } from "../../core/errors";
import type {
  CreateProyectoMineralInput,
  ProyectoMineralQueryInput,
} from "./proyectoMineral.schema";

export const proyectoMineralService = {
  crear: (data: CreateProyectoMineralInput) =>
    prisma.proyectoMineral.create({ data }),

  listar: (query: ProyectoMineralQueryInput) => {
    const { page, limit, proyectoId, mineralId } = query;
    const where = {
      ...(proyectoId ? { proyectoId } : {}),
      ...(mineralId ? { mineralId } : {}),
    };
    return paginate(prisma.proyectoMineral, {
      where,
      orderBy: { proyectoId: "asc" as const },
      page,
      limit,
    });
  },

  eliminar: async (proyectoId: number, mineralId: number) => {
    const registro = await prisma.proyectoMineral.findUnique({
      where: { proyectoId_mineralId: { proyectoId, mineralId } },
    });
    if (!registro) throw new NotFoundError("Vínculo proyecto-mineral");
    return prisma.proyectoMineral.delete({
      where: { proyectoId_mineralId: { proyectoId, mineralId } },
    });
  },
};
