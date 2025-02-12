"use client";
import {
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { sheet } from "@prisma/client";
import { sheetFormValues, sheetSchema } from "@/models/sheetSchema";

interface props {
  url: string;
  sheet?: sheet | null;
}

const CustomForm = ({ url, sheet }: props) => {
  const router = useRouter();
  let editSheet = {} as sheet;
  if (sheet?.weight) {
    editSheet = {
      ...sheet,
      weight: sheet.weight / sheet.length,
    };
  }
  const form = useForm<sheetFormValues>({
    resolver: zodResolver(sheetSchema),
    defaultValues: {
      Type: sheet?.Type,
      length: sheet?.length,
      width: sheet?.width,
      thickness: sheet?.thickness,
      weight: editSheet.weight,
      stock: sheet?.stock,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // Crear nuevo objeto con thickness modificado
    const modifiedValues = {
      ...values,
      weight: values.weight * values.length,
    };
    let resp: Response;

    if (sheet?.id) {
      //Edit Task
      resp = await fetch(url + sheet.id, {
        method: "PUT",
        body: JSON.stringify(modifiedValues),
        headers: {
          "Content-type": "aplication/json",
        },
      });
    } else {
      //Create Task
      resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(modifiedValues),
        headers: {
          "Content-type": "aplication/json",
        },
      });
    }

    const data = await resp.json();
    console.log(data);
    router.push("/sheet");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="dark:bg-slate-800 ">
          <CardHeader>
            <CardTitle>{sheet?.id ? "Editar" : "Adicionar"} Lámina</CardTitle>
            <CardDescription>
              Formulario para la {sheet?.id ? "edicion" : "creacion"} de láminas
              Plastitejas.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="Type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecciona el Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo</SelectLabel>
                          <SelectItem value="R101">R101</SelectItem>
                          <SelectItem value="AGP1">AGP1</SelectItem>
                          <SelectItem value="AGP10_Florencia">
                            AGP10 Florencia
                          </SelectItem>
                          <SelectItem value="AGP10_Praga">
                            AGP10 Praga
                          </SelectItem>
                          <SelectItem value="AGP5">AGP5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud (m)*</FormLabel>
                  <FormControl>
                    <Input placeholder="Longitud" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (m)*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ancho" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grosor (m)*</FormLabel>
                  <FormControl>
                    <Input placeholder="Grosor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (KG)*</FormLabel>
                  <FormControl>
                    <Input placeholder="Peso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad Disponible*</FormLabel>
                  <FormControl>
                    <Input placeholder="Stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">{sheet?.id ? "Editar" : "Adicionar"}</Button>
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
                  router.push("/sheet");
                }}
              >
                {" Eliminar "}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CustomForm;
