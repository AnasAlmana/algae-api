import { DashboardProvider } from "@/context/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SystemStatusPanel from "@/components/dashboard/SystemStatusPanel";
import SensorPanel from "@/components/dashboard/SensorPanel";
import SensorForm from "@/components/SensorForm";
import { ThemeProvider } from "@/hooks/use-theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="algae-monitoring-theme">
      <DashboardProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <DashboardHeader />
          
          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            <SystemStatusPanel />
            
            <Tabs defaultValue="sensors" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sensors">Real-time Sensors</TabsTrigger>
                <TabsTrigger value="history">Historical Data</TabsTrigger>
                <TabsTrigger value="controls">System Controls</TabsTrigger>
                <TabsTrigger value="api-test">API Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sensors" className="space-y-4">
                <SensorPanel />
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Historical data visualization coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="controls">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        System control panel coming soon (view-only)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api-test">
                <div className="flex justify-center">
                  <SensorForm />
                </div>
              </TabsContent>
            </Tabs>
          </main>
          
          <footer className="border-t py-4 px-4 text-center text-sm text-muted-foreground">
            <p>Algae Cultivation Monitoring System — © 2025</p>
          </footer>
        </div>
      </DashboardProvider>
    </ThemeProvider>
  );
};

export default Index;
