import prisma from "@/lib/prisma";
import CustomForm from "../components/SheetCustomForm";
import { Lamina } from "@/models/request";

type Params = Promise<{ id: number }>;

async function newSheet({ params }: { params: Params }) {
  //const router = useRouter();
  let data: Lamina | null | undefined;
  const id = (await params)?.id;

  if (id) {
    const sheet = await prisma.sheet.findUnique({
      where: {
        id: Number(id),
      },
      include: { types: true },
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
