import { useDashboard } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RawDataViewer() {
  const { 
    sensorData, 
    prediction, 
    refreshData, 
    isLoading, 
    lastUpdated,
    pollingInterval,
    setPollingInterval,
    isPolling,
    setIsPolling
  } = useDashboard();

  // Format date for display
  const formattedDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleString() 
    : "Never";

  // Handle polling interval change
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1000) { // Minimum 1 second
      setPollingInterval(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Raw API Data</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="polling-interval" className="text-sm">Polling Interval (ms):</Label>
            <Input
              id="polling-interval"
              type="number"
              value={pollingInterval}
              onChange={handleIntervalChange}
              min={1000}
              step={1000}
              className="w-32"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPolling(!isPolling)}
          >
            {isPolling ? "Stop Polling" : "Start Polling"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Data Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            {sensorData ? (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                {JSON.stringify(sensorData, null, 2)}
              </pre>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prediction Results Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                {JSON.stringify(prediction, null, 2)}
              </pre>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No prediction available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RawDataViewer; 