-- CreateTable
CREATE TABLE "proyecto_minerales" (
    "proyecto_id" INTEGER NOT NULL,
    "mineral_id" INTEGER NOT NULL,

    CONSTRAINT "proyecto_minerales_pkey" PRIMARY KEY ("proyecto_id","mineral_id")
);

-- CreateIndex
CREATE INDEX "proyecto_minerales_mineral_id_idx" ON "proyecto_minerales"("mineral_id");

-- AddForeignKey
ALTER TABLE "proyecto_minerales" ADD CONSTRAINT "proyecto_minerales_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecto_minerales" ADD CONSTRAINT "proyecto_minerales_mineral_id_fkey" FOREIGN KEY ("mineral_id") REFERENCES "minerales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
