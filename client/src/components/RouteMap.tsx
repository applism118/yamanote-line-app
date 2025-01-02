import { useState } from 'react';
import { stations } from '../lib/stations';

interface RouteMapProps {
  fromStation: string;
  toStation: string;
  direction: "clockwise" | "counterclockwise";
}

export default function RouteMap({ fromStation, toStation, direction }: RouteMapProps) {
  const stationPoints = Array.from({ length: stations.length }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / stations.length;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return { x, y };
  });

  const fromIndex = stations.findIndex(s => s.name === fromStation);
  const toIndex = stations.findIndex(s => s.name === toStation);

  // SVGのパスを生成
  const generatePath = () => {
    if (fromIndex === -1 || toIndex === -1) return '';

    const path: string[] = [];
    let currentIdx = fromIndex;

    do {
      const station = stationPoints[currentIdx];
      const command = currentIdx === fromIndex ? 'M' : 'L';
      path.push(`${command} ${station.x * 180 + 200} ${station.y * 180 + 200}`);

      if (direction === "clockwise") {
        currentIdx = (currentIdx + 1) % stations.length;
      } else {
        currentIdx = (currentIdx - 1 + stations.length) % stations.length;
      }
    } while (currentIdx !== (toIndex + (direction === "clockwise" ? 1 : -1) + stations.length) % stations.length);

    const lastStation = stationPoints[toIndex];
    path.push(`L ${lastStation.x * 180 + 200} ${lastStation.y * 180 + 200}`);

    return path.join(' ');
  };

  return (
    <div className="w-full aspect-square max-w-xl mx-auto">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
      >
        {/* 環状線の背景 */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        {/* ルート */}
        <path
          d={generatePath()}
          stroke="#EF4444"
          strokeWidth="3"
          fill="none"
        />

        {/* 駅のマーカー */}
        {stationPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x * 180 + 200}
            cy={point.y * 180 + 200}
            r={i === fromIndex || i === toIndex ? 6 : 4}
            fill={i === fromIndex ? "#22C55E" : i === toIndex ? "#EF4444" : "#6B7280"}
          />
        ))}
      </svg>
    </div>
  );
}