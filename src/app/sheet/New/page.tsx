import prisma from "@/lib/prisma";
import { sheet } from "@prisma/client";
import CustomForm from "../components/SheetCustomForm";

type Params = Promise<{ id: number }>;

async function newSheet({ params }: { params: Params }) {
  //const router = useRouter();
  let data: sheet | null | undefined;
  const id = (await params)?.id;

  if (id) {
    const sheet = await prisma.sheet.findUnique({
      where: {
        id: Number(id),
      },
    });
    data = sheet;
  }

  return (
    <div className="h-screen flex justify-center items-center ">
      <CustomForm url="/api/sheet/" sheet={data} />
    </div>
  );
}

export default newSheet;
