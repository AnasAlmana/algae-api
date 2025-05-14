import axios from "axios";
import { toast } from "sonner";

// Create an axios instance with a base URL pointing to the backend API
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log errors or handle them globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Interface for sensor input data
export interface SensorData {
  algae_type: string;
  temperature_C: number;
  "humidity_%": number;
  pH: number;
  light_intensity_umol_m2_s: number;
  light_intensity_lux: number;
  water_level_cm: number;
  dissolved_oxygen_mg_per_L: number;
  conductivity_uS_cm: number;
  turbidity_NTU: number;
  chlorophyll_a_ug_per_L: number;
  CO2_flow_rate_mL_per_min: number;
  aeration_rate_L_per_min: number;
  optical_density_680nm: number;
  photosynthetic_efficiency_pct: number;
  biomass_concentration_g_per_L: number;
  nitrate_mg_per_L: number;
  phosphate_mg_per_L: number;
  ammonium_mg_per_L: number;
}

// Interface for API prediction response
export interface PredictionResponse {
  sensor_faults: string[];
  sensor_explanations: {
    [key: string]: { [key: string]: number };
  };
  row_anomaly: boolean;
  row_score: number;
  row_top_features: {
    [key: string]: number;
  };
}

// Type for tracking sensor status
export type SensorStatus = "normal" | "warning" | "fault";

// Structure for managing sensor thresholds
export interface SensorThresholds {
  min: number;
  warningMin?: number;
  warningMax?: number;
  max: number;
  unit: string;
  icon?: string;
}

// Combined sensor data with status
export interface SensorWithStatus {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: SensorStatus;
  icon?: string;
  timestamp?: Date;
}

// Check API health
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get("/health");
    return response.status === 200 && response.data?.status === "healthy";
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Get predictions from the API
export const getPrediction = async (sensorData: SensorData): Promise<PredictionResponse> => {
  try {
    const response = await api.post("/predict", sensorData);
    return response.data;
  } catch (error) {
    console.error("Failed to get prediction:", error);
    toast.error("Failed to get prediction data");
    throw error;
  }
};

// Determine sensor status based on thresholds
export const getSensorStatus = (
  value: number, 
  thresholds: SensorThresholds,
  faults: string[] = []
): SensorStatus => {
  // If the sensor is in the fault list, return fault
  if (faults.includes(String(value))) return "fault";
  
  // Check warning thresholds
  const { min, warningMin, warningMax, max } = thresholds;
  
  if (value < min || value > max) return "fault";
  if (
    (warningMin !== undefined && value < warningMin) ||
    (warningMax !== undefined && value > warningMax)
  ) return "warning";
  
  return "normal";
};

// Mock data generation for demonstration
export const generateMockSensorData = (): SensorData => {
  console.warn("Mock data generation should not be used in production");
  // Return empty object with required structure
  return {
    algae_type: "unknown",
    temperature_C: 0,
    "humidity_%": 0,
    pH: 0,
    light_intensity_umol_m2_s: 0,
    light_intensity_lux: 0,
    water_level_cm: 0,
    dissolved_oxygen_mg_per_L: 0,
    conductivity_uS_cm: 0,
    turbidity_NTU: 0,
    chlorophyll_a_ug_per_L: 0,
    CO2_flow_rate_mL_per_min: 0,
    aeration_rate_L_per_min: 0,
    optical_density_680nm: 0,
    photosynthetic_efficiency_pct: 0,
    biomass_concentration_g_per_L: 0,
    nitrate_mg_per_L: 0,
    phosphate_mg_per_L: 0,
    ammonium_mg_per_L: 0
  } as SensorData;
};

