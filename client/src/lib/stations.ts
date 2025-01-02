export interface Station {
  name: string;
  nextDistance: number;
}

export const stations: Station[] = [
  { name: "東京", nextDistance: 1.657 },
  { name: "神田", nextDistance: 0.892 },
  { name: "秋葉原", nextDistance: 1.275 },
  { name: "御徒町", nextDistance: 0.765 },
  { name: "上野", nextDistance: 1.403 },
  { name: "鶯谷", nextDistance: 1.403 },
  { name: "日暮里", nextDistance: 0.638 },
  { name: "西日暮里", nextDistance: 1.020 },
  { name: "田端", nextDistance: 2.040 },
  { name: "駒込", nextDistance: 0.893 },
  { name: "巣鴨", nextDistance: 1.403 },
  { name: "大塚", nextDistance: 2.295 },
  { name: "池袋", nextDistance: 1.530 },
  { name: "目白", nextDistance: 1.148 },
  { name: "高田馬場", nextDistance: 1.785 },
  { name: "新大久保", nextDistance: 1.658 },
  { name: "新宿", nextDistance: 0.892 },
  { name: "代々木", nextDistance: 1.913 },
  { name: "原宿", nextDistance: 1.530 },
  { name: "渋谷", nextDistance: 2.040 },
  { name: "恵比寿", nextDistance: 1.913 },
  { name: "目黒", nextDistance: 1.530 },
  { name: "五反田", nextDistance: 1.148 },
  { name: "大崎", nextDistance: 2.550 },
  { name: "品川", nextDistance: 1.148 },
  { name: "高輪ゲートウェイ", nextDistance: 1.658 },
  { name: "田町", nextDistance: 1.913 },
  { name: "浜松町", nextDistance: 1.530 },
  { name: "新橋", nextDistance: 1.403 },
  { name: "有楽町", nextDistance: 1.020 }
];

export interface WalkingSpeed {
  name: string;
  speedKmh: number;
  label: string;
}

export const walkingSpeeds: WalkingSpeed[] = [
  { name: "slow", speedKmh: 4, label: "ゆっくり歩く (4 km/h)" },
  { name: "normal", speedKmh: 5, label: "普通に歩く (5 km/h)" },
  { name: "fast", speedKmh: 6, label: "速く歩く (6 km/h)" }
];

export type Direction = "clockwise" | "counterclockwise";

export const calculateRoute = (
  fromStation: string,
  toStation: string,
  speedKmh: number,
  startTime: Date,
  direction: Direction = "clockwise"
): { stations: Array<{ name: string; arrivalTime: Date }>, totalDistance: number } => {
  const fromIdx = stations.findIndex(s => s.name === fromStation);
  const toIdx = stations.findIndex(s => s.name === toStation);

  if (fromIdx === -1 || toIdx === -1) {
    throw new Error("Invalid stations");
  }

  const route: Array<{ name: string; arrivalTime: Date }> = [];
  let currentTime = new Date(startTime);
  let totalDistance = 0;

  let currentIdx = fromIdx;
  route.push({ name: stations[currentIdx].name, arrivalTime: new Date(currentTime) });

  while (currentIdx !== toIdx) {
    const distance = stations[currentIdx].nextDistance;
    const timeHours = distance / speedKmh;
    const timeMs = timeHours * 60 * 60 * 1000;

    if (direction === "clockwise") {
      currentIdx = (currentIdx - 1 + stations.length) % stations.length;
    } else {
      currentIdx = (currentIdx + 1) % stations.length;
    }

    currentTime = new Date(currentTime.getTime() + timeMs);
    totalDistance += distance;

    route.push({
      name: stations[currentIdx].name,
      arrivalTime: new Date(currentTime)
    });

    if (route.length > stations.length && currentIdx !== toIdx) {
      throw new Error("Route calculation error");
    }
  }

  return { stations: route, totalDistance };
};