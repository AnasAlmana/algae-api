
import { cn } from "@/lib/utils";

type StatusType = "normal" | "warning" | "fault" | "loading";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showText?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = "",
  showText = true
}) => {
  const statusConfig = {
    normal: {
      bg: "bg-sensor-normal",
      text: "Normal",
      icon: "✅"
    },
    warning: {
      bg: "bg-sensor-warning",
      text: "Warning",
      icon: "⚠️"
    },
    fault: {
      bg: "bg-sensor-fault",
      text: "Fault",
      icon: "❌"
    },
    loading: {
      bg: "bg-gray-300 dark:bg-gray-600",
      text: "Loading",
      icon: "⏳"
    }
  };

  const config = statusConfig[status];
  
  return (
    <div className={cn(
      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white",
      config.bg,
      className
    )}>
      {showText ? (
        <>
          <span className="h-2 w-2 rounded-full bg-white/80"></span>
          <span>{config.text}</span>
        </>
      ) : (
        <span className="mx-auto h-2 w-2 rounded-full bg-white/80"></span>
      )}
    </div>
  );
};

export default StatusBadge;
