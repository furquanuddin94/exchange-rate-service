"use client"

import { useEffect, useState } from "react";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTimeLabel } from "@/app/utils/chartUtils";

type ChartDataPoint = {
  label: string;
  [key: string]: any;
};

type ChartData = {
  lookbackInHours: number;
  data: ChartDataPoint[];
  labels: { key: string; value: string }[];
};

type MultiLineChartProps = {
  chartData: ChartData;
};

const generateColor = (index: number): string => {
  const hue = (index * 137.508) % 360; // Golden angle approximation for color distribution
  return `hsl(${hue}, 70%, 50%)`;
};

export function MultiLineChart({ chartData }: MultiLineChartProps) {
  const dataPoints = 8;
  const [updatedChartData, setUpdatedChartData] = useState(chartData);

  useEffect(() => {
    const { lookbackInHours, data } = chartData;
    const granularityInMinutes = (lookbackInHours * 60) / dataPoints;

    const filteredData = data.filter((datapoint) => {
      const minutes = parseInt(datapoint.label) / 1000 / 60;
      return minutes % granularityInMinutes === 0;
    });

    const dataWithLabels = filteredData.map((datapoint) => ({
      ...datapoint,
      label: getTimeLabel(parseInt(datapoint.label), granularityInMinutes),
    }));

    setUpdatedChartData((prev) => ({
      ...prev,
      data: dataWithLabels,
    }));
  }, [chartData, dataPoints]);

  const keys = updatedChartData.labels.map((label) => label.key);

  const chartConfig: ChartConfig = updatedChartData.labels.reduce(
    (config, label, index) => {
      config[label.key] = {
        label: label.value,
        color: generateColor(index),
      };
      return config;
    },
    {} as ChartConfig
  );

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
            data={updatedChartData.data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis type="number" domain={['auto', 'auto']} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {keys.map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
