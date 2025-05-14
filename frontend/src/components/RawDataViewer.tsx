import { useDashboard } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function RawDataViewer() {
  const { 
    sensorData, 
    prediction, 
    refreshData, 
    isLoading, 
    lastUpdated 
  } = useDashboard();

  // Format date for display
  const formattedDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleString() 
    : "Never";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Raw API Data</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {formattedDate}
          </span>
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