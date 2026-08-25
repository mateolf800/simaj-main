import { Router } from "express";
import empresaRoutes from "../modules/empresa/empresa.routes";
import mineralRoutes from "../modules/mineral/mineral.routes";
import departamentoRoutes from "../modules/departamento/departamento.routes";
import etapaRoutes from "../modules/etapa/etapa.routes";
import proyectoRoutes from "../modules/proyecto/proyecto.routes";
import proyectoMineralRoutes from "../modules/proyectoMineral/proyectoMineral.routes";

const router = Router();

router.use("/empresas", empresaRoutes);
router.use("/minerales", mineralRoutes);
router.use("/departamentos", departamentoRoutes);
router.use("/etapas", etapaRoutes);
router.use("/proyectos", proyectoRoutes);
router.use("/proyecto-minerales", proyectoMineralRoutes);

export default router;
