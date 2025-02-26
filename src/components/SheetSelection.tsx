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
        <Accordion type="single" collapsible>
          {laminas.map((lamina) => (
            <AccordionItem
              key={lamina.id}
              value={lamina.Model}
              className=" gap-2 hover:border-green-400"
            >
              <AccordionTrigger>
                <pre>Lámina: {lamina.Model}</pre>
              </AccordionTrigger>
              <AccordionContent>
                {lamina.types.map((tipo) => (
                  <div
                    key={tipo.id}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-2 my-2"
                  >
                    <div className="flex justify-between">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          onSeleccionar(lamina, tipo, checked, 1)
                        }
                      />
                      <pre className="mx-4">{tipo.length} metros</pre>
                    </div>

                    <Input
                      className="max-w-32"
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
