import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { 
  SensorData, 
  PredictionResponse, 
  SensorWithStatus, 
  formatSensorId, 
  getSensorStatus, 
  sensorThresholds,
  getPrediction,
  formatSensorValue,
  checkApiHealth
} from '@/lib/api';
import { useApiHealthCheck } from '@/hooks/useApi';
import api from '@/lib/api';
import type { ReactNode } from 'react';

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
  children: ReactNode;
}

// Define endpoint to get the last received data from the backend
const LAST_DATA_ENDPOINT = "/latest-prediction";

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [formattedSensors, setFormattedSensors] = useState<SensorWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [enableAlerts, setEnableAlerts] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [pollingInterval, setPollingInterval] = useState<number>(5000); // Poll every 5 seconds to catch changes
  const [previousFaults, setPreviousFaults] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // Use our API health check hook to monitor backend connection
  const apiHealthCheck = useApiHealthCheck({
    refetchInterval: 15000, // Check every 15 seconds
  });
  
  // Set API connection status based on health check
  useEffect(() => {
    setIsApiConnected(apiHealthCheck.data === true);
  }, [apiHealthCheck.data]);

  // Helper to format sensor data into display format
  const formatSensorData = (data: SensorData, prediction: PredictionResponse | null) => {
    const backendFaults = prediction?.sensor_faults || [];
    return Object.entries(data).map(([key, value]) => {
      // Skip algae type as it's not a sensor
      if (key === 'algae_type') return null;
      const { id, name } = formatSensorId(key);
      const threshold = sensorThresholds[key];
      if (!threshold) return null;
      // Only use backend-reported faults for status
      let status: 'normal' | 'warning' | 'fault' = 'normal';
      if (backendFaults.includes(key)) {
        status = 'fault';
      }
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

  // Fetch the latest data from the backend API
  const fetchLatestData = async () => {
    try {
      if (!isApiConnected) {
        throw new Error("API not connected");
      }
      
      // Try to get the latest received data from the backend
      console.log("Fetching latest data from backend...");
      const response = await api.get(LAST_DATA_ENDPOINT);
      
      if (response.data) {
        const { input_data, prediction_result } = response.data;
        
        console.log("Received data from backend:", input_data);
        
        // Update state with received data
        setSensorData(input_data);
        setPrediction(prediction_result);
        setFormattedSensors(formatSensorData(input_data, prediction_result));
        setLastUpdated(new Date());
        
        // Check for faults or anomalies
        checkForNewFaults(
          prediction_result.sensor_faults,
          prediction_result.row_anomaly,
          prediction_result.row_score
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to fetch latest data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Main function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    
    // Get data from the backend API
    const success = await fetchLatestData();
    
    if (!success) {
      // Handle failure to get data
      sonnerToast.error("Failed to get data from the backend", {
        description: "Please check API connection and make sure the simulator is running",
      });
      setIsLoading(false);
    }
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
  }, [isPolling, pollingInterval, isApiConnected]);

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
