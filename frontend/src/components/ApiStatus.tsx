import { useApiHealthCheck } from "../hooks/useApi";

export function ApiStatus() {
  const { data: isHealthy, isLoading, error } = useApiHealthCheck({
    refetchInterval: 30000, // Check every 30 seconds
  });

  if (isLoading) {
    return <div className="text-gray-500">Checking API connection...</div>;
  }

  if (error) {
    return <div className="text-red-500">API connection error: {error.message}</div>;
  }

  return (
    <div className={isHealthy ? "text-green-500" : "text-red-500"}>
      API Status: {isHealthy ? "Connected" : "Disconnected"}
    </div>
  );
}

export default ApiStatus; 