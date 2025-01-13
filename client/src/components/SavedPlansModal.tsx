import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { type RoutePlan, getStoredPlans, deletePlan } from "../lib/storage";
import RouteTimeline from "./RouteTimeline";

interface SavedPlansModalProps {
  onSelectPlan: (plan: RoutePlan) => void;
}

export default function SavedPlansModal({ onSelectPlan }: SavedPlansModalProps) {
  const [plans, setPlans] = useState<RoutePlan[]>([]);
  const [open, setOpen] = useState(false);

  // モーダルを開く時にプランを読み込む
  const handleOpen = (open: boolean) => {
    if (open) {
      setPlans(getStoredPlans());
    }
    setOpen(open);
  };

  const handleDeletePlan = (planId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deletePlan(planId);
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const handleSelectPlan = (plan: RoutePlan) => {
    onSelectPlan(plan);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">保存したプランを見る</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>保存したプラン一覧</DialogTitle>
          <DialogDescription>
            過去に保存したプランを確認できます。プランをクリックすると、そのプランを読み込みます。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {plans.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                保存されたプランはありません
              </p>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer group relative"
                >
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeletePlan(plan.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      作成日: {plan.createdAt.toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">出発駅</p>
                        <p>{plan.fromStation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">到着駅</p>
                        <p>{plan.toStation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">総距離</p>
                        <p>{plan.totalDistance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">方向</p>
                        <p>{plan.direction === "clockwise" ? "時計回り" : "反時計回り"}</p>
                      </div>
                    </div>
                  </div>
                  <RouteTimeline
                    stations={plan.stations}
                    restMinutes={plan.restMinutes}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
