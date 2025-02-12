import { PrismaClient, sheet } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { laminas } = (await req.json()) as { laminas: Array<sheet> };
  const camiones = await prisma.truck.findMany();

  let volumenTotal = 0;
  let pesoTotal = 0;

  for (const lamina of laminas) {
    volumenTotal +=
      lamina.length * lamina.width * lamina.thickness * lamina.stock;
    pesoTotal += lamina.weight * lamina.stock;
  }

  const camionesValidos = camiones.filter(
    (truck) =>
      volumenTotal <= truck.length * truck.width * truck.height &&
      pesoTotal <= truck.capacity
  );

  if (camionesValidos.length === 0) {
    // Intentar distribuir la carga en múltiples camiones
    const sortedCamiones = camiones.sort(
      (a, b) => b.length * b.width * b.height - a.length * a.width * a.height
    );
    let volumenRestante = volumenTotal;
    let pesoRestante = pesoTotal;

    for (const truck of sortedCamiones) {
      const volumenDisponible = truck.length * truck.width * truck.height;
      const pesoDisponible = truck.capacity;
      const camionesUsados = [];
      if (volumenRestante > 0 && pesoRestante > 0) {
        const volumenUsado = Math.min(volumenDisponible, volumenRestante);
        const pesoUsado = Math.min(pesoDisponible, pesoRestante);
        camionesUsados.push({
          camionId: truck.id,
          modelo: truck.model,
          volumenOcupado: volumenUsado,
          pesoOcupado: pesoUsado,
          volumenDisponible: volumenDisponible - volumenUsado,
          pesoDisponible: pesoDisponible - pesoUsado,
        });
        volumenRestante -= volumenUsado;
        pesoRestante -= pesoUsado;
        console.log(camionesUsados);
      }
    }

    if (volumenRestante > 0 || pesoRestante > 0) {
      return NextResponse.json({
        status: 200,
        message:
          "No hay suficientes camiones disponibles para acomodar la carga.",
      });
    }
    return NextResponse.json({
      status: 200,
      message: "La carga ha sido distribuida en múltiples camiones.",
    });
  }

  // Seleccionar el camión más ajustado a la carga
  const camionOptimo = camionesValidos.reduce((optimo, actual) => {
    const volumenRestanteOptimo =
      optimo.length * optimo.width * optimo.height - volumenTotal;
    const pesoRestanteOptimo = optimo.capacity - pesoTotal;
    const volumenRestanteActual =
      actual.length * actual.width * actual.height - volumenTotal;
    const pesoRestanteActual = actual.capacity - pesoTotal;

    return volumenRestanteActual < volumenRestanteOptimo &&
      pesoRestanteActual < pesoRestanteOptimo
      ? actual
      : optimo;
  });

  const response = {
    volumenCarga: volumenTotal,
    pesoCarga: pesoTotal,
    camionesDisponibles: camionesValidos.map((truck) => ({
      camionId: truck.id,
      modelo: truck.model,
      volumenDisponible:
        truck.length * truck.width * truck.height - volumenTotal,
      pesoDisponible: truck.capacity - pesoTotal,
    })),
    camionOptimo: {
      camionId: camionOptimo.id,
      modelo: camionOptimo.model,
      volumenCamion:
        camionOptimo.length * camionOptimo.width * camionOptimo.height,
      PesoCamion: camionOptimo.capacity,
      volumenOcupado: volumenTotal,
      pesoOcupado: pesoTotal,
      porcentajeOcupacion: parseInt(
        ((pesoTotal * 100) / camionOptimo.capacity).toFixed(2)
      ),
      volumenDisponible:
        camionOptimo.length * camionOptimo.width * camionOptimo.height -
        volumenTotal,
      pesoDisponible: camionOptimo.capacity - pesoTotal,
    },
  };
  console.log(response);

  return NextResponse.json({ status: 200, response });
}