// Sensor thresholds for each sensor type
export const sensorThresholds: Record<string, SensorThresholds> = {
  temperature_C: {
    min: 15,
    warningMin: 18,
    warningMax: 30,
    max: 35,
    unit: "°C",
    icon: "thermometer"
  },
  "humidity_%": {
    min: 50,
    warningMin: 55,
    warningMax: 75,
    max: 85,
    unit: "%",
    icon: "cloud"
  },
  pH: {
    min: 6.0,
    warningMin: 6.5,
    warningMax: 7.5,
    max: 8.0,
    unit: "pH",
    icon: "gauge"
  },
  light_intensity_umol_m2_s: {
    min: 500,
    warningMin: 800,
    warningMax: 1500,
    max: 2000,
    unit: "μmol/m²/s",
    icon: "circle"
  },
  light_intensity_lux: {
    min: 5000,
    warningMin: 8000,
    warningMax: 25000,
    max: 30000,
    unit: "lux",
    icon: "circle"
  },
  water_level_cm: {
    min: 30,
    warningMin: 35,
    warningMax: 55,
    max: 60,
    unit: "cm",
    icon: "gauge"
  },
  dissolved_oxygen_mg_per_L: {
    min: 5,
    warningMin: 6,
    warningMax: 12,
    max: 15,
    unit: "mg/L",
    icon: "cloud"
  },
  conductivity_uS_cm: {
    min: 400,
    warningMin: 450,
    warningMax: 750,
    max: 800,
    unit: "μS/cm",
    icon: "gauge"
  },
  turbidity_NTU: {
    min: 0.5,
    warningMin: 0.8,
    warningMax: 5,
    max: 8,
    unit: "NTU",
    icon: "gauge"
  },
  chlorophyll_a_ug_per_L: {
    min: 20,
    warningMin: 25,
    warningMax: 60,
    max: 80,
    unit: "μg/L",
    icon: "pie-chart"
  },
  CO2_flow_rate_mL_per_min: {
    min: 50,
    warningMin: 60,
    warningMax: 120,
    max: 140,
    unit: "mL/min",
    icon: "gauge"
  },
  aeration_rate_L_per_min: {
    min: 1,
    warningMin: 1.2,
    warningMax: 3,
    max: 4,
    unit: "L/min",
    icon: "circle"
  },
  optical_density_680nm: {
    min: 0.4,
    warningMin: 0.5,
    warningMax: 1.2,
    max: 1.5,
    unit: "OD",
    icon: "pie-chart"
  },
  photosynthetic_efficiency_pct: {
    min: 15,
    warningMin: 18,
    warningMax: 35,
    max: 40,
    unit: "%",
    icon: "pie-chart"
  },
  biomass_concentration_g_per_L: {
    min: 1.5,
    warningMin: 2,
    warningMax: 5,
    max: 6,
    unit: "g/L",
    icon: "gauge"
  },
  nitrate_mg_per_L: {
    min: 2,
    warningMin: 3,
    warningMax: 8,
    max: 10,
    unit: "mg/L",
    icon: "gauge"
  },
  phosphate_mg_per_L: {
    min: 0.2,
    warningMin: 0.3,
    warningMax: 1.2,
    max: 1.5,
    unit: "mg/L",
    icon: "gauge"
  },
  ammonium_mg_per_L: {
    min: 0.1,
    warningMin: 0.5,
    warningMax: 2,
    max: 3,
    unit: "mg/L",
    icon: "gauge"
  }
};

// Format sensor data for display
export const formatSensorId = (id: string): { id: string; name: string } => {
  // Handle special case for humidity
  if (id === "humidity_%") {
    return { id, name: "Humidity" };
  }
  
  // Convert snake_case to Title Case with units
  const parts = id.split('_');
  const name = parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace(/_/g, ' ');
    
  return { id, name };
};

// Function to format sensor values according to their type
export const formatSensorValue = (id: string, value: number): string => {
  // Format numbers based on their typical precision requirements
  if (id === 'pH') return value.toFixed(1);
  if (id === 'optical_density_680nm') return value.toFixed(2);
  
  // Default formatting for other numeric values
  return value.toFixed(1);
};

// Get display name for sensor with proper formatting
export const getSensorDisplayName = (sensorKey: string): string => {
  const { name } = formatSensorId(sensorKey);
  return name;
};

export default api;
