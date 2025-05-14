import { useState } from "react";
import { usePrediction } from "../hooks/useApi";
import { SensorData, generateMockSensorData } from "../lib/api";
import { Button } from "./ui/button"; 
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { toast } from "sonner";

export function SensorForm() {
  const [sensorData, setSensorData] = useState<SensorData>(generateMockSensorData());
  
  const prediction = usePrediction({
    onSuccess: (data) => {
      toast.success("Prediction received from API");
      console.log("API Response:", data);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    prediction.mutate(sensorData);
  };

  const handleGenerate = () => {
    setSensorData(generateMockSensorData());
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Submit Sensor Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Algae Type</label>
                <select 
                  className="p-2 border rounded"
                  value={sensorData.algae_type}
                  onChange={(e) => setSensorData({...sensorData, algae_type: e.target.value})}
                >
                  <option value="Chlorella">Chlorella</option>
                  <option value="Spirulina">Spirulina</option>
                  <option value="Haematococcus">Haematococcus</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium">Temperature (°C)</label>
                <input 
                  className="p-2 border rounded"
                  type="number" 
                  value={sensorData.temperature_C}
                  onChange={(e) => setSensorData({...sensorData, temperature_C: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Using mock data for demonstration. In a real application, all sensor fields would be editable.
            </div>

            {prediction.isPending && <div className="text-blue-500">Submitting to API...</div>}
            {prediction.isError && <div className="text-red-500">Error: {prediction.error.message}</div>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleGenerate}
          disabled={prediction.isPending}
        >
          Generate New Data
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={prediction.isPending}
        >
          Submit to API
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SensorForm; 