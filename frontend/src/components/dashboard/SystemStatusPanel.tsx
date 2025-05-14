
import { useDashboard } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import GaugeChart from "./GaugeChart";
import RadarChart from "./RadarChart";
import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export const SystemStatusPanel = () => {
  const { prediction, isLoading } = useDashboard();
  
  // Format the row top features for the radar chart
  const rowTopFeatures = prediction?.row_top_features
    ? Object.entries(prediction.row_top_features).map(([key, value]) => ({
        feature: key.replace(/_/g, ' '),
        value: value
      }))
    : [];
  
  const hasAnomaly = prediction?.row_anomaly || false;
  const anomalyScore = prediction?.row_score || 0;
  
  // Get system status colors and text
  const getSystemStatusContent = () => {
    if (isLoading) {
      return {
        icon: <AlertTriangleIcon size={24} className="text-gray-500" />,
        title: "Loading...",
        message: "Fetching system status",
        color: "bg-gray-200 dark:bg-gray-700"
      };
    }
    
    if (hasAnomaly) {
      return {
        icon: <AlertTriangleIcon size={24} className="text-red-500" />,
        title: "System Anomaly Detected",
        message: `Anomaly score: ${anomalyScore.toFixed(2)}`,
        color: "bg-red-100 dark:bg-red-950/30"
      };
    }
    
    return {
      icon: <CheckCircleIcon size={24} className="text-green-500" />,
      title: "System Operating Normally",
      message: `Anomaly score: ${anomalyScore.toFixed(2)}`,
      color: "bg-green-100 dark:bg-green-950/30"
    };
  };
  
  const systemStatus = getSystemStatusContent();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "rounded-md p-4 flex flex-col items-center text-center mb-4",
            systemStatus.color
          )}>
            {systemStatus.icon}
            <h3 className="font-bold mt-2">{systemStatus.title}</h3>
            <p className="text-sm text-muted-foreground">{systemStatus.message}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <StatusBadge 
                status={hasAnomaly ? "fault" : "normal"} 
                className="px-3"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sensor Faults</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {prediction?.sensor_faults?.length || 0}
                </span>
                <span className="text-xs text-muted-foreground">detected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monitoring Status</span>
              <StatusBadge status="normal" className="px-3" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-1">
        <GaugeChart
          title="System Anomaly Score"
          value={anomalyScore}
          min={-1}
          max={1}
          thresholds={{ warning: -0.3, danger: -0.6 }}
          reversedColors={true}
          showValue={true}
          height={200}
          format={(val) => val.toFixed(2)}
        />
      </Card>
      
      <Card className="lg:col-span-1">
        <RadarChart
          title="Top Contributing Features"
          data={rowTopFeatures}
          height={200}
          fillColor="rgba(6, 95, 70, 0.5)"
          strokeColor="#065f46"
        />
      </Card>
    </div>
  );
};

export default SystemStatusPanel;
