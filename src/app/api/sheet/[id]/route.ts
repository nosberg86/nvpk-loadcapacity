import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ id: number }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  const sheet = await prisma.sheet.findUnique({
    where: {
      id: Number(id),
    },
  });
  return NextResponse.json(sheet);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  const data = await request.json();
  const updatedsheet = await prisma.sheet.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  return NextResponse.json(updatedsheet);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  try {
    const sheetDeleted = await prisma.sheet.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(sheetDeleted);
  } catch (err: unknown) {
    console.log(err);
    return NextResponse.json("no existe el registro");
  }
}
