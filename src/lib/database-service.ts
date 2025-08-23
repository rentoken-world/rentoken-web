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
  status: number;
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
      status: 0,
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
  getInvestorStats(): Promise<InvestorStats>;
  getPlatformStats(): Promise<any>;

}

// 数据库服务导出 - 已切换到 Prisma 数据库
// 如果需要切换回内存数据库进行测试，可以取消注释下面一行并注释掉 PrismaService
// export const db: DatabaseInterface = DatabaseService;
import { PrismaService } from './database-prisma';
export const db: DatabaseInterface = PrismaService;
