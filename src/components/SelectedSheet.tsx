import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Lamina } from "@/models/request";
import { LaminaType } from "@prisma/client";
import { X } from "lucide-react";

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
  const onDelete = (deletedSheet: Lamina, tipo: LaminaType) => {
    const updatedSheets: Lamina[] = seleccionadas.map((item) => {
      const updatedTypes = item.types.filter((t) => t !== tipo);
      console.log(updatedTypes);
      return {
        ...item,
        types: updatedTypes,
      };
    });
    onEliminar(updatedSheets);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Láminas Disponibles</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2">
        {seleccionadas.map((lamina) => (
          <Card key={lamina.id}>
            <CardHeader>
              <CardTitle>{lamina.Model}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
              {lamina.types.map((tipo) => (
                <Badge
                  key={tipo.id}
                  className="px-3 py-1 rounded-full flex items-center gap-2  max-w-40 "
                >
                  <Badge className="bg-slate-600 rounded-full dark:text-white ">
                    {tipo.stock}
                  </Badge>
                  <pre>{tipo.length} metros</pre>
                  <X
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => onDelete(lamina, tipo)}
                  />
                </Badge>
              ))}
            </CardContent>
          </Card>
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
