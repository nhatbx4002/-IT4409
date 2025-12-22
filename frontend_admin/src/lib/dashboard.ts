import { adminApiClient } from "./api";
import type { Order } from "./orders";

export type KPIStats = {
  revenue?: {
    today?: number;
    thisMonth?: number;
  };
  orders?: {
    today?: number;
    thisMonth?: number;
  };
  users?: {
    total?: number;
  };
  products?: {
    total?: number;
  };
  averageOrderValue?: number;
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type RevenueChartParams = {
  from?: string;
  to?: string;
  granularity?: "day" | "month";
};

export type AnalyticsData = {
  conversionRate?: number;
  bounceRate?: number;
  averageSessionDuration?: number;
  pageViews?: number;
  [key: string]: any;
};

export type BestSeller = {
  product_id: number;
  name?: string;
  slug?: string;
  totalSold?: number;
  revenue?: number;
  imageUrl?: string | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  // Check for API error response
  if ((payload as ApiEnvelope<T>)?.success === false) {
    throw new Error((payload as ApiEnvelope<T>)?.message || "Request failed");
  }

  // Extract data from API envelope format
  if (typeof payload === "object" && payload !== null && "data" in (payload as any)) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  // Return payload as-is if it's already the data
  return payload as T;
};

export async function getKPIStats(): Promise<KPIStats> {
  const res = await adminApiClient.get<KPIStats>("/dashboard/stats");
  const stats = res.data;
  const averageOrderValue =
    stats?.revenue?.thisMonth && stats?.orders?.thisMonth
      ? stats.revenue.thisMonth / Math.max(1, stats.orders.thisMonth)
      : undefined;
  return { ...stats, averageOrderValue };
}

export async function getRevenueChart(params: RevenueChartParams = {}): Promise<TimeSeriesPoint[]> {
  const query: Record<string, any> = {};
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;
  if (params.granularity) query.groupBy = params.granularity;

  const res = await adminApiClient.get<TimeSeriesPoint[]>("/dashboard/revenue", {
    params: query,
  });
  return res.data ?? [];
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  const res = await adminApiClient.get<Order[]>("/dashboard/recent-orders", {
    params: { limit },
  });
  return res.data ?? [];
}

export async function getBestSellers(params: { limit?: number; from?: string; to?: string } = {}): Promise<
  BestSeller[]
> {
  const query: Record<string, any> = {};
  if (params.limit) query.limit = params.limit;
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;

  const res = await adminApiClient.get<BestSeller[]>("/dashboard/best-sellers", {
    params: query,
  });
  return res.data ?? [];
}

export async function getAnalyticsData(params: { from: string; to: string }): Promise<AnalyticsData> {
  const res = await adminApiClient.get<AnalyticsData>("/stats/revenue", {
    params,
  });
  return res.data ?? {};
}

