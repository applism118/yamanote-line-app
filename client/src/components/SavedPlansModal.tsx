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
import { Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { type RoutePlan, getStoredPlans, deletePlan, deleteAllPlans } from "../lib/storage";
import RouteTimeline from "./RouteTimeline";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SavedPlansModalProps {
  onSelectPlan: (plan: RoutePlan) => void;
}

export default function SavedPlansModal({ onSelectPlan }: SavedPlansModalProps) {
  const [plans, setPlans] = useState<RoutePlan[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const { toast } = useToast();

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
    toast({
      title: "プランを削除しました",
    });
  };

  const handleDeleteAllPlans = () => {
    deleteAllPlans();
    setPlans([]);
    toast({
      title: "全てのプランを削除しました",
    });
  };

  const handleSelectPlan = (plan: RoutePlan) => {
    onSelectPlan(plan);
    setOpen(false);
  };

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">保存したプランを表示</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>保存したプラン一覧</DialogTitle>
            {plans.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAllPlans}
                className="ml-auto"
              >
                保存プランを全て削除
              </Button>
            )}
          </div>
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
                  className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer group relative"
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
                  <div
                    className="space-y-2"
                    onClick={() => togglePlanExpansion(plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        作成日: {plan.createdAt.toLocaleString()}
                      </p>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedPlanId === plan.id && "transform rotate-180"
                        )}
                      />
                    </div>
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
                        <p className="text-sm font-medium">速さ</p>
                        <p>{
                          plan.walkingSpeed === "slow" ? "ゆっくり" :
                          plan.walkingSpeed === "normal" ? "普通" :
                          "速い"
                        }</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">総距離</p>
                        <p>{plan.totalDistance.toFixed(1)} km</p>
                      </div>
                    </div>
                  </div>
                  {expandedPlanId === plan.id && (
                    <div className="mt-4 pt-4 border-t">
                      <RouteTimeline
                        stations={plan.stations}
                        restMinutes={plan.restMinutes}
                      />
                      <div className="mt-4">
                        <Button
                          variant="default"
                          onClick={() => handleSelectPlan(plan)}
                          className="w-full"
                        >
                          このプランを読み込む
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}