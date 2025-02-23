/*
  Warnings:

  - You are about to drop the column `Type` on the `sheet` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `sheet` table. All the data in the column will be lost.
  - Added the required column `Model` to the `sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sheet" DROP COLUMN "Type",
DROP COLUMN "stock",
ADD COLUMN     "Model" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LaminaType" (
    "id" SERIAL NOT NULL,
    "sheetId" INTEGER NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "LaminaType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LaminaType" ADD CONSTRAINT "LaminaType_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
