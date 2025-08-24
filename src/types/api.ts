// RentToken 阶段枚举，与合约保持一致
export enum RentTokenPhase {
  FUNDRAISING = 0,    // 募资阶段
  OPERATING = 1,      // 运营阶段
  MATURED = 2,        // 成熟阶段
  REFUNDING = 3,      // 退款阶段
}

// 房产的区块链状态信息
export interface PropertyBlockchainState {
  // 用户余额信息
  userBalance?: {
    balance: string;                    // 格式化后的余额
    formattedBalance: string;           // 显示用余额
    decimals?: number;                  // 代币精度
  };
  // 合约阶段信息
  phase?: {
    value: RentTokenPhase;              // 阶段值
    name: string;                       // 阶段名称
    description: string;                // 阶段中文描述
    isFundraising: boolean;             // 是否为募资阶段
    isOperating: boolean;               // 是否为运营阶段
    isMatured: boolean;                 // 是否为成熟阶段
    isRefunding: boolean;               // 是否为退款阶段
  };
  // 可领取收益信息
  claimable?: {
    amount: string;                     // 格式化后的可领取金额
    formattedAmount: string;            // 显示用金额
    hasClaimableAmount: boolean;        // 是否有可领取收益
    payoutTokenAddress?: string;        // 支付代币地址
  };
  // 状态元信息
  isLoading?: boolean;                  // 是否正在加载区块链数据
  isError?: boolean;                    // 是否有错误
  lastUpdated?: number;                 // 最后更新时间戳
}

// 房产相关类型定义
export interface Property {
  title: string;
  location: string;
  description: string;
  monthlyRent: number;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  apy: number;
  imageUrl: string;
  status: "0" | "1" | "2" | "3" | "4";
  ownerId: string;
  owner:string;
  landlord: string;
  createdAt: string;
  updatedAt: string;
  // 区块链相关字段
  renTokenAddress?: string;             // RentToken合约地址
  blockchainState?: PropertyBlockchainState; // 区块链状态信息
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
