import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import api from '../lib/api';
import { SensorData, PredictionResponse } from '../lib/api';

/**
 * Hook for checking API health status
 */
export const useApiHealthCheck = (options?: UseQueryOptions<boolean, Error>) => {
  return useQuery({
    queryKey: ['apiHealth'],
    queryFn: async () => {
      try {
        const response = await api.get('/health');
        return response.status === 200;
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