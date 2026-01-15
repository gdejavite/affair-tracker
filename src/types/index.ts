export interface Woman {
  id: string;
  name: string;
  photo: string;
  nickname?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
}

export interface DateEntry {
  id: string;
  womanId: string;
  date: Date;
  location: string;
  amount: number;
  notes?: string;
  rating?: number;
}

export interface Stats {
  totalSpent: number;
  totalDates: number;
  averagePerDate: number;
  mostExpensive: Woman | null;
}
