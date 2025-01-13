import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StationSelect from "../components/StationSelect";
import StationMap from "../components/StationMap";
import RouteTimeline from "../components/RouteTimeline";
import SavedPlansModal from "../components/SavedPlansModal";
import { stations, walkingSpeeds, calculateRoute, type Direction } from "../lib/stations";
import { type RoutePlan, storePlan } from "../lib/storage";
import { cn } from "@/lib/utils";

export default function Home() {
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [direction, setDirection] = useState<Direction>("clockwise");
  const [selectionMode, setSelectionMode] = useState<"map" | "text">("map");
  const [selectionStep, setSelectionStep] = useState<"from" | "to">("from");
  const [restMinutes, setRestMinutes] = useState<number>(30);
  const [selectedSpeed, setSelectedSpeed] = useState<string>("slow");
  const { toast } = useToast();

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
    const route = calculateRoute(fromStation, toStation, walkingSpeeds[0].speedKmh, startTime, direction, restMinutes);
    return route.stations
      .slice(1, -1)
      .map(station => station.name);
  };

  const handleSavePlan = () => {
    if (!fromStation || !toStation) return;

    const speed = walkingSpeeds.find(s => s.name === selectedSpeed);
    if (!speed) return;

    const route = calculateRoute(fromStation, toStation, speed.speedKmh, startTime, direction, restMinutes);

    try {
      storePlan({
        fromStation,
        toStation,
        direction,
        walkingSpeed: selectedSpeed,
        startTime,
        restMinutes,
        stations: route.stations,
        totalDistance: route.totalDistance
      });

      toast({
        title: "プランを保存しました",
        description: "保存したプランは「保存したプランを見る」から確認できます。",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "プランの保存に失敗しました。",
        variant: "destructive"
      });
    }
  };

  const handleLoadPlan = (plan: RoutePlan) => {
    setFromStation(plan.fromStation);
    setToStation(plan.toStation);
    setDirection(plan.direction);
    setSelectedSpeed(plan.walkingSpeed);
    setStartTime(plan.startTime);
    setRestMinutes(plan.restMinutes);

    toast({
      title: "プランを読み込みました",
      description: "保存されたプランの設定を反映しました。",
    });
  };

  const intermediateStations = getIntermediateStations();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          山手線ウォーキングプランナー
        </h1>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <Card className="order-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>ルート設定</CardTitle>
              <SavedPlansModal onSelectPlan={handleLoadPlan} />
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <Tabs value={selectionMode} onValueChange={(v) => setSelectionMode(v as "map" | "text")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="map">地図で指定</TabsTrigger>
                  <TabsTrigger value="text">キーワードで指定</TabsTrigger>
                </TabsList>
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="restMinutes">休憩時間（分）</Label>
                <Input
                  id="restMinutes"
                  type="number"
                  min="0"
                  max="120"
                  value={restMinutes}
                  onChange={(e) => setRestMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {fromStation && toStation && (
            <Card className="order-2">
              <CardContent className="pt-6">
                <Tabs value={selectedSpeed} onValueChange={setSelectedSpeed}>
                  <TabsList className="grid w-full grid-cols-3">
                    {walkingSpeeds.map(speed => (
                      <TabsTrigger key={speed.name} value={speed.name}>
                        {speed.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {walkingSpeeds.map(speed => {
                    const route = calculateRoute(fromStation, toStation, speed.speedKmh, startTime, direction, restMinutes);
                    return (
                      <TabsContent key={speed.name} value={speed.name}>
                        <div className="mb-4 p-3 bg-gray-50 rounded-md space-y-1">
                          <p className="text-sm sm:text-base text-gray-600">
                            歩行速度: {speed.speedKmh} km/h
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            総距離: {route.totalDistance.toFixed(1)} km
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            予想所要時間: {(route.totalDistance / speed.speedKmh + (route.stations.filter(s => s.isRestStation).length * restMinutes / 60)).toFixed(1)} 時間
                          </p>
                        </div>
                        <RouteTimeline stations={route.stations} restMinutes={restMinutes} />
                        <div className="mt-4 flex justify-end">
                          <Button onClick={handleSavePlan}>
                            プランを保存
                          </Button>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}