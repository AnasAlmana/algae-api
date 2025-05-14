
import { useDashboard } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon, BellIcon, BellOffIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ModeToggle";

export const DashboardHeader = () => {
  const { 
    isLoading, 
    isApiConnected,
    lastUpdated,
    refreshData,
    enableAlerts,
    setEnableAlerts,
    isPolling,
    setIsPolling,
    pollingInterval,
    setPollingInterval
  } = useDashboard();
  
  // Format the last updated time
  const formattedTime = lastUpdated ? new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(lastUpdated) : 'Never';
  
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-algae-primary">🧪</span>
              <span>Algae Cultivation Monitoring</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time bioreactor data and anomaly detection
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-sm">
              {isApiConnected ? (
                <div className="flex items-center gap-2">
                  <span className="pulsing-dot bg-sensor-normal"></span>
                  <span>API Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="pulsing-dot bg-sensor-fault"></span>
                  <span>API Disconnected</span>
                </div>
              )}
            </div>

            <div className="text-sm flex items-center gap-2">
              <span>Polling:</span>
              <Switch 
                checked={isPolling}
                onCheckedChange={setIsPolling}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Interval:</span>
              <Select
                value={pollingInterval.toString()}
                onValueChange={(val) => setPollingInterval(parseInt(val))}
                disabled={!isPolling}
              >
                <SelectTrigger className="w-[110px] h-8">
                  <SelectValue placeholder="30s" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">10s</SelectItem>
                  <SelectItem value="30000">30s</SelectItem>
                  <SelectItem value="60000">60s</SelectItem>
                  <SelectItem value="300000">5min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="gap-1.5"
                onClick={() => refreshData()}
                disabled={isLoading}
              >
                <RefreshCcwIcon size={16} className={isLoading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setEnableAlerts(!enableAlerts)}
              >
                {enableAlerts ? (
                  <>
                    <BellIcon size={16} />
                    <span>Alerts On</span>
                  </>
                ) : (
                  <>
                    <BellOffIcon size={16} />
                    <span>Alerts Off</span>
                  </>
                )}
              </Button>
              
              <ModeToggle />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">
            Last updated: {formattedTime}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
