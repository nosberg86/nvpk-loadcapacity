import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Lamina } from "@/models/request";
interface Params {
  params: Promise<{ id: number }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = (await params)?.id;
  const sheet = await prisma.sheet.findUnique({
    where: {
      id: Number(id),
    },
    include: { types: true },
  });
  return NextResponse.json(sheet);
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const sheetId = Number((await params)?.id);
    const { Model, width, thickness, weight, types }: Lamina =
      await request.json();

    // Validación básica
    if (!sheetId || !Array.isArray(types) || types.length === 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // Buscar la lámina existente y sus tipos
    const existingSheet = await prisma.sheet.findUnique({
      where: { id: sheetId },
      include: { types: true },
    });
    if (!existingSheet || existingSheet.Model !== Model) {
      return NextResponse.json(
        { error: "Lámina no encontrada" },
        { status: 404 }
      );
    }

    // Array con las longitudes nuevas y mapa de tipos existentes (key: length)
    const newLengths = types.map((t: { length: number }) => t.length);
    const existingTypesMap = new Map(
      existingSheet.types.map((t) => [t.length, t])
    );

    // Transacción para actualizar la lámina y sincronizar los types
    const updatedSheet = await prisma.$transaction(async (tx) => {
      // Actualizar datos principales de la lámina
      await tx.sheet.update({
        where: { id: sheetId },
        data: { Model, width, thickness, weight },
      });

      // Para cada tipo del request, actualizamos si existe o creamos si no existe
      await Promise.all(
        types.map(async (type: { length: number; stock: number }) => {
          const updateWeight = type.length * weight;
          if (existingTypesMap?.has(type.length)) {
            return tx.laminaType.update({
              where: { id: existingTypesMap?.get(type?.length)?.id },
              data: { weight: updateWeight, stock: type.stock },
            });
          } else {
            return tx.laminaType.create({
              data: {
                sheetId,
                length: type.length,
                weight: updateWeight,
                stock: type.stock,
              },
            });
          }
        })
      );

      // Eliminar aquellos tipos que ya no están en la lista actualizada
      await tx.laminaType.deleteMany({
        where: {
          sheetId,
          length: { notIn: newLengths },
        },
      });

      // Retornar la lámina actualizada con sus types
      return tx.sheet.findUnique({
        where: { id: sheetId },
        include: { types: true },
      });
    });

    if (!updatedSheet) {
      return NextResponse.json(
        { error: "No se encontraron datos actualizados." },
        { status: 400 }
      );
    }
    return NextResponse.json(updatedSheet, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la lámina:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
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
