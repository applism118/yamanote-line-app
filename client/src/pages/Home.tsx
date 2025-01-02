import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StationSelect from "../components/StationSelect";
import StationMap from "../components/StationMap";
import RouteTimeline from "../components/RouteTimeline";
import { stations, walkingSpeeds, calculateRoute, type Direction } from "../lib/stations";
import { cn } from "@/lib/utils";

export default function Home() {
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [direction, setDirection] = useState<Direction>("clockwise");
  const [selectionMode, setSelectionMode] = useState<"text" | "map">("text");
  const [selectionStep, setSelectionStep] = useState<"from" | "to">("from");

  const handleMapStationSelect = (stationName: string) => {
    if (selectionStep === "from") {
      setFromStation(stationName);
      setSelectionStep("to");
    } else {
      setToStation(stationName);
      setSelectionStep("from");
    }
  };

  // Calculate intermediate stations for the selected route
  const getIntermediateStations = () => {
    if (!fromStation || !toStation) return [];
    const route = calculateRoute(fromStation, toStation, walkingSpeeds[0].speedKmh, startTime, direction);
    return route.stations
      .slice(1, -1) // Exclude first (from) and last (to) stations
      .map(station => station.name);
  };

  const intermediateStations = getIntermediateStations();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          山手線ウォーキングプランナー
        </h1>

        <div className="grid gap-4 sm:gap-6 md:gap-8">
          <Card className="order-1">
            <CardHeader>
              <CardTitle>ルート設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <Tabs value={selectionMode} onValueChange={(v) => setSelectionMode(v as "text" | "map")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">キーワードで指定</TabsTrigger>
                  <TabsTrigger value="map">地図で指定</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">出発駅</Label>
                    <StationSelect
                      value={fromStation}
                      onChange={setFromStation}
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">到着駅</Label>
                    <StationSelect
                      value={toStation}
                      onChange={setToStation}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="map">
                  <div className="space-y-4">
                    <div className="text-center text-sm text-gray-600">
                      {selectionStep === "from" ? "出発駅を選択してください" : "到着駅を選択してください"}
                    </div>
                    <StationMap
                      stations={stations}
                      selectedFrom={fromStation}
                      selectedTo={toStation}
                      intermediateStations={intermediateStations}
                      onSelectStation={handleMapStationSelect}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label className="mb-1.5 block">進行方向</Label>
                <RadioGroup
                  value={direction}
                  onValueChange={(val: Direction) => setDirection(val)}
                  className="grid gap-2"
                >
                  <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <RadioGroupItem value="clockwise" id="clockwise" />
                    <Label htmlFor="clockwise" className="flex-1 cursor-pointer">
                      時計回り
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <RadioGroupItem value="counterclockwise" id="counterclockwise" />
                    <Label htmlFor="counterclockwise" className="flex-1 cursor-pointer">
                      反時計回り
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-1.5 block">出発時刻</Label>
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
                    "flex h-12 w-full rounded-md border border-input bg-background px-4",
                    "text-base ring-offset-background file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 order-2">
            {fromStation && toStation && walkingSpeeds.map((speed) => (
              <Card key={speed.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{speed.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const route = calculateRoute(fromStation, toStation, speed.speedKmh, startTime, direction);
                    return (
                      <>
                        <div className="mb-4 p-3 bg-gray-50 rounded-md space-y-1">
                          <p className="text-sm sm:text-base text-gray-600">
                            総距離: {route.totalDistance.toFixed(1)} km
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            予想所要時間: {(route.totalDistance / speed.speedKmh).toFixed(1)} 時間
                          </p>
                        </div>
                        <RouteTimeline stations={route.stations} />
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}