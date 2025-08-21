// 临时数据库连接 - 使用现有的模拟数据直到数据库连接配置完成
import { Property, Investment, InvestorStats } from '@/types/api';

// 模拟数据库存储
let propertiesDB: Property[] = [
  {
    id: "1",
    title: "Manhattan Luxury Apartment",
    location: "New York, NY, USA",
    description: "A premium luxury apartment in the heart of Manhattan with stunning city views.",
    monthlyRent: 8500,
    tokenPrice: 100,
    totalTokens: 1000,
    soldTokens: 650,
    apy: 8.5,
    imageUrl: "/property-1.jpg",
    status: "funding",
    ownerId: "owner1",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  // ... 其他数据
];

let investmentsDB: Investment[] = [
  {
    id: "inv1",
    propertyId: "1",
    investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
    tokenAmount: 50,
    investmentAmount: 5000,
    purchaseDate: "2024-10-15T00:00:00Z",
  },
];

// KYC数据库模拟
let kycDB: KycStatus[] = [
  {
    walletAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
    status: "approved",
    submittedAt: new Date("2024-10-01T00:00:00Z"),
    approvedAt: new Date("2024-10-02T00:00:00Z"),
  },
  {
    walletAddress: "0x1234567890123456789012345678901234567890",
    status: "pending",
    submittedAt: new Date("2024-11-15T00:00:00Z"),
  },
];

// KYC状态接口
export interface KycStatus {
  walletAddress: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  reason?: string;
}

// KYC申请参数接口
export interface CreateKycApplicationParams {
  walletAddress: string;
  email: string;
  fullName: string;
  documents?: string[];
  status: 'pending';
  submittedAt: Date;
}

// 房产筛选参数接口
export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  owner?: string;
  minPrice?: number;
  maxPrice?: number;
}

// 投资创建参数接口
export interface CreateInvestmentParams {
  propertyId: string;
  investorAddress: string;
  tokenAmount: number;
  investmentAmount: number;
}

// 投资筛选参数接口
export interface InvestmentFilters {
  page?: number;
  limit?: number;
  investorAddress?: string;
  propertyId?: string;
  status?: string;
  sortBy?: 'date' | 'amount' | 'tokens';
  sortOrder?: 'asc' | 'desc';
}

// 从API类型中导入Investment类型（已包含property字段）

// 房产创建参数接口
export interface CreatePropertyParams {
  title: string;
  description: string;
  location: string;
  price: number;
  tokenSupply: number;
  expectedYield: number;
  category: string;
  owner: string;
  imageUrl?: string;
}

// 数据库服务类 - 现在使用内存数据，准备迁移到 Prisma
export class DatabaseService {
  
  // 获取房产列表
  static async getProperties(filters: PropertyFilters) {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      category, 
      status, 
      owner,
      minPrice,
      maxPrice 
    } = filters;
    
    let filteredProperties = [...propertiesDB];

    // 搜索过滤
    if (search) {
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分类过滤
    if (category) {
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(category.toLowerCase()) || 
        property.description.toLowerCase().includes(category.toLowerCase())
      );
    }

    // 状态过滤
    if (status) {
      filteredProperties = filteredProperties.filter(property =>
        property.status === status
      );
    }

    // 房主过滤
    if (owner) {
      filteredProperties = filteredProperties.filter(property =>
        property.ownerId === owner
      );
    }

    // 价格过滤
    if (minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(property =>
        (property.tokenPrice * property.totalTokens) >= minPrice
      );
    }

