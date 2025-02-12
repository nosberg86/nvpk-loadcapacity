import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const truck = await prisma.truck.findMany();
  return NextResponse.json(truck);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newTruck = await prisma.truck.create({
    data: data,
  });
  return NextResponse.json(newTruck);
}
