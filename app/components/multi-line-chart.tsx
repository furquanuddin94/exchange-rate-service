"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getTimeLabel } from "@/app/utils/chartUtils"
import { TimeSeriesData } from "@/app/utils/fxTimeSeriesDb"
import { CurrencyContext } from "./CurrencyContext";

type ChartDataPoint = {
  label: string
  [key: string]: string | number
}

type ChartData = {
  data: ChartDataPoint[]
  labels: { key: string; value: string }[]
}

type CustomLegendItemProps = {
  color: string
  label: ReactNode
  onClick: () => void
  isVisible: boolean
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

const CustomLegendItem: React.FC<CustomLegendItemProps> = ({ color, label, onClick, isVisible }) => (
  <div
    onClick={onClick}
    style={{
      cursor: 'pointer',
      opacity: isVisible ? 1 : 0.5,
      display: 'flex',
      alignItems: 'center',
      marginRight: '0.5rem',
    }}
  >
    <div
      style={{
        width: '10px',  // Slightly smaller box size
        height: '10px',
        backgroundColor: color,
        marginRight: '0.25rem'  // Reduced margin between color box and label
      }}
    />
    <span>{label}</span>
  </div>
);

type SourceData = {
  source: string;
  data: TimeSeriesData[];
}

interface MultiLineChartProps {
  allSourceData: SourceData[]
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ allSourceData }) => {

  const [lookback, setLookback] = useState<string>("24")
  const [updatedChartData, setUpdatedChartData] = useState<ChartData | null>()
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>({})

  const { fromCurrency, toCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    const lookbackInHours = parseInt(lookback)
    const dataPoints = 8
    const granularity = (lookbackInHours * 60 * 60 * 1000) / dataPoints

    const currentDateTime = new Date();
    const timeZoneOffset = currentDateTime.getTimezoneOffset() * 60 * 1000;

    const accumulatedData: { [roundedTimestamp: number]: any } = {};

    allSourceData.forEach((sourceData) => {
      sourceData.data.forEach((dataPoint) => {
        if (currentDateTime.getTime() - dataPoint.timestamp > (lookbackInHours) * 60 * 60 * 1000) {
          return;
        }

        const localTime = dataPoint.timestamp - timeZoneOffset;
        const roundedlocalTime = Math.floor(localTime / granularity) * granularity;
        const epochTime = roundedlocalTime + timeZoneOffset;

        if (!accumulatedData[epochTime]) {
          accumulatedData[epochTime] = { label: '', fxRates: {} };
        }

        accumulatedData[epochTime].fxRates[sourceData.source] = Math.max(
          accumulatedData[epochTime].fxRates[sourceData.source] || 0,
          parseFloat(dataPoint.fxRate.toFixed(4))
        );
      });
    });

    const sortedDataPoints: ChartDataPoint[] = Object.keys(accumulatedData)
      .map(Number)
      .sort((a, b) => a - b)
      .map((epochTime) => {
        const label = getTimeLabel(epochTime, granularity / (60 * 1000));
        return {
          label: label,
          ...accumulatedData[epochTime].fxRates
        };
      });

    const labels = allSourceData.map((sourceData) => sourceData.source);

    setUpdatedChartData({
      data: sortedDataPoints,
      labels: labels.map((label) => ({ key: label, value: label }))
    });
  }, [lookback, allSourceData]);

  useEffect(() => {
    if (updatedChartData) {
      const initialVisibility = updatedChartData.labels.reduce((acc, label) => {
        acc[label.key] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setVisibleLines(initialVisibility);
    }
  }, [updatedChartData]);

  if (!updatedChartData) {
    return null;
  }

  const keys = updatedChartData.labels.map((label) => label.key);

  const chartConfig: ChartConfig = updatedChartData.labels.reduce(
    (config, label, index) => {
      config[label.key] = {
        label: label.value,
        color: generateColor(index),
      }
      return config;
    },
    {} as ChartConfig
  );

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegendContent: React.FC = () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        marginTop: '1rem',
      }}
    >
      {Object.entries(chartConfig).map(([key, config]) => (
        <CustomLegendItem
          key={key}
          label={config.label}
          color={config.color as string}
          onClick={() => handleLegendClick(key)}
          isVisible={visibleLines[key]}
        />
      ))}
    </div>
  );

  // Check if the currencies are 'THB' and 'INR'
  if (fromCurrency !== 'THB' || toCurrency !== 'INR') {
    return null; // Return nothing if currencies are not 'THB' and 'INR'
  }

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
            <YAxis type="number" domain={['auto', 'auto']} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(tick) => tick.toFixed(4)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<CustomLegendContent />} />
            {keys.map((key) => (
              visibleLines[key] && (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig[key].color}
                  strokeWidth={2}
                  dot={false}
                />
              )
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default MultiLineChart;