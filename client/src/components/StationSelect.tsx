import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stations } from "../lib/stations";

interface StationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StationSelect({ value, onChange }: StationSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {stations.map((station) => (
          <SelectItem key={station.name} value={station.name}>
            {station.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
