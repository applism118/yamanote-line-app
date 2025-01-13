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
  const radius = 180; // SVG circle radius
  const center = 250; // Center point of the SVG

  // Calculate positions for all stations
  const stationPositions = stations.map((station, idx) => {
    const angle = (idx * 360) / stations.length;
    const radian = (angle - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(radian);
    const y = center + radius * Math.sin(radian);
    return { station, x, y, angle };
  });

  // Calculate min and max distances for color scaling
  const distances = stations.map(s => s.nextDistance);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  // Function to calculate color intensity based on distance
  const getPathColor = (distance: number) => {
    const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);
    const baseOpacity = 0.2; // minimum opacity
    const opacity = baseOpacity + (normalizedDistance * 0.8); // scale from baseOpacity to 1
    return `rgba(34, 197, 94, ${opacity})`; // rgb(22, 163, 74) is green-600
  };

  // Generate path segments between stations
  const pathSegments = stationPositions.map((pos, idx) => {
    const nextIdx = (idx + 1) % stationPositions.length;
    const nextPos = stationPositions[nextIdx];
    const distance = stations[idx].nextDistance;

    const path = `M ${pos.x} ${pos.y} A ${radius} ${radius} 0 0 1 ${nextPos.x} ${nextPos.y}`;
    return { path, distance };
  });

  // Truncate station name if longer than 4 characters
  const truncateStationName = (name: string) => {
    return name.length > 4 ? `${name.slice(0, 4)}…` : name;
  };

  // Find rest stations (every 5th station) in the route
  const getRestStations = () => {
    if (!selectedFrom || !selectedTo) return [];
    const fromIdx = stations.findIndex(s => s.name === selectedFrom);
    const toIdx = stations.findIndex(s => s.name === selectedTo);
    if (fromIdx === -1 || toIdx === -1) return [];

    let currentIdx = fromIdx;
    let count = 0;
    const routeStations = [];

    while (currentIdx !== toIdx && count < stations.length) {
      routeStations.push(stations[currentIdx].name);
      currentIdx = (currentIdx + 1) % stations.length;
      count++;
    }
    routeStations.push(stations[toIdx].name);

    return routeStations
      .filter((_, index) => (index + 1) % 5 === 0)
      .filter((_, index) => index < Math.floor(routeStations.length / 5));
  };

  const restStations = getRestStations();

  // Special positioning adjustments for specific stations
  const stationAdjustments: Record<string, { dx?: number; dy?: number; anchor?: string }> = {
    "池袋": { dy: -20, anchor: "middle" },
    "大塚": { dy: -20, anchor: "middle" },
    "巣鴨": { dy: -20, anchor: "middle" },
    "目白": { dy: -20, anchor: "middle" },
    "浜松町": { dy: 30, anchor: "middle" },
    "高輪ゲートウェイ": { dy: 30, anchor: "middle" },
    "田町": { dy: 30, anchor: "middle" },
    "新橋": { dy: 30, anchor: "middle" },
    "有楽町": { dy: 30, anchor: "middle" },
    "品川": { dy: 25, dx: 0, anchor: "middle" },  // 緑のラインより下に配置
    "東京": { dy: 30, anchor: "middle" },
    "神田": { dy: 25, dx: 0, anchor: "middle" },  // 緑のラインより下に配置
    "新宿": { dx: -15 },  // 円周から離す
    "渋谷": { dx: -15 },  // 円周から離す
    "高田馬場": { dy: -20 },
    "新大久保": { dy: -15 },
    "大崎": { dx: 8, dy: 30 },
    "駒込": { dy: -15 },
    "秋葉原": { dy: 15 },  // 下方向に移動
    "五反田": { dy: 15 }   // 下方向に移動
  };

  return (
    <div className="space-y-4">
      <div className="w-full aspect-square max-w-[500px] mx-auto border border-gray-200 rounded-lg p-4">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
        >
          {/* Path segments with distance-based colors */}
          {pathSegments.map((segment, idx) => (
            <path
              key={idx}
              d={segment.path}
              fill="none"
              stroke={getPathColor(segment.distance)}
              strokeWidth="20"
            />
          ))}

          {/* Station dots and labels */}
          {stationPositions.map(({ station, x, y }) => {
            const isFrom = station.name === selectedFrom;
            const isTo = station.name === selectedTo;
            const isIntermediate = intermediateStations.includes(station.name);
            const isRestStation = restStations.includes(station.name);

            // Get special positioning adjustments for this station
            const adjustment = stationAdjustments[station.name] || {};
            const baseOffset = 24;
            const finalDx = adjustment.dx || (adjustment.anchor === "middle" ? 0 : (x > center ? baseOffset : -baseOffset));
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
                        : isRestStation
                          ? "fill-orange-500 stroke-orange-500"
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
                  textAnchor={adjustment.anchor || (x > center ? "start" : "end")}
                  className={cn(
                    "text-[12px] cursor-pointer select-none",
                    isFrom && "fill-blue-500 font-medium",
                    isTo && "fill-red-500 font-medium",
                    isRestStation && "fill-orange-500 font-medium",
                    isIntermediate && !isRestStation && "fill-green-700 font-medium"
                  )}
                >
                  {truncateStationName(station.name)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected stations display - show full names here */}
      <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>出発駅: {selectedFrom || "未選択"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>到着駅: {selectedTo || "未選択"}</span>
        </div>
        {restStations.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>休憩駅（5駅ごと）: {restStations.join(', ')}</span>
          </div>
        )}

        {/* 距離の凡例を追加 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">駅間距離の凡例:</p>
          <div className="flex items-center gap-2">
            <div className="w-20 h-3 bg-gradient-to-r from-green-600/20 to-green-600"></div>
            <span className="text-xs text-gray-500">
              {minDistance.toFixed(1)}km → {maxDistance.toFixed(1)}km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}