
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SensorWithStatus } from "@/lib/api";
import { SensorIcon } from "./SensorIcon";
import { StatusBadge } from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface SensorCardProps {
  sensor: SensorWithStatus;
  className?: string;
  onClick?: () => void;
}

export const SensorCard: React.FC<SensorCardProps> = ({ 
  sensor, 
  className = "",
  onClick
}) => {
  const { name, value, unit, status, icon } = sensor;
  
  const getStatusBackgroundColor = (): string => {
    switch (status) {
      case "fault":
        return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20";
      case "warning":
        return "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20";
      default:
        return "";
    }
  };
  
  return (
    <Card 
      className={cn(
        "sensor-card hover:shadow-md transition-all cursor-pointer",
        status === "fault" && "fault",
        status === "warning" && "warning",
        getStatusBackgroundColor(),
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <SensorIcon iconName={icon} className="text-muted-foreground" />
          <span>{name}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex">
                <InfoIcon size={14} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Normal range: {name} measurement</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <StatusBadge status={status} showText={false} />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </CardContent>
    </Card>
  );
};
