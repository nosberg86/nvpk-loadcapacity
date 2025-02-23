import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Lamina } from "@/models/request";

interface Props {
  seleccionadas: Lamina[];
  onEliminar: (laminas: Lamina[]) => void;
  pesoTotal: number;
  volumenTotal: number;
}

export function SelectedSheet({
  seleccionadas,
  onEliminar,
  pesoTotal,
  volumenTotal,
}: Props) {
  const onDelete = (deletedSheet: Lamina) => {
    seleccionadas = seleccionadas.filter((item) => item !== deletedSheet);
    onEliminar(seleccionadas);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Láminas Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        {seleccionadas.map((lamina) => (
          <div key={lamina.id} className="border p-2 rounded-lg bg-gray-100">
            <strong>{lamina.Model}</strong>
            {lamina.types.map((tipo) => (
              <span
                key={tipo.id}
                className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                ({tipo.stock}) {lamina.Model} - {tipo.length}m
              </span>
            ))}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Peso total: {pesoTotal / 1000} Toneladas
        </div>
        <div className="leading-none text-muted-foreground">
          Volumen total: {volumenTotal.toFixed(2)} m³
        </div>
      </CardFooter>
    </Card>
  );
}
