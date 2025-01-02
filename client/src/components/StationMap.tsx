import { type Station } from "../lib/stations";
import { cn } from "@/lib/utils";

interface StationMapProps {
  stations: Station[];
  selectedFrom?: string;
  selectedTo?: string;
  intermediateStations?: string[];
  onSelectStation: (stationName: string) => void;
}

export default function StationMap({ 
  stations, 
  selectedFrom,
  selectedTo,
  intermediateStations = [],
  onSelectStation 
}: StationMapProps) {
  const radius = 160; // SVG circle radius
  const center = 200; // Center point of the SVG

  // Special positioning adjustments for specific stations
  const stationAdjustments: Record<string, { dx?: number; dy?: number }> = {
    "高田馬場": { dy: -8 },
    "新大久保": { dy: 8 },
    "新宿": { dx: -12 },
    "品川": { dx: 12 },
    "高輪ゲートウェイ": { dx: 24 },
    "大崎": { dx: 12, dy: 4 },
    "渋谷": { dx: -12 },
    "池袋": { dy: -8 }
  };

  return (
    <div className="space-y-4">
      <div className="w-full aspect-square max-w-[400px] mx-auto">
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full"
        >
          {/* Circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="20"
            className="opacity-20"
          />

          {/* Station dots and labels */}
          {stations.map((station, idx) => {
            const angle = (idx * 360) / stations.length;
            const radian = (angle - 90) * (Math.PI / 180);
            const x = center + radius * Math.cos(radian);
            const y = center + radius * Math.sin(radian);

            const isFrom = station.name === selectedFrom;
            const isTo = station.name === selectedTo;
            const isIntermediate = intermediateStations.includes(station.name);

            // Get special positioning adjustments for this station
            const adjustment = stationAdjustments[station.name] || {};
            const baseOffset = 32; // Increased base offset for better spacing
            const finalDx = (adjustment.dx || 0) + (x > center ? baseOffset : -baseOffset);
            const finalDy = adjustment.dy || 0;

            return (
              <g key={station.name} onClick={() => onSelectStation(station.name)}>
                {/* Station dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className={cn(
                    "cursor-pointer transition-colors",
                    isFrom 
                      ? "fill-blue-500 stroke-blue-500" 
                      : isTo
                        ? "fill-red-500 stroke-red-500"
                        : isIntermediate
                          ? "fill-green-700 stroke-green-700"
                          : "fill-white stroke-gray-400 hover:fill-gray-100"
                  )}
                  strokeWidth="2"
                />

                {/* Station name */}
                <text
                  x={x}
                  y={y}
                  dx={finalDx}
                  dy={finalDy}
                  textAnchor={x > center ? "start" : "end"}
                  className={cn(
                    "text-[10px] cursor-pointer select-none",
                    isFrom && "fill-blue-500 font-medium",
                    isTo && "fill-red-500 font-medium",
                    isIntermediate && "fill-green-700 font-medium"
                  )}
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected stations display */}
      <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>出発駅: {selectedFrom || "未選択"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>到着駅: {selectedTo || "未選択"}</span>
        </div>
      </div>
    </div>
  );
}