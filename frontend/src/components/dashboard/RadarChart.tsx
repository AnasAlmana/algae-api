
import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RadarChartData {
  feature: string;
  value: number;
}

interface RadarChartProps {
  data: RadarChartData[];
  title: string;
  className?: string;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  maxItems?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  className = "",
  height = 300,
  fillColor = "rgba(6, 95, 70, 0.5)",
  strokeColor = "#065f46",
  maxItems = 6
}) => {
  // Process the data
  let processedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-2 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].payload.feature}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium">{payload[0].value.toFixed(3)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart 
              outerRadius="80%" 
              data={processedData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="feature" />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Features"
                dataKey="value"
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.6}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarChart;
