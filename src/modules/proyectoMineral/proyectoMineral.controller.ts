import { catchAsync } from "../../core/catchAsync";
import { proyectoMineralService } from "./proyectoMineral.service";
import type {
  ProyectoMineralParamsInput,
  ProyectoMineralQueryInput,
} from "./proyectoMineral.schema";

export const proyectoMineralController = {
  crear: catchAsync(async (req, res) => {
    const registro = await proyectoMineralService.crear(req.body);
    res.status(201).json(registro);
  }),

  listar: catchAsync(async (req, res) => {
    const resultado = await proyectoMineralService.listar(
      req.query as unknown as ProyectoMineralQueryInput,
    );
    res.json(resultado);
  }),

  eliminar: catchAsync(async (req, res) => {
    const { proyectoId, mineralId } =
      req.params as unknown as ProyectoMineralParamsInput;
    const registro = await proyectoMineralService.eliminar(
      proyectoId,
      mineralId,
    );
    res.json(registro);
  }),
};
