import { z } from "zod";

export const sheetSchema = z.object({
  Type: z.string().min(1, "El tipo es obligatorio"),
  length: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El largo es obligatoria"),
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
  stock: z.coerce
    .number({ message: "Se espera un número positivo" })
    .min(1, "El stock debe ser mayor a 0"),
});

export type sheetFormValues = z.infer<typeof sheetSchema>;
