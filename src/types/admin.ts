export interface OrderStats {
  totalOrders: number;
  revenue: number;
  byStatus: Record<string, number>;
  last30Days: { orders: number; revenue: number };
}

export interface UserStats {
  total: number;
  admins: number;
  newLast30Days: number;
}