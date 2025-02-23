/*
  Warnings:

  - The primary key for the `LaminaType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `LaminaType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Truck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Truck` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `sheet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `sheetId` on the `LaminaType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "LaminaType" DROP CONSTRAINT "LaminaType_sheetId_fkey";

-- AlterTable
ALTER TABLE "LaminaType" DROP CONSTRAINT "LaminaType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "sheetId",
ADD COLUMN     "sheetId" INTEGER NOT NULL,
ADD CONSTRAINT "LaminaType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Truck_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sheet" DROP CONSTRAINT "sheet_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "sheet_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "LaminaType_sheetId_length_key" ON "LaminaType"("sheetId", "length");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_id_Model_key" ON "sheet"("id", "Model");

-- AddForeignKey
ALTER TABLE "LaminaType" ADD CONSTRAINT "LaminaType_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
