import { Lamina, result } from "@/models/request";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui";

interface Props {
  resultado: result;
  disponibles: Lamina[];
}

export default function AvailableTruck({ resultado }: Props) {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Resultados</CardTitle>
        <CardDescription> kilogramos</CardDescription>
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
  );
}
