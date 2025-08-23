// 数据库服务层 - 这里使用内存数据模拟，实际项目中应该连接真实数据库
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
  {
    id: "2", 
    title: "Downtown Office Building",
    location: "San Francisco, CA, USA",
    description: "Modern office building in downtown San Francisco with high-quality tenants.",
    monthlyRent: 25000,
    tokenPrice: 250,
    totalTokens: 2000,
    soldTokens: 1800,
    apy: 9.2,
    imageUrl: "/property-2.jpg",
    status: "active",
    ownerId: "owner2",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Suburban Family Home",
    location: "Austin, TX, USA", 
    description: "Beautiful family home in a quiet suburban neighborhood with great schools.",
    monthlyRent: 3200,
    tokenPrice: 50,
    totalTokens: 800,
    soldTokens: 800,
    apy: 7.8,
    imageUrl: "/property-3.jpg",
    status: "completed",
    ownerId: "owner3",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "4",
    title: "Miami Beach Condo",
    location: "Miami, FL, USA",
    description: "Oceanfront condo with direct beach access and resort-style amenities.",
    monthlyRent: 4800,
    tokenPrice: 75,
    totalTokens: 1200,
    soldTokens: 950,
    apy: 8.8,
    imageUrl: "/property-4.jpg",
    status: "funding",
    ownerId: "owner4",
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "5",
    title: "Seattle Tech Hub Apartment",
    location: "Seattle, WA, USA",
    description: "Modern apartment near major tech companies with smart home features.",
    monthlyRent: 6200,
    tokenPrice: 120,
    totalTokens: 1500,
    soldTokens: 1500,
    apy: 9.5,
    imageUrl: "/property-5.jpg",
    status: "active",
    ownerId: "owner5",
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
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
  {
    id: "inv2",
    propertyId: "2",
    investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
    tokenAmount: 30,
    investmentAmount: 7500,
    purchaseDate: "2024-11-01T00:00:00Z",
  },
  {
    id: "inv3",
    propertyId: "4",
    investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
    tokenAmount: 25,
    investmentAmount: 1875,
    purchaseDate: "2024-11-15T00:00:00Z",
  },
];

// 数据库服务类
export class DatabaseService {
  // 获取房产列表
  static async getProperties(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: Property['status'];
    ownerId?: string;
  }) {
    const { page = 1, limit = 12, search = '', status, ownerId } = params;
    
    let filteredProperties = [...propertiesDB];

    // 搜索过滤
    if (search) {
      filteredProperties = filteredProperties.filter(
        property => 
          property.title.toLowerCase().includes(search.toLowerCase()) ||
          property.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 状态过滤
    if (status) {
      filteredProperties = filteredProperties.filter(property => property.status === status);
    }

    // 业主过滤
    if (ownerId) {
      filteredProperties = filteredProperties.filter(property => property.ownerId === ownerId);
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
    return propertiesDB.find(property => property.id === id) || null;
  }

  // 获取投资者的投资记录
  static async getInvestmentsByAddress(address: string): Promise<Investment[]> {
    return investmentsDB.filter(
      inv => inv.investorAddress.toLowerCase() === address.toLowerCase()
    );
  }

  // 获取投资者统计数据
  static async getInvestorStats(address: string): Promise<InvestorStats> {
    const investments = await this.getInvestmentsByAddress(address);
    
    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.investmentAmount, 0
    );

    // 获取投资的房产信息来计算加权平均APY
    const investedProperties = investments.map(inv => {
      const property = propertiesDB.find(p => p.id === inv.propertyId);
      return { investment: inv, property };
    }).filter(item => item.property);

    const weightedApy = investedProperties.length > 0 
      ? investedProperties.reduce((sum, item) => {
          const weight = item.investment.investmentAmount / totalInvested;
          return sum + (item.property!.apy * weight);
        }, 0)
      : 0;

    const monthlyIncome = (totalInvested * weightedApy / 100) / 12;

    return {
      totalInvested,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      totalProperties: investments.length, // 字段名已经正确
      averageApy: Math.round(weightedApy * 10) / 10, // 字段名已经正确
      nextPaymentDays: 12,
      monthlyGrowth: 5.2,
    };
  }

  // 创建新房产 (业主功能)
  static async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const newProperty: Property = {
      ...propertyData,
      id: `property_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    propertiesDB.push(newProperty);
    return newProperty;
  }

  // 创建投资记录
  static async createInvestment(investmentData: Omit<Investment, 'id' | 'purchaseDate'>): Promise<Investment> {
    const newInvestment: Investment = {
      ...investmentData,
      id: `investment_${Date.now()}`,
      purchaseDate: new Date().toISOString(),
    };

    investmentsDB.push(newInvestment);

    // 更新房产的已售代币数量
    const property = propertiesDB.find(p => p.id === investmentData.propertyId);
    if (property) {
      property.soldTokens += investmentData.tokenAmount;
      property.updatedAt = new Date().toISOString();
      
      // 检查是否售完
      if (property.soldTokens >= property.totalTokens) {
        property.status = 'completed';
      }
    }

    return newInvestment;
  }

  // 更新房产状态
  static async updatePropertyStatus(id: string, status: Property['status']): Promise<Property | null> {
    const property = propertiesDB.find(p => p.id === id);
    if (property) {
      property.status = status;
      property.updatedAt = new Date().toISOString();
      return property;
    }
    return null;
  }

  // 获取平台统计数据
  static async getPlatformStats() {
    const totalValueLocked = propertiesDB.reduce((sum, property) => 
      sum + (property.soldTokens * property.tokenPrice), 0
    );

    const totalProperties = propertiesDB.length;
    const activeInvestors = new Set(investmentsDB.map(inv => inv.investorAddress)).size;
    
    const weightedAverageYield = propertiesDB.length > 0
      ? propertiesDB.reduce((sum, property) => sum + property.apy, 0) / propertiesDB.length
      : 0;

    return {
      totalValueLocked,
      totalProperties,
      activeInvestors,
      averageYield: Math.round(weightedAverageYield * 10) / 10,
    };
  }
}

export default DatabaseService;
