
import { 
  ThermometerIcon, 
  CloudIcon, 
  GaugeIcon,
  CircleIcon,
  PieChartIcon
} from "lucide-react";

interface SensorIconProps {
  iconName?: string;
  className?: string;
  size?: number;
}

export const SensorIcon: React.FC<SensorIconProps> = ({ 
  iconName, 
  className = "", 
  size = 16 
}) => {
  switch (iconName) {
    case "thermometer":
      return <ThermometerIcon className={className} size={size} />;
    case "cloud":
      return <CloudIcon className={className} size={size} />;
    case "gauge":
      return <GaugeIcon className={className} size={size} />;
    case "pie-chart":
      return <PieChartIcon className={className} size={size} />;
    default:
      return <CircleIcon className={className} size={size} />;
  }
};

export default SensorIcon;
