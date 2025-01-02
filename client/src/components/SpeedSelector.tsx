import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WalkingSpeed } from "@/lib/stations";

interface SpeedSelectorProps {
  value: WalkingSpeed;
  onChange: (value: WalkingSpeed) => void;
}

export function SpeedSelector({ value, onChange }: SpeedSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Label>歩行速度</Label>
      <RadioGroup value={value} onValueChange={onChange as (value: string) => void} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="slow" id="slow" />
          <Label htmlFor="slow">ゆっくり (4 km/h)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="normal" id="normal" />
          <Label htmlFor="normal">普通 (5 km/h)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fast" id="fast" />
          <Label htmlFor="fast">速く (6 km/h)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
