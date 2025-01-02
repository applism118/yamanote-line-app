export interface Station {
  name: string;
  nextStation: string;
  distance: number;
}

export const stations: Record<string, Station> = {
  "東京": { name: "東京", nextStation: "神田", distance: 1.3 },
  "神田": { name: "神田", nextStation: "秋葉原", distance: 0.7 },
  "秋葉原": { name: "秋葉原", nextStation: "御徒町", distance: 1.0 },
  "御徒町": { name: "御徒町", nextStation: "上野", distance: 0.6 },
  "上野": { name: "上野", nextStation: "鶯谷", distance: 1.1 },
  "鶯谷": { name: "鶯谷", nextStation: "日暮里", distance: 1.1 },
  "日暮里": { name: "日暮里", nextStation: "西日暮里", distance: 0.5 },
  "西日暮里": { name: "西日暮里", nextStation: "田端", distance: 0.8 },
  "田端": { name: "田端", nextStation: "駒込", distance: 1.6 },
  "駒込": { name: "駒込", nextStation: "巣鴨", distance: 0.7 },
  "巣鴨": { name: "巣鴨", nextStation: "大塚", distance: 1.1 },
  "大塚": { name: "大塚", nextStation: "池袋", distance: 1.8 },
  "池袋": { name: "池袋", nextStation: "目白", distance: 1.2 },
  "目白": { name: "目白", nextStation: "高田馬場", distance: 0.9 },
  "高田馬場": { name: "高田馬場", nextStation: "新大久保", distance: 1.4 },
  "新大久保": { name: "新大久保", nextStation: "新宿", distance: 1.3 },
  "新宿": { name: "新宿", nextStation: "代々木", distance: 0.7 },
  "代々木": { name: "代々木", nextStation: "原宿", distance: 1.5 },
  "原宿": { name: "原宿", nextStation: "渋谷", distance: 1.2 },
  "渋谷": { name: "渋谷", nextStation: "恵比寿", distance: 1.6 },
  "恵比寿": { name: "恵比寿", nextStation: "目黒", distance: 1.5 },
  "目黒": { name: "目黒", nextStation: "五反田", distance: 1.2 },
  "五反田": { name: "五反田", nextStation: "大崎", distance: 0.9 },
  "大崎": { name: "大崎", nextStation: "品川", distance: 2.0 },
  "品川": { name: "品川", nextStation: "高輪ゲートウェイ", distance: 0.9 },
  "高輪ゲートウェイ": { name: "高輪ゲートウェイ", nextStation: "田町", distance: 1.3 },
  "田町": { name: "田町", nextStation: "浜松町", distance: 1.5 },
  "浜松町": { name: "浜松町", nextStation: "新橋", distance: 1.2 },
  "新橋": { name: "新橋", nextStation: "有楽町", distance: 1.1 },
  "有楽町": { name: "有楽町", nextStation: "東京", distance: 0.8 }
};

export const stationList = Object.values(stations).map(s => s.name);

export type WalkingSpeed = "slow" | "normal" | "fast";

export const walkingSpeeds: Record<WalkingSpeed, number> = {
  slow: 4,
  normal: 5,
  fast: 6
};

export function calculateWalkingTime(
  startStation: string,
  endStation: string,
  speed: WalkingSpeed,
  startTime: Date,
  clockwise: boolean
): { station: string; time: Date }[] {
  const timeline: { station: string; time: Date }[] = [];
  let currentStation = startStation;
  let currentTime = new Date(startTime);
  
  timeline.push({ station: currentStation, time: new Date(currentTime) });

  while (currentStation !== endStation) {
    const station = stations[currentStation];
    const nextStation = clockwise ? station.nextStation : Object.values(stations).find(s => s.nextStation === currentStation)?.name;
    
    if (!nextStation) break;
    
    const distance = stations[currentStation].distance;
    const hours = distance / walkingSpeeds[speed];
    const minutes = hours * 60;
    
    currentTime = new Date(currentTime.getTime() + minutes * 60 * 1000);
    currentStation = nextStation;
    
    timeline.push({ station: currentStation, time: new Date(currentTime) });
  }

  return timeline;
}
