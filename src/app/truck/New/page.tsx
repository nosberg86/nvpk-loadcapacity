import prisma from "@/lib/prisma";
import { Truck } from "@prisma/client";
import CustomForm from "../components/TruckCustomForm";

type Params = Promise<{ id: number }>;

async function newTruck({ params }: { params: Params }) {
  //const router = useRouter();
  let data: Truck | null | undefined;
  const id = (await params)?.id;

  if (id) {
    const truck = await prisma.truck.findUnique({
      where: {
        id: Number(id),
      },
    });
    data = truck;
  }

  return (
    <div className="h-screen flex justify-center items-center ">
      <CustomForm url="/api/truck/" truck={data} />
    </div>
  );
}

export default newTruck;
