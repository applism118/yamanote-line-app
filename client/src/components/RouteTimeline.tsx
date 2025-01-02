import { cn } from "@/lib/utils";

interface RouteTimelineProps {
  stations: Array<{
    name: string;
    arrivalTime: Date;
  }>;
}

export default function RouteTimeline({ stations }: RouteTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
      
      <div className="space-y-4">
        {stations.map((station, idx) => (
          <div key={idx} className="relative pl-10">
            <div className={cn(
              "absolute left-[14px] w-2 h-2 rounded-full",
              idx === 0 ? "bg-green-500" :
              idx === stations.length - 1 ? "bg-red-500" :
              "bg-gray-400"
            )} />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">{station.name}</span>
              <span className="text-sm text-gray-600">
                {station.arrivalTime.toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
