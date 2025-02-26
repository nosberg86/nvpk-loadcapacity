"use client";

import { Truck } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "./ui";

interface truck {
  truck: Truck;
}

export default function TruckCard({ truck }: truck) {
  const route = useRouter();
  return (
    <Card
      className=" p-3 hover:shadow-md hover:shadow-green-400 hover:cursor-pointer"
      onClick={() => {
        route.push("/truck/Edit/" + truck.id);
      }}
    >
      <CardTitle className="font-bold text-2xl mb-2">{truck.model}</CardTitle>
      <p>{truck.length}</p>
      <p>{new Date(truck.createdAt).toLocaleDateString()}</p>
    </Card>
  );
}
