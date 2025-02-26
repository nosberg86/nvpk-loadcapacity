"use client";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { Plus, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { sheetFormValues, sheetSchema } from "@/models/sheetSchema";
import { Lamina } from "@/models/request";
import { useState } from "react";

interface props {
  url: string;
  sheet?: Lamina | null;
}

const CustomForm = ({ url, sheet }: props) => {
  const router = useRouter();
  const [newTypeOpen, setNewTypeOpen] = useState(false);
  const [currentType, setCurrentType] = useState({ length: 0, stock: 0 });

  const form = useForm<sheetFormValues>({
    resolver: zodResolver(sheetSchema),
    defaultValues: {
      Model: sheet?.Model,
      width: sheet?.width,
      thickness: sheet?.thickness,
      weight: sheet?.weight,
      types:
        sheet?.types?.map((type) => ({
          length: type.length || 0,
          stock: type.stock || 0,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "types",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // Crear nuevo objeto con thickness modificado

    let resp: Response;
    console.log(values);
    if (sheet?.id) {
      //Edit Task
      resp = await fetch(url + sheet.id, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "aplication/json",
        },
      });
    } else {
      //Create Task
      resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "aplication/json",
        },
      });
    }

    const data = await resp.json();
    console.log(data);
    router.push("/sheet");
  });

  const handleAddType = () => {
    append(currentType);
    setCurrentType({ length: 0, stock: 0 });
    setNewTypeOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {sheet?.id ? "Editar" : "Adicionar"} Lámina{" "}
              <X
                className="h-10 w-5 cursor-pointer "
                onClick={() => router.push("/")}
              />
            </CardTitle>
            <CardDescription>
              Formulario para la {sheet?.id ? "edición" : "creación"} de láminas
              Plastitejas.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Model (Select) */}
            <FormField
              control={form.control}
              name="Model"
              render={({ field }) => (
                <FormItem>
                  {sheet ? (
                    <div className="py-6">
                      <FormControl>
                        <CardTitle>
                          <pre>Modelo {field.value}</pre>
                        </CardTitle>
                      </FormControl>
                      <Input type="hidden" {...field} />{" "}
                    </div>
                  ) : (
                    <div className="max-w-40 py-6">
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="R101">R101</SelectItem>
                          <SelectItem value="AGP1">AGP1</SelectItem>
                          <SelectItem value="AGP1">AGP2</SelectItem>
                          <SelectItem value="AGP1">AGP5</SelectItem>
                          <SelectItem value="AGP10_Florencia">
                            AGP10 Florencia
                          </SelectItem>
                          <SelectItem value="AGP10_Praga">
                            AGP10 Praga
                          </SelectItem>
                          <SelectItem value="AGP5">AGP5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
              {/* Width */}
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ancho (m) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thickness */}
              <FormField
                control={form.control}
                name="thickness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grosor (m) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.05"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (KG) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Types (Dynamic Array) */}
            <Card className=" mt-6 p-5 dark:bg-slate-600 shadow-md">
              <CardHeader>
                <FormLabel>Variantes (Longitud y Stock) *</FormLabel>
              </CardHeader>

              <div className="relative">
                <Textarea
                  className="min-h-[120px] cursor-text"
                  onClick={() => setNewTypeOpen(true)}
                  readOnly
                  value=""
                />

                <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-2">
                  {fields.map((field, index) => (
                    <Badge
                      key={field.id}
                      className="px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>
                        {field.length}m / {field.stock}u
                      </span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => remove(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {newTypeOpen && (
                <div className="border p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="length">Longitud</Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="Longitud (m)"
                        value={currentType.length}
                        onChange={(e) =>
                          setCurrentType({
                            ...currentType,
                            length: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Cantidad</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="Stock"
                        value={currentType.stock}
                        onChange={(e) =>
                          setCurrentType({
                            ...currentType,
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddType}
                      disabled={
                        currentType.length <= 0 || currentType.stock <= 0
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variante
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewTypeOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="submit">{sheet?.id ? "Actualizar" : "Crear"}</Button>
            {sheet?.id && (
              <Button
                variant="destructive"
                type="button"
                onClick={async () => {
                  const resp = await fetch(url + sheet?.id, {
                    method: "DELETE",
                  });
                  const data = await resp.json();
                  console.log(data);
                  router.push("/");
                }}
              >
                Eliminar
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CustomForm;
