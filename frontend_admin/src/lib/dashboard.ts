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
  period?: string;
  revenue?: number;
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
  total_quantity?: number;
  revenue?: number;
  total_revenue?: number;
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

// Mock Data Generators
const generateMockKPIStats = (): KPIStats => {
  return {
    revenue: {
      today: Math.floor(Math.random() * 15000000) + 5000000, // 5M - 20M VND
      thisMonth: Math.floor(Math.random() * 450000000) + 150000000, // 150M - 600M VND
    },
    orders: {
      today: Math.floor(Math.random() * 50) + 15, // 15 - 65 orders
      thisMonth: Math.floor(Math.random() * 1500) + 500, // 500 - 2000 orders
    },
    users: {
      total: Math.floor(Math.random() * 5000) + 1500, // 1500 - 6500 users
    },
    products: {
      total: Math.floor(Math.random() * 500) + 200, // 200 - 700 products
    },
    averageOrderValue: 0, // Will be calculated
  };
};

const generateMockRevenueChart = (granularity: string = "day"): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  const days = granularity === "month" ? 12 : 14;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = granularity === "month"
      ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    data.push({
      date: dateStr,
      period: dateStr,
      value: Math.floor(Math.random() * 25000000) + 8000000, // 8M - 33M VND
      revenue: Math.floor(Math.random() * 25000000) + 8000000,
    });
  }

  return data;
};

