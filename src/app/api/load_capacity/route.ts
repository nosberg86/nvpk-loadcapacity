import prisma from "@/lib/prisma";
import { Truck } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Lamina {
  Model: string;
  width: number;
  thickness: number;
  weight: number;
  types: { length: number; stock: number }[];
}

export async function POST(req: NextRequest) {
  try {
    const { laminas }: { laminas: Lamina[] } = await req.json();
    if (!Array.isArray(laminas) || !laminas.length) {
      return NextResponse.json(
        { error: "Formato de datos inválido" },
        { status: 400 }
      );
    }

    const camiones: Truck[] = await prisma.truck.findMany();

    const { volumenTotal, pesoTotal } = laminas
      .flatMap((l) => l.types)
      .reduce(
        (acc, { length, stock }, i) => {
          const { width, thickness, weight } =
            laminas[Math.floor(i / laminas[0].types.length)];
          acc.volumenTotal += length * width * thickness * stock;
          acc.pesoTotal += weight * length * stock;
          return acc;
        },
        { volumenTotal: 0, pesoTotal: 0 }
      );

    const camionesValidos = camiones.filter(
      (c) =>
        volumenTotal <= c.length * c.width * c.height && pesoTotal <= c.capacity
    );
    if (!camionesValidos.length) {
      return NextResponse.json({ message: "No hay camiones disponibles." });
    }

    // Seleccionar el camión más ajustado a la carga
    const camionOptimo = camionesValidos.reduce((optimo, actual) =>
      actual.length * actual.width * actual.height - volumenTotal <
        optimo.length * optimo.width * optimo.height - volumenTotal &&
      actual.capacity - pesoTotal < optimo.capacity - pesoTotal
        ? actual
        : optimo
    );

    const response = {
      volumenCarga: volumenTotal,
      pesoCarga: pesoTotal,
      camionesDisponibles: camionesValidos.map(
        ({ id, model, length, width, height, capacity }) => ({
          camionId: id,
          modelo: model,
          volumenDisponible: length * width * height - volumenTotal,
          pesoDisponible: capacity - pesoTotal,
        })
      ),
      camionOptimo: {
        camionId: camionOptimo.id,
        modelo: camionOptimo.model,
        PesoCamion: camionOptimo.capacity,
        porcentajeOcupacion: (pesoTotal * 100) / camionOptimo.capacity,
        volumenDisponible:
          camionOptimo.length * camionOptimo.width * camionOptimo.height -
          volumenTotal,
        pesoDisponible: camionOptimo.capacity - pesoTotal,
      },
    };

    return NextResponse.json({ status: 200, response });
  } catch (error) {
    console.error("Error al verificar cubicaje:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
