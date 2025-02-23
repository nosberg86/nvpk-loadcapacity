import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { result } from "@/models/request";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  Usado: {
    label: "Usado",
    color: "hsl(var(--chart-1))",
  },
  Disponible: {
    label: "Disponible",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface Result {
  resultado: result;
}

export default function CamionOptimoCard({ resultado }: Result) {
  if (!resultado?.response?.camionOptimo) return null;
  const truck = resultado.response.camionOptimo;
  const { porcentajeOcupacion } = truck;
  const data = [
    { Disponible: 100 - porcentajeOcupacion, Usado: porcentajeOcupacion },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Camión Óptimo</CardTitle>
        <CardDescription>
          {truck.modelo} - {truck.PesoCamion} kilogramos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={data}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {truck.pesoDisponible.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          KG Disponibles
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="Disponible"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-Disponible)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Usado"
              fill="var(--color-Usado)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          El camion optimo tiene ocupado un {porcentajeOcupacion} %
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