const generateMockRecentOrders = (limit: number): Order[] => {
  const customers = [
    { name: 'Nguyễn Văn An', email: 'nguyenvan.a@example.com' },
    { name: 'Trần Thị Bình', email: 'tranthi.b@example.com' },
    { name: 'Lê Văn Cường', email: 'levan.c@example.com' },
    { name: 'Phạm Thị Dung', email: 'phamthi.d@example.com' },
    { name: 'Hoàng Văn Em', email: 'hoangvan.e@example.com' },
    { name: 'Vũ Thị Flowers', email: 'vuthi.f@example.com' },
    { name: 'Đặng Văn Gia', email: 'dangvan.g@example.com' },
    { name: 'Bùi Thị Hương', email: 'buithi.h@example.com' },
  ];

  const statuses: Array<'pending' | 'confirmed' | 'shipping' | 'completed' | 'canceled'> = ['pending', 'confirmed', 'shipping', 'completed', 'canceled'];

  const orders: Order[] = [];
  for (let i = 0; i < limit; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const totalAmount = Math.floor(Math.random() * 15000000) + 500000;

    orders.push({
      id: 1000 + i,
      code: `ORD-${2025000 + i}`,
      status: status,
      customer_name: customer.name,
      email: customer.email,
      phone: `+84 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      address: `${Math.floor(Math.random() * 500) + 1} Đường Nguyễn Huệ, Quận 1, TP.HCM`,
      total_amount: totalAmount,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return orders.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
};

const generateMockBestSellers = (limit: number): BestSeller[] => {
  const products = [
    { name: 'Classic Navy Suit', slug: 'classic-navy-suit', baseRevenue: 45000000, baseSold: 45 },
    { name: 'Premium Cotton Shirt White', slug: 'premium-cotton-shirt-white', baseRevenue: 32000000, baseSold: 160 },
    { name: 'Slim Fit Chino Pants Black', slug: 'slim-fit-chino-pants-black', baseRevenue: 28000000, baseSold: 93 },
    { name: 'Italian Leather Oxford Shoes', slug: 'italian-leather-oxford-shoes', baseRevenue: 52000000, baseSold: 52 },
    { name: 'Merino Wool Sweater Navy', slug: 'merino-wool-sweater-navy', baseRevenue: 21000000, baseSold: 70 },
    { name: 'Linen Summer Beige Suit', slug: 'linen-summer-beige-suit', baseRevenue: 38000000, baseSold: 38 },
    { name: 'Casual Polo Shirt Pack', slug: 'casual-polo-shirt-pack', baseRevenue: 15000000, baseSold: 100 },
    { name: 'Formal Trousers Gray', slug: 'formal-trousers-gray', baseRevenue: 19000000, baseSold: 76 },
  ];

  return products.slice(0, limit).map((product, index) => ({
    product_id: 100 + index,
    name: product.name,
    slug: product.slug,
    totalSold: product.baseSold + Math.floor(Math.random() * 20),
    total_quantity: product.baseSold + Math.floor(Math.random() * 20),
    revenue: product.baseRevenue + Math.floor(Math.random() * 5000000),
    total_revenue: product.baseRevenue + Math.floor(Math.random() * 5000000),
    imageUrl: null,
  }));
};

const generateMockAnalytics = (params: { from: string; to: string }): AnalyticsData => {
  return {
    conversionRate: Math.round((Math.random() * 3 + 2) * 10) / 10, // 2.0% - 5.0%
    bounceRate: Math.round((Math.random() * 30 + 30) * 10) / 10, // 30% - 60%
    averageSessionDuration: Math.floor(Math.random() * 300) + 120, // 120 - 420 seconds
    pageViews: Math.floor(Math.random() * 50000) + 10000, // 10K - 60K
  };
};

// API Functions with fallback to mock data
export async function getKPIStats(): Promise<KPIStats> {
  try {
    const res = await adminApiClient.get<KPIStats>("/dashboard/stats");
    const stats = res.data;
    const averageOrderValue =
      stats?.revenue?.thisMonth && stats?.orders?.thisMonth
        ? stats.revenue.thisMonth / Math.max(1, stats.orders.thisMonth)
        : undefined;
    return { ...stats, averageOrderValue };
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock KPI stats due to API error');
    const mockStats = generateMockKPIStats();
    mockStats.averageOrderValue = mockStats.revenue!.thisMonth! / Math.max(1, mockStats.orders!.thisMonth!);
    return mockStats;
  }
}

export async function getRevenueChart(params: RevenueChartParams = {}): Promise<TimeSeriesPoint[]> {
  try {
    const query: Record<string, any> = {};
    if (params.from) query.from = params.from;
    if (params.to) query.to = params.to;
    if (params.granularity) query.groupBy = params.granularity;

    const res = await adminApiClient.get<TimeSeriesPoint[]>("/dashboard/revenue", {
      params: query,
    });
    return res.data ?? [];
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock revenue chart data due to API error');
    return generateMockRevenueChart(params.granularity);
  }
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  try {
    const res = await adminApiClient.get<Order[]>("/dashboard/recent-orders", {
      params: { limit },
    });
    return res.data ?? [];
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock recent orders due to API error');
    return generateMockRecentOrders(limit);
  }
}

export async function getBestSellers(params: { limit?: number; from?: string; to?: string } = {}): Promise<BestSeller[]> {
  try {
    const query: Record<string, any> = {};
    if (params.limit) query.limit = params.limit;
    if (params.from) query.from = params.from;
    if (params.to) query.to = params.to;

    const res = await adminApiClient.get<BestSeller[]>("/dashboard/best-sellers", {
      params: query,
    });
    return res.data ?? [];
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock best sellers due to API error');
    return generateMockBestSellers(params.limit || 5);
  }
}

export async function getAnalyticsData(params: { from: string; to: string }): Promise<AnalyticsData> {
  try {
    const res = await adminApiClient.get<AnalyticsData>("/stats/revenue", {
      params,
    });
    return res.data ?? {};
  } catch (error) {
    // Fallback to mock data
    console.log('Using mock analytics data due to API error');
    return generateMockAnalytics(params);
  }
}

// Export mock generators for testing
export const mockDataGenerators = {
  generateMockKPIStats,
  generateMockRevenueChart,
  generateMockRecentOrders,
  generateMockBestSellers,
  generateMockAnalytics,
};

