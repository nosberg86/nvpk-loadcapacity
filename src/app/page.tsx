"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { sheet, Truck } from "@prisma/client";

interface result {
  message: string;
  response:
    | {
        volumenCarga: number;
        pesoCarga: number;
        camionesDisponibles: {
          camionId: number;
          modelo: string;
          volumenDisponible: number;
          pesoDisponible: number;
        }[];
        camionOptimo: {
          camionId: number;
          modelo: string;
          volumenCamion: number;
          PesoCamion: number;
          volumenOcupado: number;
          pesoOcupado: number;
          porcentajeOcupacion: number;
          volumenDisponible: number;
          pesoDisponible: number;
        };
      }
    | undefined;
}

export default function Dashboard() {
  const [laminas, setLaminas] = useState<sheet[]>([]);
  const [camiones, setCamiones] = useState<Truck[]>([]);
  const [resultado, setResultado] = useState<result | null>(null);

  useEffect(() => {
    fetch("/api/sheet")
      .then((res) => res.json())
      .then((data) => setLaminas(data));

    fetch("/api/truck")
      .then((res) => res.json())
      .then((data) => setCamiones(data));
  }, []);

  const verificarCubicaje = async () => {
    const response = await fetch("/api/load_capacity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ laminas }),
    });
    const data: result = await response.json();
    setResultado(data);
    console.log(
      "Laminas:",
      laminas,
      "camiones:",
      camiones,
      "Resultados:",
      data
    );
  };

  return (
    <div className="p-6 space-y-4 ">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Láminas Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {laminas.map((lamina) => (
                <li key={lamina.id}>
                  {lamina.stock} -- {lamina.Type} - {lamina.length}x
                  {lamina.width} ({lamina.weight * lamina.stock}kg)
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Camiones Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {camiones.map((camion) => (
                <li key={camion.id}>
                  {camion.model} - Capacidad: {camion.capacity}kg
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Button onClick={verificarCubicaje}>Verificar Cubicaje</Button>

      {resultado && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              {resultado.message && <p>{resultado.message}</p>}
              {resultado.response?.camionesDisponibles && (
                <div>
                  <h3>Camiones Disponibles</h3>
                  <ul>
                    {resultado.response.camionesDisponibles.map((camion) => (
                      <li key={camion.camionId}>
                        {camion.modelo} - Volumen Disponible:{" "}
                        {camion.volumenDisponible} - Peso Disponible:{" "}
                        {camion.pesoDisponible}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              {resultado.response?.camionOptimo && (
                <div>
                  <h3>Camión Óptimo</h3>
                  <p>
                    {resultado.response.camionOptimo.modelo} - Volumen
                    Disponible:{" "}
                    {resultado.response.camionOptimo.volumenDisponible} - Peso
                    Disponible: {resultado.response.camionOptimo.pesoDisponible}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
