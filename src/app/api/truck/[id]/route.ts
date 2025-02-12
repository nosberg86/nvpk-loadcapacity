import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ id: number }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  const truck = await prisma.truck.findUnique({
    where: {
      id: Number(id),
    },
  });
  return NextResponse.json(truck);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  const data = await request.json();
  const updatedtruck = await prisma.truck.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  return NextResponse.json(updatedtruck);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  try {
    const truckDeleted = await prisma.truck.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(truckDeleted);
  } catch (err: unknown) {
    console.log(err);
    return NextResponse.json("no existe el registro");
  }
}
