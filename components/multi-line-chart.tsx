"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const generateColor = (index: number): string => {
  const hue = (index * 137.508) % 360; // Use a golden angle approximation for better color distribution
  return `hsl(${hue}, 70%, 50%)`;
};

export function MultiLineChart({ chartData }: any) {

  console.log(chartData);

  const keys: string[] = chartData.labels.map((label: { key: string, value: string }) => label.key);

  const chartConfig: ChartConfig = chartData.labels.reduce((config: ChartConfig, label: { key: string, value: string }, index: number) => {
    config[label.key] = {
      label: label.value,
      color: generateColor(index)
    };
    return config;
  }, {} as ChartConfig);

  const lineData = keys.map((key: string, _) => {
    return <Line key={key} dataKey={key} type="monotone" stroke={chartConfig[key].color} strokeWidth={2} dot={false} />
  });

  console.log(lineData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>FX Comparison</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number" domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {lineData}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card >
  )
}
