
import React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  className?: string;
  height?: number;
  sortData?: boolean;
  layout?: 'vertical' | 'horizontal';
  showValues?: boolean;
  maxItems?: number;
  colorScale?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  className = "",
  height = 250,
  sortData = true,
  layout = 'horizontal',
  showValues = true,
  maxItems = 10,
  colorScale = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b']
}) => {
  // Process the data
  let processedData = [...data];
  
  // Sort by value if required
  if (sortData) {
    processedData.sort((a, b) => b.value - a.value);
  }
  
  // Limit number of items
  if (processedData.length > maxItems) {
    processedData = processedData.slice(0, maxItems);
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-2 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
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
      <CardContent className="p-1 pt-2">
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={processedData}
              layout={layout}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {layout === 'horizontal' ? (
                <>
                  <XAxis dataKey="name" />
                  <YAxis />
                </>
              ) : (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#8884d8"
                label={showValues ? {
                  position: layout === 'horizontal' ? 'top' : 'right',
                  formatter: (value: number) => value.toFixed(2)
                } : false}
              >
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorScale[index % colorScale.length]} 
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