    if (maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(property =>
        (property.tokenPrice * property.totalTokens) <= maxPrice
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return {
      data: paginatedProperties,
      pagination: {
        page,
        limit,
        total: filteredProperties.length,
        totalPages: Math.ceil(filteredProperties.length / limit),
      },
    };
  }

  // 根据ID获取单个房产
  static async getPropertyById(id: string): Promise<Property | null> {
    return propertiesDB.find(p => p.id === id) || null;
  }

  // 创建房产
  static async createProperty(params: CreatePropertyParams): Promise<Property> {
    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      title: params.title,
      description: params.description,
      location: params.location,
      monthlyRent: (params.price * params.expectedYield / 100) / 12,
      tokenPrice: params.price / params.tokenSupply,
      totalTokens: params.tokenSupply,
      soldTokens: 0,
      apy: params.expectedYield,
      imageUrl: params.imageUrl || `/property-placeholder.jpg`,
      status: 'funding',
      ownerId: params.owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    propertiesDB.push(newProperty);
    return newProperty;
  }

  // 删除房产
  static async deleteProperty(id: string): Promise<boolean> {
    const index = propertiesDB.findIndex(p => p.id === id);
    if (index > -1) {
      propertiesDB.splice(index, 1);
      return true;
    }
    return false;
  }

  // 创建投资
  static async createInvestment(params: CreateInvestmentParams): Promise<Investment | null> {
    const property = propertiesDB.find(p => p.id === params.propertyId);
    if (!property) return null;

    const availableTokens = property.totalTokens - property.soldTokens;
    if (availableTokens < params.tokenAmount) return null;

    const newInvestment: Investment = {
      id: `inv_${Date.now()}`,
      propertyId: params.propertyId,
      investorAddress: params.investorAddress,
      tokenAmount: params.tokenAmount,
      investmentAmount: params.investmentAmount,
      purchaseDate: new Date().toISOString(),
    };

    investmentsDB.push(newInvestment);
    
    // 更新房产的已售代币数量
    property.soldTokens += params.tokenAmount;
    property.updatedAt = new Date().toISOString();

    // 如果所有代币都售完，更新状态
    if (property.soldTokens >= property.totalTokens) {
      property.status = 'active';
    }

    return newInvestment;
  }

  // 获取投资者统计数据
  static async getInvestorStats(investorAddress: string): Promise<InvestorStats> {
    const userInvestments = investmentsDB.filter(inv => inv.investorAddress === investorAddress);
    
    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    
    // 计算加权平均收益率
    const weightedYieldSum = userInvestments.reduce((sum, inv) => {
      const property = propertiesDB.find(p => p.id === inv.propertyId);
      if (property) {
        return sum + (property.apy * inv.investmentAmount);
      }
      return sum;
    }, 0);
    
    const averageYield = totalInvested > 0 ? weightedYieldSum / totalInvested : 0;
    
    // 计算月收入
    const monthlyIncome = (totalInvested * averageYield / 100) / 12;

    return {
      totalInvested,
      monthlyIncome,
      totalProperties: userInvestments.length, // 统一使用totalProperties
      averageApy: averageYield, // 统一使用averageApy
    };
  }

  // 获取平台统计数据
  static async getPlatformStats() {
    const totalProperties = propertiesDB.length;
    const activeInvestors = new Set(investmentsDB.map(inv => inv.investorAddress)).size;
    const totalValueLocked = investmentsDB.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const averageYield = propertiesDB.length > 0
      ? propertiesDB.reduce((sum, property) => sum + property.apy, 0) / propertiesDB.length
      : 0;

    return {
      totalValueLocked,
      totalProperties,
      activeInvestors,
      averageYield,
    };
  }

  // KYC状态查询
  static async getKycStatus(walletAddress: string): Promise<KycStatus> {
    const kycRecord = kycDB.find(
      (kyc) => kyc.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    return kycRecord || {
      walletAddress,
      status: 'none',
    };
  }

  // 创建KYC申请
  static async createKycApplication(params: CreateKycApplicationParams): Promise<KycStatus> {
    const { walletAddress, email, fullName, documents, status, submittedAt } = params;

    // 检查是否已经存在KYC记录
    const existingIndex = kycDB.findIndex(
      (kyc) => kyc.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    const newKycRecord: KycStatus = {
      walletAddress,
      status,
      submittedAt,
    };

    if (existingIndex >= 0) {
      // 更新现有记录
      kycDB[existingIndex] = { ...kycDB[existingIndex], ...newKycRecord };
      return kycDB[existingIndex];
    } else {
      // 创建新记录
      kycDB.push(newKycRecord);
      return newKycRecord;
    }
  }

  // 更新KYC状态（管理员用）
  static async updateKycStatus(
    walletAddress: string, 
    status: 'approved' | 'rejected', 
    reason?: string
  ): Promise<KycStatus | null> {
    const index = kycDB.findIndex(
      (kyc) => kyc.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (index === -1) {
      return null;
    }

    const now = new Date();
    kycDB[index] = {
      ...kycDB[index],
      status,
      reason,
      ...(status === 'approved' && { approvedAt: now }),
      ...(status === 'rejected' && { rejectedAt: now }),
    };

    return kycDB[index];
  }

  // 获取所有KYC记录（管理员用）
  static async getAllKycRecords(statusFilter?: string): Promise<KycStatus[]> {
    let filteredRecords = [...kycDB];

    if (statusFilter && statusFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.status === statusFilter);
    }

    // 按提交时间排序（最新的在前）
    filteredRecords.sort((a, b) => {
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bTime - aTime;
    });

    return filteredRecords;
  }

  // 获取投资列表
  static async getInvestments(filters: InvestmentFilters = {}): Promise<{
    data: Investment[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      investorAddress,
      propertyId,
      status,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filters;

    // 筛选投资
    let filteredInvestments = [...investmentsDB];

    if (investorAddress) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.investorAddress.toLowerCase() === investorAddress.toLowerCase()
      );
    }

    if (propertyId) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.propertyId === propertyId
      );
    }

    // 根据sortBy排序
    filteredInvestments.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'amount':
          aValue = a.investmentAmount;
          bValue = b.investmentAmount;
          break;
        case 'tokens':
          aValue = a.tokenAmount;
          bValue = b.tokenAmount;
          break;
        case 'date':
        default:
          aValue = new Date(a.purchaseDate).getTime();
          bValue = new Date(b.purchaseDate).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // 分页
    const totalCount = filteredInvestments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInvestments = filteredInvestments.slice(startIndex, endIndex);

    // 添加房产信息到投资记录
    const investmentsWithPropertyInfo = paginatedInvestments.map(investment => {
      const property = propertiesDB.find(p => p.id === investment.propertyId);
      return {
        ...investment,
        property: property || undefined,
      };
    });

    return {
      data: investmentsWithPropertyInfo,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }
}

// 数据库接口，为将来的 Prisma 迁移做准备
export interface DatabaseInterface {
  getProperties(filters: PropertyFilters): Promise<any>;
  getPropertyById(id: string): Promise<Property | null>;
  createProperty(params: CreatePropertyParams): Promise<Property>;
  deleteProperty(id: string): Promise<boolean>;
  createInvestment(params: CreateInvestmentParams): Promise<Investment | null>;
  getInvestments(filters: InvestmentFilters): Promise<any>;
  getInvestorStats(investorAddress: string): Promise<InvestorStats>;
  getPlatformStats(): Promise<any>;
  // KYC相关方法
  getKycStatus(walletAddress: string): Promise<KycStatus>;
  createKycApplication(params: CreateKycApplicationParams): Promise<KycStatus>;
  updateKycStatus(walletAddress: string, status: 'approved' | 'rejected', reason?: string): Promise<KycStatus | null>;
  getAllKycRecords(statusFilter?: string): Promise<KycStatus[]>;
}

// 数据库服务导出 - 现在使用内存数据库，准备迁移到 Prisma
// 当 Prisma 配置完成后，可以切换到 PrismaService
// import { PrismaService } from './database-prisma';
export const db: DatabaseInterface = DatabaseService;
