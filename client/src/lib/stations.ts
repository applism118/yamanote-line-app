import { z } from 'zod';

export interface Station {
  name: string;
  nextDistance: number;
}

export const stations: Station[] = [
  { name: "池袋", nextDistance: 1.530 },
  { name: "大塚", nextDistance: 2.295 },
  { name: "巣鴨", nextDistance: 1.403 },
  { name: "駒込", nextDistance: 0.893 },
  { name: "田端", nextDistance: 2.040 },
  { name: "西日暮里", nextDistance: 1.020 },
  { name: "日暮里", nextDistance: 0.638 },
  { name: "鶯谷", nextDistance: 1.403 },
  { name: "上野", nextDistance: 1.403 },
  { name: "御徒町", nextDistance: 0.765 },
  { name: "秋葉原", nextDistance: 1.275 },
  { name: "神田", nextDistance: 0.892 },
  { name: "東京", nextDistance: 1.657 },
  { name: "有楽町", nextDistance: 1.020 },
  { name: "新橋", nextDistance: 1.403 },
  { name: "浜松町", nextDistance: 1.530 },
  { name: "田町", nextDistance: 1.913 },
  { name: "高輪ゲートウェイ", nextDistance: 1.658 },
  { name: "品川", nextDistance: 1.148 },
  { name: "大崎", nextDistance: 2.550 },
  { name: "五反田", nextDistance: 1.148 },
  { name: "目黒", nextDistance: 1.530 },
  { name: "恵比寿", nextDistance: 1.913 },
  { name: "渋谷", nextDistance: 2.040 },
  { name: "原宿", nextDistance: 1.530 },
  { name: "代々木", nextDistance: 1.913 },
  { name: "新宿", nextDistance: 0.892 },
  { name: "新大久保", nextDistance: 1.658 },
  { name: "高田馬場", nextDistance: 1.785 },
  { name: "目白", nextDistance: 1.148 }
];

export interface WalkingSpeed {
  name: string;
  speedKmh: number;
  label: string;
}

export const walkingSpeeds: WalkingSpeed[] = [
  { name: "slow", speedKmh: 3, label: "ゆっくり" },
  { name: "normal", speedKmh: 4, label: "普通" },
  { name: "fast", speedKmh: 5, label: "速い" }
];

export type Direction = "clockwise" | "counterclockwise";

export const calculateRoute = (
  fromStation: string,
  toStation: string,
  speedKmh: number,
  startTime: Date,
  direction: Direction = "clockwise",
  restMinutes: number = 30
): { stations: Array<{ name: string; arrivalTime: Date; departureTime?: Date; isRestStation?: boolean }>, totalDistance: number } => {
  const fromIdx = stations.findIndex(s => s.name === fromStation);
  const toIdx = stations.findIndex(s => s.name === toStation);

  if (fromIdx === -1 || toIdx === -1) {
    throw new Error("Invalid stations");
  }

  const route: Array<{ name: string; arrivalTime: Date; departureTime?: Date; isRestStation?: boolean }> = [];
  let currentTime = new Date(startTime);
  let totalDistance = 0;

  let currentIdx = fromIdx;
  route.push({ name: stations[currentIdx].name, arrivalTime: new Date(currentTime), departureTime: new Date(currentTime) });

  let stationCount = 1;
  while (currentIdx !== toIdx) {
    const distance = stations[currentIdx].nextDistance;
    const timeHours = distance / speedKmh;
    const timeMs = timeHours * 60 * 60 * 1000;

    if (direction === "clockwise") {
      currentIdx = (currentIdx + 1) % stations.length;
    } else {
      currentIdx = (currentIdx - 1 + stations.length) % stations.length;
    }

    // Calculate arrival time based on walking time from previous station
    const arrivalTime = new Date(
      (route[route.length - 1].departureTime || route[route.length - 1].arrivalTime).getTime() + timeMs
    );

    // Every 5th station (but not the first or last station) is a rest station
    const isRestStation = stationCount % 5 === 0 && 
                         stationCount !== 0 && 
                         currentIdx !== toIdx;

    // For rest stations, set departure time after rest
    const departureTime = isRestStation
      ? new Date(arrivalTime.getTime() + restMinutes * 60 * 1000)
      : arrivalTime;

    route.push({
      name: stations[currentIdx].name,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
      isRestStation
    });

    totalDistance += distance;
    stationCount++;

    if (route.length > stations.length && currentIdx !== toIdx) {
      throw new Error("Route calculation error");
    }
  }

  return { stations: route, totalDistance };
};