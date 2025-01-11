import { cn } from "@/lib/utils";

interface RouteTimelineProps {
  stations: Array<{
    name: string;
    arrivalTime: Date;
    isRestStation?: boolean;
  }>;
  restMinutes: number;
}

export default function RouteTimeline({ stations, restMinutes }: RouteTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-3 sm:space-y-4">
        {stations.map((station, idx) => (
          <div key={idx} className="relative pl-8 sm:pl-10">
            <div className={cn(
              "absolute left-[10px] sm:left-[14px] w-2 h-2 rounded-full top-1.5",
              idx === 0 ? "bg-green-500" :
              idx === stations.length - 1 ? "bg-red-500" :
              station.isRestStation ? "bg-orange-500" :
              "bg-gray-400"
            )} />

            <div className="flex justify-between items-center">
              <span className={cn(
                "font-medium text-sm sm:text-base",
                station.isRestStation && "text-orange-600"
              )}>
                {station.name}
              </span>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-gray-600 ml-2">
                  {station.arrivalTime.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </span>
                {station.isRestStation && (
                  <span className="text-xs sm:text-sm text-orange-600 ml-2">
                    （{restMinutes}分休憩）
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}