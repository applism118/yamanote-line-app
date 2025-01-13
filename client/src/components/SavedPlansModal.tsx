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
import { Trash2, ChevronDown, Bookmark } from "lucide-react";
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
      duration: 2000,
    });
  };

  const handleDeleteAllPlans = () => {
    deleteAllPlans();
    setPlans([]);
    toast({
      title: "全てのプランを削除しました",
      duration: 2000,
    });
  };

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="保存したプランを表示">
          <Bookmark className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle>保存したプラン一覧</DialogTitle>
            {plans.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAllPlans}
                className="mr-8"
              >
                全て削除
              </Button>
            )}
          </div>
          <DialogDescription className="text-left">
            過去に保存したプランを確認できます。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 mt-4 overflow-y-auto">
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
                  <div
                    className="space-y-2"
                    onClick={() => togglePlanExpansion(plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span>
                          {plan.fromStation} ({formatTime(plan.startTime)})
                        </span>
                        <span className="text-gray-500">→</span>
                        <span>
                          {plan.toStation} ({formatTime(plan.stations[plan.stations.length - 1].arrivalTime)})
                        </span>
                        <span className="text-gray-500">/</span>
                        <span>
                          速さ: {
                            plan.walkingSpeed === "slow" ? "ゆっくり" :
                            plan.walkingSpeed === "normal" ? "普通" :
                            "速い"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeletePlan(plan.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedPlanId === plan.id && "transform rotate-180"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {expandedPlanId === plan.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          総距離: {plan.totalDistance.toFixed(1)} km
                        </p>
                      </div>
                      <RouteTimeline
                        stations={plan.stations}
                        restMinutes={plan.restMinutes}
                      />
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