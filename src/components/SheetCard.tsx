"use client";

import { sheet } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Sheet {
  sheet: sheet;
}

export default function SheetCard({ sheet }: Sheet) {
  const route = useRouter();
  return (
    <div
      className="bg-slate-700 p-3 hover:bg-slate-500 hover:cursor-pointer"
      onClick={() => {
        route.push("/sheet/Edit/" + sheet.id);
      }}
    >
      <h3 className="font-bold text-2xl mb-2">{sheet.Type}</h3>
      <p>{sheet.length}</p>
      <p>{new Date(sheet.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
