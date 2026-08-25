-- CreateTable
CREATE TABLE "proyectos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "superficie_total_pedimento" DOUBLE PRECISION NOT NULL,
    "area_utilizada" DOUBLE PRECISION NOT NULL,
    "poligono_pedimento" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proyectos_activo_idx" ON "proyectos"("activo");

-- CreateIndex
CREATE INDEX "proyectos_empresa_id_idx" ON "proyectos"("empresa_id");

-- CreateIndex
CREATE INDEX "proyectos_departamento_id_idx" ON "proyectos"("departamento_id");

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
