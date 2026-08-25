import { NotFoundError, ConflictError } from "../errors";
import { paginate, type PaginationInput } from "../pagination";

export type BaseListQuery = PaginationInput & {
  sort: string;
  order: "asc" | "desc";
  activo?: boolean;
};

interface SoftDeletableEntity {
  id: number;
  activo: boolean;
}

export interface CrudDelegate<T, CreateInput, SaveInput> {
  create(args: { data: CreateInput }): Promise<T>;
  findMany(args: {
    where: Record<string, unknown>;
    orderBy: Record<string, "asc" | "desc">;
    skip: number;
    take: number;
  }): Promise<T[]>;
  count(args: { where: Record<string, unknown> }): Promise<number>;
  findUnique(args: { where: { id: number } }): Promise<T | null>;
  update(args: { where: { id: number }; data: SaveInput }): Promise<T>;
}

interface CreateCrudServiceOptions<Query extends BaseListQuery> {
  /** Nombre legible de la entidad, usado en los mensajes de error (ej. "Empresa"). */
  entityName: string;
  /** Filtros adicionales propios de la entidad (ej. búsqueda por nombre). */
  buildWhere?: (query: Query) => Record<string, unknown>;
}

/**
 * Fábrica de operaciones CRUD estándar (crear, listar paginado, obtener,
 * reemplazar, actualizar, dar de baja lógica) para entidades con `id`
 * numérico y baja lógica vía el campo `activo`.
 */
export function createCrudService<
  T extends SoftDeletableEntity,
  CreateInput,
  SaveInput,
  Query extends BaseListQuery,
>(
  delegate: CrudDelegate<T, CreateInput, SaveInput>,
  options: CreateCrudServiceOptions<Query>,
) {
  const { entityName, buildWhere } = options;

  return {
    crear: (data: CreateInput) => delegate.create({ data }),

    listar: (query: Query) => {
      const { page, limit, sort, order, activo } = query;
      const where = {
        activo: activo ?? true,
        ...(buildWhere ? buildWhere(query) : {}),
      };
      return paginate(delegate, {
        where,
        orderBy: { [sort]: order },
        page,
        limit,
      });
    },

    obtenerPorId: async (id: number): Promise<T> => {
      const registro = await delegate.findUnique({ where: { id } });
      if (!registro) throw new NotFoundError(entityName);
      return registro;
    },

    reemplazar: (id: number, data: SaveInput) =>
      delegate.update({ where: { id }, data }),

    actualizar: (id: number, data: SaveInput) =>
      delegate.update({ where: { id }, data }),

    eliminar: async (id: number): Promise<T> => {
      const registro = await delegate.findUnique({ where: { id } });
      if (!registro) throw new NotFoundError(entityName);
      if (!registro.activo) {
        throw new ConflictError(`${entityName} ya está dada de baja`);
      }
      return delegate.update({
        where: { id },
        data: { activo: false } as SaveInput,
      });
    },
  };
}
