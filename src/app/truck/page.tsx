import TruckCard from "@/components/TruckCard";
import { buttonVariants } from "@/components/ui";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

async function loadTask() {
  return await prisma.truck.findMany();
}

async function truck() {
  const truck = await loadTask();
  return (
    <div className="container mx-auto ">
      <div>
        <Link
          href="/truck/New"
          className={buttonVariants({ variant: "outline" })}
        >
          <Plus />
          Adicionar
        </Link>
      </div>
      <div className="grid gap-3 mt-10 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
        {truck.map((truck) => (
          <TruckCard truck={truck} key={truck.id}></TruckCard>
        ))}
      </div>
    </div>
  );
}

export default truck;
