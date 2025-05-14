import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import api from '../lib/api';
import { SensorData, PredictionResponse } from '../lib/api';
import { QueryKey } from '@tanstack/react-query';

/**
 * Hook for checking API health status
 */
export const useApiHealthCheck = (options: Partial<UseQueryOptions<boolean, Error, boolean, QueryKey>> = {}) => {
  return useQuery<boolean, Error, boolean, QueryKey>({
    queryKey: ['apiHealth'],
    queryFn: async () => {
      try {
        const response = await api.get('/health');
        return response.status === 200 && response.data?.status === "healthy";
      } catch (error) {
        console.error('API health check failed:', error);
        return false;
      }
    },
    ...options,
  });
};

/**
 * Hook for getting predictions from the API
 */
export const usePrediction = (
  options?: UseMutationOptions<PredictionResponse, Error, SensorData>
) => {
  return useMutation({
    mutationFn: async (sensorData: SensorData) => {
      const response = await api.post('/predict', sensorData);
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook for fetching historical data
 */
export const useHistoricalData = (
  algaeType: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['historical', algaeType],
    queryFn: async () => {
      const response = await api.get(`/historical/${algaeType}`);
      return response.data;
    },
    enabled: !!algaeType,
    ...options,
  });
}; 