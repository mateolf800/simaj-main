import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";
import { z } from "zod";
import {
  createEmpresaSchema,
  replaceEmpresaSchema,
  updateEmpresaSchema,
} from "../modules/empresa/empresa.schema";
import {
  createMineralSchema,
  replaceMineralSchema,
  updateMineralSchema,
} from "../modules/mineral/mineral.schema";
import {
  createDepartamentoSchema,
  replaceDepartamentoSchema,
  updateDepartamentoSchema,
} from "../modules/departamento/departamento.schema";
import {
  createEtapaSchema,
  replaceEtapaSchema,
  updateEtapaSchema,
} from "../modules/etapa/etapa.schema";
import {
  createProyectoSchema,
  replaceProyectoSchema,
  updateProyectoSchema,
} from "../modules/proyecto/proyecto.schema";
import { createProyectoMineralSchema } from "../modules/proyectoMineral/proyectoMineral.schema";

// Los schemas del body salen de los Zod schemas (fuente única de verdad
// compartida con la validación en runtime), no se duplican a mano acá.
const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Backend - SIMAJ",
      version: "1.0.0",
      description: "Documentación de la API del backend de SIMAJ",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        CreateEmpresa: z.toJSONSchema(createEmpresaSchema),
        ReplaceEmpresa: z.toJSONSchema(replaceEmpresaSchema),
        UpdateEmpresa: z.toJSONSchema(updateEmpresaSchema),
        CreateMineral: z.toJSONSchema(createMineralSchema),
        ReplaceMineral: z.toJSONSchema(replaceMineralSchema),
        UpdateMineral: z.toJSONSchema(updateMineralSchema),
        CreateDepartamento: z.toJSONSchema(createDepartamentoSchema),
        ReplaceDepartamento: z.toJSONSchema(replaceDepartamentoSchema),
        UpdateDepartamento: z.toJSONSchema(updateDepartamentoSchema),
        CreateEtapa: z.toJSONSchema(createEtapaSchema),
        ReplaceEtapa: z.toJSONSchema(replaceEtapaSchema),
        UpdateEtapa: z.toJSONSchema(updateEtapaSchema),
        CreateProyecto: z.toJSONSchema(createProyectoSchema),
        ReplaceProyecto: z.toJSONSchema(replaceProyectoSchema),
        UpdateProyecto: z.toJSONSchema(updateProyectoSchema),
        CreateProyectoMineral: z.toJSONSchema(createProyectoMineralSchema),
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
