"use client";

import { Truck } from "@prisma/client";
import { useRouter } from "next/navigation";

interface truck {
  truck: Truck;
}

export default function TruckCard({ truck }: truck) {
  const route = useRouter();
  return (
    <div
      className="bg-slate-700 p-3 hover:bg-slate-500 hover:cursor-pointer"
      onClick={() => {
        route.push("/truck/Edit/" + truck.id);
      }}
    >
      <h3 className="font-bold text-2xl mb-2">{truck.model}</h3>
      <p>{truck.length}</p>
      <p>{new Date(truck.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
