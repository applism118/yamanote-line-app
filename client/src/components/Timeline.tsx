import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface TimelineProps {
  timeline: { station: string; time: Date }[];
}

export function Timeline({ timeline }: TimelineProps) {
  if (timeline.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">予想到着時刻</h2>
      <div className="space-y-4">
        {timeline.map((entry, index) => (
          <Card key={index} className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <span className="ml-4 text-lg font-medium">{entry.station}</span>
            </div>
            <time className="text-lg font-mono">
              {format(entry.time, "HH:mm")}
            </time>
          </Card>
        ))}
      </div>
    </div>
  );
}
