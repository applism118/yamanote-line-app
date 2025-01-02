import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stationList } from "@/lib/stations";
import { Label } from "@/components/ui/label";

interface StationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function StationSelector({ value, onChange, label }: StationSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="駅を選択" />
        </SelectTrigger>
        <SelectContent>
          {stationList.map((station) => (
            <SelectItem key={station} value={station}>
              {station}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
