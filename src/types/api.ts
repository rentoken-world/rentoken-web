// 房产相关类型定义
export interface Property {
  id: string;
  title: string;
  location: string;
  description: string;
  monthlyRent: number;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  apy: number;
  imageUrl: string;
  status: "funding" | "active" | "completed";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// 投资相关类型定义
export interface Investment {
  id: string;
  propertyId: string;
  investorAddress: string;
  tokenAmount: number;
  investmentAmount: number;
  purchaseDate: string;
  property?: Property;
}

// 用户投资统计 - 统一字段命名
export interface InvestorStats {
  totalInvested: number;
  monthlyIncome: number;
  totalProperties: number; // 统一使用totalProperties
  averageApy: number; // 统一使用averageApy
  totalTokens?: number;
  nextPaymentDays?: number;
  monthlyGrowth?: number;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Property['status'];
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
