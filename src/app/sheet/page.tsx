import SheetCard from "@/components/SheetCard";
import { buttonVariants } from "@/components/ui";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

async function loadSheet() {
  return await prisma.sheet.findMany();
}

async function sheet() {
  const sheetList = await loadSheet();
  return (
    <div className="container mx-auto ">
      <div>
        <Link
          href="/sheet/New"
          className={buttonVariants({ variant: "outline" })}
        >
          <Plus />
          Adicionar
        </Link>
      </div>
      {sheetList.length === 0 && (
        <h1 className="font-bold text-2xl mb-2">No hay objetos que mostrar.</h1>
      )}
      <div className="grid gap-3 mt-10 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
        {sheetList.map((sheet) => (
          <SheetCard sheet={sheet} key={sheet.id}></SheetCard>
        ))}
      </div>
    </div>
  );
}

export default sheet;
