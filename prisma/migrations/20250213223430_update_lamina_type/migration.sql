/*
  Warnings:

  - A unique constraint covering the columns `[sheetId,length]` on the table `LaminaType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Model]` on the table `sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LaminaType" DROP CONSTRAINT "LaminaType_sheetId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "LaminaType_sheetId_length_key" ON "LaminaType"("sheetId", "length");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_Model_key" ON "sheet"("Model");

-- AddForeignKey
ALTER TABLE "LaminaType" ADD CONSTRAINT "LaminaType_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
