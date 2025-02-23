import { z } from "zod";

export const sheetSchema = z.object({
  Model: z.string().min(1, "El tipo es obligatorio"),
  width: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El ancho es obligatorio"),
  thickness: z.coerce
    .number()
    .gt(0, { message: "Se espera un numero mayor a 0.x" })
    .lt(1, { message: "Se espera un numero menor a 1" }),
  weight: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El peso es obligatoria"),
  types: z.array(
    z.object({
      length: z.coerce
        .number({ message: "Se espera un número positivo" })
        .min(1, "La longitud es obligatoria"),
      stock: z.coerce
        .number({ message: "Se espera un número positivo" })
        .min(1, "La cantidad es obligatoria"),
    })
  ),
});

export type sheetFormValues = z.infer<typeof sheetSchema>;
