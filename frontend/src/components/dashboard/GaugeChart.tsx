
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title: string;
  format?: (value: number) => string;
  thresholds?: {
    warning: number;
    danger: number;
  };
  className?: string;
  showValue?: boolean;
  height?: number;
  units?: string;
  reversedColors?: boolean;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  title,
  format = (val) => val.toFixed(2),
  thresholds = { warning: -0.3, danger: -0.6 },
  className = "",
  showValue = true,
  height = 150,
  units = "",
  reversedColors = false,
}) => {
  // Calculate the percentage of the value within the range
  const calculatePercent = () => {
    const percent = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const percent = calculatePercent();
  
  // Determine color based on thresholds
  const getColor = () => {
    if (reversedColors) {
      if (percent < thresholds.danger) return 'var(--sensor-normal)';
      if (percent < thresholds.warning) return 'var(--sensor-warning)';
      return 'var(--sensor-fault)';
    } else {
      if (percent > thresholds.danger) return 'var(--sensor-fault)';
      if (percent > thresholds.warning) return 'var(--sensor-warning)';
      return 'var(--sensor-normal)';
    }
  };

  // Calculate the rotation angle for the needle (from -90 to 90 degrees)
  const needleRotation = -90 + (180 * percent / 100);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative" style={{ height: `${height}px` }}>
          {/* The gauge arc background */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <svg width="100%" height={height} viewBox={`0 0 200 ${height}`}>
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  {reversedColors ? (
                    <>
                      <stop offset="0%" stopColor="var(--sensor-fault)" />
                      <stop offset="50%" stopColor="var(--sensor-warning)" />
                      <stop offset="100%" stopColor="var(--sensor-normal)" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="var(--sensor-normal)" />
                      <stop offset="50%" stopColor="var(--sensor-warning)" />
                      <stop offset="100%" stopColor="var(--sensor-fault)" />
                    </>
                  )}
                </linearGradient>
              </defs>
              
              {/* The gauge background arc */}
              <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="hsl(var(--muted))" 
                strokeWidth="6"
              />
              
              {/* The gauge filled arc */}
              <path 
                d={`M 20 100 A 80 80 0 0 1 ${20 + (160 * percent / 100)} 100`}
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
              
              {/* The gauge needle */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="40"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                transform={`rotate(${needleRotation}, 100, 100)`}
              />
              
              {/* The gauge needle center */}
              <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
              
              {/* Ticks for min, max and current value */}
              <text x="20" y="115" fontSize="10" textAnchor="middle" fill="currentColor">{format(min)}</text>
              <text x="180" y="115" fontSize="10" textAnchor="middle" fill="currentColor">{format(max)}</text>
            </svg>
          </div>
          
          {/* Current value display */}
          {showValue && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold">{format(value)}{units}</div>
                <div className="text-xs text-muted-foreground">Current Value</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GaugeChart;
