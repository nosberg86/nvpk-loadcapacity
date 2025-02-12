import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sheet = await prisma.sheet.findMany();
  return NextResponse.json(sheet);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newsheet = await prisma.sheet.create({
    data: data,
  });
  return NextResponse.json(newsheet);
}
