import React from "react";
import {
  Checkbox,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { Lamina, LaminaType } from "@/models/request";

interface Props {
  laminas: Lamina[];
  onSeleccionar: (
    lamina: Lamina,
    tipo: LaminaType,
    checked: string | boolean,
    cantidad: number
  ) => void;
}

export default function SheetSelection({ laminas, onSeleccionar }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Láminas</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {laminas.map((lamina) => (
            <AccordionItem key={lamina.id} value={lamina.Model}>
              <AccordionTrigger>
                <pre>Lámina: {lamina.Model}</pre>
              </AccordionTrigger>
              <AccordionContent>
                {lamina.types.map((tipo) => (
                  <div key={tipo.id} className="flex gap-2 items-center">
                    <Checkbox
                      onCheckedChange={(checked) =>
                        onSeleccionar(lamina, tipo, checked, 1)
                      }
                    />
                    <pre>{tipo.length} metros</pre>
                    <Input
                      type="number"
                      min={1}
                      max={tipo.stock}
                      defaultValue={1}
                      onChange={(e) =>
                        onSeleccionar(
                          lamina,
                          tipo,
                          true,
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
