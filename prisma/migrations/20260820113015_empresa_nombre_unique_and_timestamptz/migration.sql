/*
  Warnings:

  - You are about to drop the column `createdAt` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `empresas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `empresas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nombre_key" ON "empresas"("nombre");

-- CreateIndex
CREATE INDEX "empresas_activo_idx" ON "empresas"("activo");
