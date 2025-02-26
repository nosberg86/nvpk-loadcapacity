"use client";

import { sheet } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "./ui";

interface Sheet {
  sheet: sheet;
}

export default function SheetCard({ sheet }: Sheet) {
  const route = useRouter();
  return (
    <Card
      className=" hover:shadow-md hover:shadow-green-400 hover:cursor-pointer p-6"
      onClick={() => {
        route.push("/sheet/Edit/" + sheet.id);
      }}
    >
      <CardTitle className="font-bold text-2xl mb-2">{sheet.Model}</CardTitle>
      <p>{sheet.width}</p>
      <p>{new Date(sheet.createdAt).toLocaleDateString()}</p>
    </Card>
  );
}
