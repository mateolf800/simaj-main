import { catchAsync } from "../catchAsync";

interface CrudService<T, CreateInput, SaveInput, Query> {
  crear(data: CreateInput): Promise<T>;
  listar(query: Query): Promise<unknown>;
  obtenerPorId(id: number): Promise<T>;
  reemplazar(id: number, data: SaveInput): Promise<T>;
  actualizar(id: number, data: SaveInput): Promise<T>;
  eliminar(id: number): Promise<T>;
}

/**
 * Fábrica de handlers Express estándar (crear, listar, obtener, reemplazar,
 * actualizar, eliminar) sobre un servicio creado con `createCrudService`.
 */
export function createCrudController<T, CreateInput, SaveInput, Query>(
  service: CrudService<T, CreateInput, SaveInput, Query>,
) {
  return {
    crear: catchAsync(async (req, res) => {
      const registro = await service.crear(req.body as CreateInput);
      res.status(201).json(registro);
    }),

    listar: catchAsync(async (req, res) => {
      const resultado = await service.listar(req.query as unknown as Query);
      res.json(resultado);
    }),

    obtenerPorId: catchAsync(async (req, res) => {
      const registro = await service.obtenerPorId(Number(req.params.id));
      res.json(registro);
    }),

    reemplazar: catchAsync(async (req, res) => {
      const registro = await service.reemplazar(
        Number(req.params.id),
        req.body as SaveInput,
      );
      res.json(registro);
    }),

    actualizar: catchAsync(async (req, res) => {
      const registro = await service.actualizar(
        Number(req.params.id),
        req.body as SaveInput,
      );
      res.json(registro);
    }),

    eliminar: catchAsync(async (req, res) => {
      const registro = await service.eliminar(Number(req.params.id));
      res.json(registro);
    }),
  };
}
