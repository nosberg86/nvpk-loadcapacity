/*
  Warnings:

  - A unique constraint covering the columns `[Model]` on the table `sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sheet_id_Model_key";

-- CreateIndex
CREATE UNIQUE INDEX "sheet_Model_key" ON "sheet"("Model");
