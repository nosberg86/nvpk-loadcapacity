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
import { Truck } from "@prisma/client";
import { truckFormValues, truckSchema } from "@/models/truckSchema";

interface props {
  url: string;
  truck?: Truck | null;
}

const CustomForm = ({ url, truck }: props) => {
  const router = useRouter();
  const form = useForm<truckFormValues>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      model: truck?.model,
      length: truck?.length,
      width: truck?.width,
      height: truck?.height,
      capacity: truck?.capacity,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    let resp: Response;

    if (truck?.id) {
      //Edit Task
      resp = await fetch(url + truck.id, {
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
    router.push("/truck");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="dark:bg-slate-800 ">
          <CardHeader>
            <CardTitle>
              {truck?.id ? "Editar Camión" : "Adicionar Camión"}
            </CardTitle>
            <CardDescription>
              Formulario para la {truck?.id ? "edicion" : "creacion"} de
              camiones.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo*</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecciona el modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Modelo</SelectLabel>
                          <SelectItem value="Torton">Torton</SelectItem>
                          <SelectItem value="Camioneta">Camioneta</SelectItem>
                          <SelectItem value="Plataforma">Plataforma</SelectItem>
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
                  <FormLabel>Longitud*</FormLabel>
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
                  <FormLabel>Ancho*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ancho" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alto</FormLabel>
                  <FormControl>
                    <Input placeholder="Alto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad*</FormLabel>
                  <FormControl>
                    <Input placeholder="capacidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">{truck?.id ? "Editar" : "Adicionar"}</Button>
            {truck?.id && (
              <Button
                variant="destructive"
                type="button"
                onClick={async () => {
                  const resp = await fetch(url + truck?.id, {
                    method: "DELETE",
                  });
                  const data = await resp.json();
                  console.log(data);
                  router.push("/");
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
