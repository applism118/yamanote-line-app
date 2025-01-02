import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StationSelector } from "@/components/StationSelector";
import { SpeedSelector } from "@/components/SpeedSelector";
import { Timeline } from "@/components/Timeline";
import { WalkingSpeed, calculateWalkingTime } from "@/lib/stations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Home() {
  const [startStation, setStartStation] = useState("東京");
  const [endStation, setEndStation] = useState("新宿");
  const [speed, setSpeed] = useState<WalkingSpeed>("normal");
  const [clockwise, setClockwise] = useState(true);
  const [timeline, setTimeline] = useState<{ station: string; time: Date }[]>([]);

  const calculateRoute = () => {
    const startTime = new Date();
    const result = calculateWalkingTime(
      startStation,
      endStation,
      speed,
      startTime,
      clockwise
    );
    setTimeline(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            山手線徒歩所要時間計算
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <StationSelector
              value={startStation}
              onChange={setStartStation}
              label="出発駅"
            />
            <StationSelector
              value={endStation}
              onChange={setEndStation}
              label="到着駅"
            />
          </div>
          
          <SpeedSelector value={speed} onChange={setSpeed} />
          
          <div className="flex items-center space-x-2">
            <Switch
              id="direction"
              checked={clockwise}
              onCheckedChange={setClockwise}
            />
            <Label htmlFor="direction">
              {clockwise ? "時計回り" : "反時計回り"}
            </Label>
          </div>

          <Button
            onClick={calculateRoute}
            className="w-full"
            size="lg"
          >
            計算する
          </Button>
        </CardContent>
      </Card>

      <Timeline timeline={timeline} />
    </div>
  );
}
