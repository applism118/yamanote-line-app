import { type Station } from "../lib/stations";
import { cn } from "@/lib/utils";

interface StationMapProps {
  stations: Station[];
  selectedFrom?: string;
  selectedTo?: string;
  onSelectStation: (stationName: string) => void;
}

export default function StationMap({ 
  stations, 
  selectedFrom,
  selectedTo,
  onSelectStation 
}: StationMapProps) {
  const radius = 160; // SVG circle radius
  const center = 200; // Center point of the SVG
  
  return (
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
          
          const isSelected = station.name === selectedFrom || station.name === selectedTo;
          
          return (
            <g key={station.name} onClick={() => onSelectStation(station.name)}>
              {/* Station dot */}
              <circle
                cx={x}
                cy={y}
                r="6"
                className={cn(
                  "cursor-pointer transition-colors",
                  isSelected 
                    ? "fill-primary stroke-primary" 
                    : "fill-white stroke-gray-400 hover:fill-gray-100"
                )}
                strokeWidth="2"
              />
              
              {/* Station name */}
              <text
                x={x}
                y={y}
                dx={x > center ? "12" : "-12"}
                dy="0"
                textAnchor={x > center ? "start" : "end"}
                className={cn(
                  "text-[10px] cursor-pointer select-none",
                  isSelected && "fill-primary font-medium"
                )}
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
