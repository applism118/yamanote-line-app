import { cn } from "@/lib/utils";

interface RouteTimelineProps {
  stations: Array<{
    name: string;
    arrivalTime: Date;
    departureTime?: Date;
    isRestStation?: boolean;
  }>;
  restMinutes: number;
}

export default function RouteTimeline({ stations, restMinutes }: RouteTimelineProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 駅間の距離を計算する関数（直前の駅からの距離）
  const getDistanceToNextStation = (currentIndex: number) => {
    // 最後の駅の場合は0を返す
    if (currentIndex === stations.length - 1) return 0;

    const currentTime = stations[currentIndex].departureTime || stations[currentIndex].arrivalTime;
    const nextTime = stations[currentIndex + 1].arrivalTime;
    const timeInHours = (nextTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    // 平均歩行速度4km/hと仮定して距離を計算
    return timeInHours * 4;
  };

  // 全区間の距離を取得
  const distances = stations.map((_, idx) => getDistanceToNextStation(idx));
  const maxDistance = Math.max(...distances);
  const minDistance = Math.min(...distances.filter(d => d > 0));

  // 距離に基づいて色の濃さを計算
  const getLineColor = (distance: number) => {
    if (distance === 0) return "bg-gray-200";
    const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);
    // より強いコントラストのために指数関数を使用
    const enhancedDistance = Math.pow(normalizedDistance, 1.5);
    const baseOpacity = 0.1;
    const opacity = baseOpacity + (enhancedDistance * 0.9);
    return `rgb(34 197 94 / ${opacity})`;
  };

  return (
    <div className="relative">
      {stations.map((station, idx) => (
        <div key={idx} className="relative">
          {/* 最後の駅以外に縦線を表示 */}
          {idx < stations.length - 1 && (
            <div 
              className="absolute left-3 sm:left-4 w-1 h-full"
              style={{ backgroundColor: getLineColor(getDistanceToNextStation(idx)) }}
            />
          )}

          <div className="relative pl-8 sm:pl-10 pb-6">
            <div className={cn(
              "absolute left-[10px] sm:left-[14px] w-2 h-2 rounded-full top-1.5",
              idx === 0 ? "bg-blue-500" :
              idx === stations.length - 1 ? "bg-red-500" :
              station.isRestStation ? "bg-orange-500" :
              "bg-gray-400"
            )} />

            <div className="flex justify-between items-start">
              <span className={cn(
                "font-medium text-sm sm:text-base",
                idx === 0 && "text-blue-600",
                idx === stations.length - 1 && "text-red-600",
                station.isRestStation && !([0, stations.length - 1].includes(idx)) && "text-orange-600"
              )}>
                {station.name}
              </span>
              <div className="text-right space-y-1">
                <div className="text-xs sm:text-sm text-gray-600">
                  到着: {formatTime(station.arrivalTime)}
                </div>
                {station.isRestStation && (
                  <>
                    <div className="text-xs sm:text-sm text-orange-600">
                      休憩{restMinutes}分
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      出発: {formatTime(station.departureTime!)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}