
import { useState } from 'react';
import { useDashboard } from "@/context/DashboardContext";
import { SensorCard } from "./SensorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./BarChart";
import { getSensorDisplayName } from "@/lib/api";

export const SensorPanel = () => {
  const { formattedSensors, prediction } = useDashboard();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  
  // Find the first faulty sensor to show its explanation by default
  const faultySensorId = prediction?.sensor_faults?.[0] || null;
  
  // Actually selected sensor (default to first faulty sensor if none selected)
  const effectiveSelectedSensor = selectedSensor || faultySensorId;
  
  // Get explanations for the selected sensor
  const sensorExplanations = effectiveSelectedSensor && prediction?.sensor_explanations 
    ? prediction.sensor_explanations[effectiveSelectedSensor]
    : null;
  
  // Format explanations for the chart
  const explanationData = sensorExplanations 
    ? Object.entries(sensorExplanations).map(([key, value]) => ({
        name: getSensorDisplayName(key),
        value: value
      }))
    : [];
  
  // Filter sensors to show faulty ones first
  const sortedSensors = [...formattedSensors].sort((a, b) => {
    // First by status (fault > warning > normal)
    const statusOrder = { fault: 0, warning: 1, normal: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  
  // Count sensors by status
  const sensorStatusCounts = sortedSensors.reduce(
    (acc, sensor) => {
      acc[sensor.status]++;
      return acc;
    },
    { normal: 0, warning: 0, fault: 0 }
  );
    
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Card className="grow p-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-sensor-normal"></span>
              <span className="text-sm">Normal: {sensorStatusCounts.normal}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-sensor-warning"></span>
              <span className="text-sm">Warning: {sensorStatusCounts.warning}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-sensor-fault"></span>
              <span className="text-sm">Fault: {sensorStatusCounts.fault}</span>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedSensors.map((sensor) => (
            <SensorCard 
              key={sensor.id} 
              sensor={sensor}
              onClick={() => setSelectedSensor(sensor.id)} 
              className={
                effectiveSelectedSensor === sensor.id 
                  ? "ring-2 ring-primary" 
                  : ""
              }
            />
          ))}
        </div>
        
        {effectiveSelectedSensor && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Sensor Fault Explanation: {getSensorDisplayName(effectiveSelectedSensor)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {explanationData.length > 0 ? (
                <BarChart
                  data={explanationData}
                  title="Contributing Factors"
                  height={300}
                  layout="vertical"
                  sortData={true}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No explanation data available for this sensor
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SensorPanel;
