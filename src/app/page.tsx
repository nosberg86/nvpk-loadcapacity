"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import SheetSelection from "@/components/SheetSelection";
import { SelectedSheet } from "@/components/SelectedSheet";
import CamionOptimoCard from "@/components/OptimalTruck";
import { Lamina, LaminaType, result } from "@/models/request";
import AvailableTruck from "@/components/AvailableTruck";

export default function Dashboard() {
  const [laminas, setLaminas] = useState<Lamina[]>([]);
  //const [camiones, setCamiones] = useState<Truck[]>([]);
  const [disponibles, setDisponibles] = useState<Lamina[]>([]);
  const [cargaTotal, setCargaTotal] = useState({ peso: 0, volumen: 0 });
  const [camionOptimo, setCamionOptimo] = useState<any>(null);
  const [resultado, setResultado] = useState<result | null>(null);
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/sheet")
      .then((res) => res.json())
      .then((data) => setLaminas(data));

    /*  fetch("/api/truck")
      .then((res) => res.json())
      .then((data) => setCamiones(data)); */
  }, []);

  const handleSeleccion = (
    lamina: Lamina,
    tipo: LaminaType,
    checked: string | boolean,
    cantidad: number
  ) => {
    // Se asume que "setDisponibles" y "calcularCarga" están definidos en el componente
    setDisponibles((prev: Lamina[]) => {
      // Buscar si la lámina ya existe en la lista de disponibles
      const existing = prev.find((item) => item.id === lamina.id);
      let updated: Lamina[];

      if (!existing) {
        // Si no existe y se marca, se agrega la lámina con solo el tipo seleccionado.
        // Es importante que solo se incluya el tipo seleccionado, no toda la lista de tipos.
        updated = checked
          ? [...prev, { ...lamina, types: [{ ...tipo, stock: cantidad }] }]
          : prev;
      } else {
        // Si la lámina ya existe, se actualiza su array de "types"
        updated = prev
          .map((item) => {
            if (item.id !== lamina.id) return item;
            // Si la lámina ya está, actualizamos su propiedad "types":
            // - Si checked es true: agregamos el tipo si no existe o actualizamos la cantidad.
            // - Si checked es false: eliminamos el tipo.
            const newTypes = checked
              ? item.types.some((t) => t.id === tipo.id)
                ? item.types.map((t) =>
                    t.id === tipo.id ? { ...t, stock: cantidad } : t
                  )
                : [...item.types, { ...tipo, stock: cantidad }]
              : item.types.filter((t) => t.id !== tipo.id);
            return { ...item, types: newTypes };
          })
          // Eliminamos cualquier lámina que, tras la actualización, no tenga ningún tipo seleccionado
          .filter((item) => item.types.length > 0);
      }
      // Se recalcula la carga total en base a la lista actualizada
      calcularCarga(updated);
      return updated;
    });
  };

  const calcularCarga = (laminasSeleccionadas: Lamina[]) => {
    let pesoTotal = 0,
      volumenTotal = 0;
    laminasSeleccionadas.forEach((lamina) => {
      lamina.types.forEach((tipo) => {
        pesoTotal += tipo.weight * tipo.stock;
        volumenTotal +=
          lamina.width * lamina.thickness * tipo.length * tipo.stock;
      });
    });
    setCargaTotal({ peso: pesoTotal, volumen: volumenTotal });
  };

  const verificarCarga = async () => {
    setOpen(false);
    console.log("Laminas Disp:", disponibles);
    const response = await fetch("/api/load_capacity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ laminas: disponibles }),
    });
    const data: result = await response.json();
    setResultado(data);
    setCamionOptimo(data.response?.camionOptimo);
  };

  return (
    <div>
      {open && (
        <div className="p-6 space-y-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Card de selección de láminas */}
            <SheetSelection laminas={laminas} onSeleccionar={handleSeleccion} />

            {/* Card de láminas seleccionadas */}
            <SelectedSheet
              seleccionadas={disponibles}
              onEliminar={setDisponibles}
              pesoTotal={cargaTotal.peso}
              volumenTotal={cargaTotal.volumen}
            />
          </div>
          <Button onClick={verificarCarga}>Verificar Cubicaje</Button>
        </div>
      )}
      {!open && <Button onClick={() => setOpen(true)}>Volver</Button>}

      {resultado && !open && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AvailableTruck
            resultado={resultado}
            disponibles={disponibles}
          ></AvailableTruck>
          <CamionOptimoCard resultado={resultado}></CamionOptimoCard>
        </div>
      )}
    </div>
  );
}
