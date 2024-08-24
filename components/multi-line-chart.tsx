"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getTimeLabel } from "@/app/utils/chartUtils"

type ChartDataPoint = {
  label: string
  [key: string]: any
}

type ChartData = {
  data: ChartDataPoint[]
  labels: { key: string; value: string }[]
}

type MultiLineChartProps = {
  chartData: ChartData
}

const generateColor = (index: number): string => {
  const hue = (index * 137.508) % 360
  return `hsl(${hue}, 70%, 50%)`
}

const lookbackOptions = [
  { value: "24", label: "Last 24 hours" },
  { value: "96", label: "Last 4 days" },
  { value: "168", label: "Last 7 days" },
  { value: "720", label: "Last 30 days" },
]

export function MultiLineChart({ chartData }: MultiLineChartProps) {
  const [lookback, setLookback] = useState("24")
  const [updatedChartData, setUpdatedChartData] = useState(chartData)

  useEffect(() => {
    const lookbackInHours = parseInt(lookback)
    const dataPoints = 8
    const granularityInMinutes = (lookbackInHours * 60) / dataPoints

    const currentTime = Date.now();

    const filteredData = chartData.data.filter((datapoint) => {
      const isInRange = parseInt(datapoint.label) >= currentTime - (lookbackInHours+1) * 60 * 60 * 1000;
      if (!isInRange) return false;

      const minutes = parseInt(datapoint.label) / 1000 / 60;
      return minutes % granularityInMinutes === 0;
    });

    const dataWithLabels = filteredData.map((datapoint) => ({
      ...datapoint,
      label: getTimeLabel(parseInt(datapoint.label), granularityInMinutes),
    }))

    setUpdatedChartData((prev) => ({
      ...prev,
      data: dataWithLabels,
    }))
  }, [chartData, lookback])

  const keys = updatedChartData.labels?.map((label) => label.key)

  const chartConfig: ChartConfig = updatedChartData.labels.reduce(
    (config, label, index) => {
      config[label.key] = {
        label: label.value,
        color: generateColor(index),
      }
      return config
    },
    {} as ChartConfig
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>FX Comparison</CardTitle>
            <CardDescription>
              {lookbackOptions.find((option) => option.value === lookback)?.label}
            </CardDescription>
          </div>
          <Select
            value={lookback}
            onValueChange={setLookback}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {lookbackOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
  )
}