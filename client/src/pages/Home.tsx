import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StationSelect from "../components/StationSelect";
import RouteTimeline from "../components/RouteTimeline";
import { stations, walkingSpeeds, calculateRoute } from "../lib/stations";
import { cn } from "@/lib/utils";

export default function Home() {
  const [fromStation, setFromStation] = useState<string>(stations[0].name);
  const [toStation, setToStation] = useState<string>(stations[1].name);
  const [speed, setSpeed] = useState<number>(5);
  const [startTime, setStartTime] = useState<Date>(new Date());

  const route = calculateRoute(fromStation, toStation, speed, startTime);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          山手線ウォーキングプランナー
        </h1>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>ルート設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>出発駅</Label>
                  <StationSelect
                    value={fromStation}
                    onChange={setFromStation}
                  />
                </div>
                <div>
                  <Label>到着駅</Label>
                  <StationSelect
                    value={toStation}
                    onChange={setToStation}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>歩行速度</Label>
                <RadioGroup
                  value={speed.toString()}
                  onValueChange={(val) => setSpeed(Number(val))}
                  className="grid gap-2"
                >
                  {walkingSpeeds.map((ws) => (
                    <div key={ws.name} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={ws.speedKmh.toString()}
                        id={ws.name}
                      />
                      <Label htmlFor={ws.name}>{ws.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>出発時刻</Label>
                <input
                  type="time"
                  value={startTime.toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date();
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    setStartTime(newDate);
                  }}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                    "text-sm ring-offset-background file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ルート詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  総距離: {route.totalDistance.toFixed(1)} km
                </p>
                <p className="text-sm text-gray-600">
                  予想所要時間: {(route.totalDistance / speed).toFixed(1)} 時間
                </p>
              </div>
              <RouteTimeline stations={route.stations} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
