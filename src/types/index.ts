export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface DayOrder {
  [menuItemId: string]: number; // menuItemId -> quantity
}

export interface WeekOrder {
  monday: DayOrder;
  tuesday: DayOrder;
  wednesday: DayOrder;
  thursday: DayOrder;
  friday: DayOrder;
}

export interface Order {
  id: string;
  employeeName: string;
  weekOrder: WeekOrder;
  timestamp: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday'
};
