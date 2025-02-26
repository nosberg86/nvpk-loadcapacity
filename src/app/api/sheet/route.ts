import prisma from "@/lib/prisma";
import { LaminaType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sheet = await prisma.sheet.findMany({
    include: {
      types: true,
    },
  });
  return NextResponse.json(sheet);
}

export async function POST(request: NextRequest) {
  const { Model, width, thickness, weight, types } = await request.json();
  const sheet = {
    Model,
    width,
    thickness,
    weight,
    types: {
      create: types.map((type: LaminaType) => ({
        length: type.length,
        weight: type.length * weight,
        stock: type.stock,
      })),
    },
  };

  const newsheet: Prisma.sheetCreateInput = await prisma.sheet.upsert({
    where: { Model: Model },
    update: {},
    create: sheet,
  });
  return NextResponse.json(newsheet);
}
