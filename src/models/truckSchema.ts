import { z } from "zod";

export const truckSchema = z.object({
  model: z.string().min(1, "El Modelo es obligatorio"),
  length: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "La longitud es obligatoria"),
  width: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El ancho es obligatorio"),
  height: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El ancho es obligatorio"),
  capacity: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "La capacidad es obligatoria"),
});

export type truckFormValues = z.infer<typeof truckSchema>;
