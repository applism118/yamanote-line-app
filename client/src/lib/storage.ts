import { z } from 'zod';

// 保存するルートプランのスキーマ定義
export const routePlanSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  fromStation: z.string(),
  toStation: z.string(),
  direction: z.enum(["clockwise", "counterclockwise"]),
  walkingSpeed: z.string(),
  startTime: z.date(),
  restMinutes: z.number(),
  stations: z.array(z.object({
    name: z.string(),
    arrivalTime: z.date(),
    departureTime: z.date().optional(),
    isRestStation: z.boolean().optional()
  })),
  totalDistance: z.number()
});

export type RoutePlan = z.infer<typeof routePlanSchema>;

const STORAGE_KEY = 'yamanote-route-plans';

// 保存されているプランを全て取得
export function getStoredPlans(): RoutePlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored, (key, value) => {
      // Date型の文字列を Date オブジェクトに変換
      if (key === 'createdAt' || key === 'startTime' || key === 'arrivalTime' || key === 'departureTime') {
        return new Date(value);
      }
      return value;
    });

    return routePlanSchema.array().parse(parsed);
  } catch (error) {
    console.error('Failed to load stored plans:', error);
    return [];
  }
}

// 新しいプランを保存
export function storePlan(plan: Omit<RoutePlan, 'id' | 'createdAt'>): RoutePlan {
  const plans = getStoredPlans();

  const newPlan: RoutePlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date()
  };

  plans.push(newPlan);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return newPlan;
  } catch (error) {
    console.error('Failed to store plan:', error);
    throw new Error('Failed to store plan');
  }
}

// プランを削除
export function deletePlan(planId: string): void {
  const plans = getStoredPlans();
  const filteredPlans = plans.filter(plan => plan.id !== planId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlans));
}

// 全てのプランを削除
export function deleteAllPlans(): void {
  localStorage.removeItem(STORAGE_KEY);
}