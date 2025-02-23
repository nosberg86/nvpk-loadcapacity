/*
  Warnings:

  - The primary key for the `LaminaType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Truck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sheet` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "LaminaType" DROP CONSTRAINT "LaminaType_sheetId_fkey";

-- AlterTable
ALTER TABLE "LaminaType" DROP CONSTRAINT "LaminaType_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sheetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LaminaType_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LaminaType_id_seq";

-- AlterTable
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Truck_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Truck_id_seq";

-- AlterTable
ALTER TABLE "sheet" DROP CONSTRAINT "sheet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sheet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sheet_id_seq";

-- AddForeignKey
ALTER TABLE "LaminaType" ADD CONSTRAINT "LaminaType_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
