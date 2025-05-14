
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { 
  SensorData, 
  PredictionResponse, 
  SensorWithStatus, 
  formatSensorId, 
  getSensorStatus, 
  sensorThresholds,
  generateMockSensorData,
  getPrediction,
  formatSensorValue
} from '@/lib/api';

interface DashboardContextType {
  sensorData: SensorData | null;
  prediction: PredictionResponse | null;
  formattedSensors: SensorWithStatus[];
  isLoading: boolean;
  isApiConnected: boolean;
  lastUpdated: Date | null;
  enableAlerts: boolean;
  setEnableAlerts: (enable: boolean) => void;
  refreshData: () => Promise<void>;
  isPolling: boolean;
  setIsPolling: (isPolling: boolean) => void;
  pollingInterval: number;
  setPollingInterval: (interval: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [formattedSensors, setFormattedSensors] = useState<SensorWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(true); // Assume connected initially
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [enableAlerts, setEnableAlerts] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [pollingInterval, setPollingInterval] = useState<number>(30000); // 30 seconds default
  const [previousFaults, setPreviousFaults] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Helper to format sensor data into display format
  const formatSensorData = (data: SensorData, prediction: PredictionResponse | null) => {
    return Object.entries(data).map(([key, value]) => {
      // Skip algae type as it's not a sensor
      if (key === 'algae_type') return null;
      
      const { id, name } = formatSensorId(key);
      const threshold = sensorThresholds[key];
      
      if (!threshold) return null;
      
      const faults = prediction?.sensor_faults || [];
      const status = getSensorStatus(
        value as number, 
        threshold, 
        faults
      );
      
      return {
        id: key,
        name,
        value: value as number,
        unit: threshold.unit,
        status,
        icon: threshold.icon
      };
    }).filter(Boolean) as SensorWithStatus[];
  };

  // Check for newly detected faults and trigger notifications
  const checkForNewFaults = (
    currentFaults: string[], 
    isAnomalous: boolean, 
    anomalyScore: number
  ) => {
    if (!enableAlerts) return;

    // Check for new sensor faults
    const newFaults = currentFaults.filter(fault => !previousFaults.includes(fault));
    
    if (newFaults.length > 0) {
      const faultsList = newFaults.map(fault => formatSensorId(fault).name).join(', ');
      sonnerToast.error(`New sensor fault detected: ${faultsList}`, {
        description: "Please check the sensor details panel",
      });
    }
    
    // Check for new system anomaly
    const isNewAnomaly = isAnomalous && 
      (prediction === null || prediction.row_anomaly === false);
      
    if (isNewAnomaly) {
      sonnerToast.warning(`System anomaly detected (Score: ${anomalyScore.toFixed(2)})`, {
        description: "Critical system parameters are outside normal ranges",
      });
    }
    
    // Update previous faults for next comparison
    setPreviousFaults(currentFaults);
  };

  // Process and update data
  const processData = async (data: SensorData) => {
    try {
      // Make API request in a try-catch to handle network issues
      const predictionResult = await getPrediction(data);
      
      // Check for new faults or anomalies
      checkForNewFaults(
        predictionResult.sensor_faults,
        predictionResult.row_anomaly,
        predictionResult.row_score
      );
      
      // Update state with new data
      setSensorData(data);
      setPrediction(predictionResult);
      setFormattedSensors(formatSensorData(data, predictionResult));
      setLastUpdated(new Date());
      setIsApiConnected(true);
      
    } catch (error) {
      console.error("Failed to process data:", error);
      setIsApiConnected(false);
      
      // Still update the UI with the sensor data we have, marking API as disconnected
      setSensorData(data);
      setFormattedSensors(formatSensorData(data, null));
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Main function to refresh data (both automatic and manual)
  const refreshData = async () => {
    setIsLoading(true);
    
    // Generate mock data since we don't have a real API to connect to
    const mockData = generateMockSensorData();
    
    await processData(mockData);
  };

  // Set up automatic polling
  useEffect(() => {
    if (!isPolling) return;
    
    // Initial data load
    refreshData();
    
    // Set up polling interval
    const intervalId = setInterval(() => {
      refreshData();
    }, pollingInterval);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [isPolling, pollingInterval]);

  const value = {
    sensorData,
    prediction,
    formattedSensors,
    isLoading,
    isApiConnected,
    lastUpdated,
    enableAlerts,
    setEnableAlerts,
    refreshData,
    isPolling,
    setIsPolling,
    pollingInterval,
    setPollingInterval,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
