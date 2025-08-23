import { prisma } from './prisma';
import type { Property, Investment, InvestorStats } from '@/types/api';

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
  propertyId: number; // 改为 number 以匹配数据库
  investorAddress: string;
  tokenAmount: number;
  investmentAmount: number;
}

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
  status?: number;  // 添加可选的状态字段
  imageUrl?: string;
}

// Prisma 数据库服务类
export class PrismaService {
  
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
    
    const skip = (page - 1) * limit;
    
    // 构建 where 条件
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (owner) {
      where.owner = owner;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // 执行查询
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          investments: true,
        },
      }),
      prisma.property.count({ where }),
    ]);

    // 转换数据格式以匹配现有的 API 接口
    const formattedProperties: Property[] = properties.map(property => ({
      id: property.id.toString(), // 转换为字符串
      title: property.title,
      location: property.location,
      description: property.description,
      monthlyRent: property.monthlyRent, // 直接使用新字段
      tokenPrice: property.tokenPrice, // 直接使用新字段
      totalTokens: property.totalTokens, // 直接使用新字段
      soldTokens: property.soldTokens, // 直接使用新字段
      apy: property.apy, // 直接使用新字段
      imageUrl: property.imageUrl || `/property-${property.id}.jpg`,
      status: property.status.toString() as Property['status'], // 转换为字符串枚举
      ownerId: property.ownerId, // 使用新字段名 ownerId 而不是 owner
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      renTokenAddress: property.renTokenAddress,
    }));
    console.log('formattedProperties', formattedProperties)
    return {
      data: formattedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 根据ID获取单个房产
  static async getPropertyById(id: string): Promise<Property | null> {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) }, // 转换为数字
      include: {
        investments: true,
      },
    });

    if (!property) return null;

    return {
      id: property.id.toString(), // 转换为字符串
      title: property.title,
      location: property.location,
      description: property.description,
      monthlyRent: property.monthlyRent, // 直接使用新字段
      tokenPrice: property.tokenPrice, // 直接使用新字段
      totalTokens: property.totalTokens, // 直接使用新字段
      soldTokens: property.soldTokens, // 直接使用新字段
      apy: property.apy, // 直接使用新字段
      imageUrl: property.imageUrl || `/property-${property.id}.jpg`,
      status: property.status.toString() as Property['status'], // 转换为字符串枚举
      ownerId: property.ownerId, // 使用新字段名
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    };
  }

  // 创建房产
  static async createProperty(params: CreatePropertyParams): Promise<Property> {
    console.log('createProperty:params', params)
    console.log('status type:', typeof params.status, 'value:', params.status)
    
    try {
      // 直接构建最小化的数据对象，只包含必需字段
      const property = await prisma.property.create({
        data: {
          title: params.title,
          description: params.description,
          location: params.location,
          price: Number(params.price),
          tokenSupply: Number(params.tokenSupply || 1000),
          availableTokens: Number(params.tokenSupply || 1000),
          tokenPrice: Number(params.price) / Number(params.tokenSupply || 1000),
          expectedYield: Number(params.expectedYield || 0),
          category: params.category || "residential",
          status: 0, // 硬编码为 0，避免类型问题
          imageUrl: "/property-1.jpg",
          ownerId: params.owner,
          // 所有其他字段使用默认值
        },
        include: {
          investments: true,
        },
      });

      return {
        id: property.id.toString(),
        title: property.title,
        location: property.location,
        description: property.description,
        monthlyRent: property.monthlyRent,
        tokenPrice: property.tokenPrice,
        totalTokens: property.totalTokens,
        soldTokens: property.soldTokens,
        apy: property.apy,
        imageUrl: property.imageUrl || `/property-${property.id}.jpg`,
        status: property.status.toString() as Property['status'],
        ownerId: property.ownerId,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
        renTokenAddress: property.renTokenAddress,
      };
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  // 更新房产
  static async updateProperty(id: string, updates: Partial<CreatePropertyParams>): Promise<Property | null> {
    try {
      const property = await prisma.property.update({
        where: { id: parseInt(id) }, // 转换为数字
        data: {
          ...updates,
          status: updates.status ? Number(updates.status) : undefined, // 确保状态为数字
        },
        include: {
          investments: true,
        },
      });

      return {
        id: property.id.toString(), // 转换为字符串
        title: property.title,
        location: property.location,
        description: property.description,
        monthlyRent: property.price * (property.expectedYield / 100) / 12,
        tokenPrice: property.price / property.tokenSupply,
        totalTokens: property.tokenSupply,
        soldTokens: property.tokenSupply - property.availableTokens,
        apy: property.actualYield || property.expectedYield,
        imageUrl: property.imageUrl || `/property-${property.id}.jpg`,
        status: property.status.toString() as Property['status'], // 转换为字符串枚举
        ownerId: property.owner,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error updating property:', error);
      return null;
    }
  }

  // 删除房产
  static async deleteProperty(id: string): Promise<boolean> {
    try {
      await prisma.property.delete({
        where: { id: parseInt(id) }, // 转换为数字
      });
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  // 创建投资
  static async createInvestment(params: CreateInvestmentParams): Promise<Investment | null> {
    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 检查房产是否存在且有足够的可用代币
      const property = await tx.property.findUnique({
        where: { id: params.propertyId },
      });

      if (!property) {
        throw new Error('Property not found');
      }

      if (property.availableTokens < params.tokenAmount) {
        throw new Error('Not enough tokens available');
      }

      // 创建投资记录
      const investment = await tx.investment.create({
        data: {
          propertyId: params.propertyId,
          investorAddress: params.investorAddress,
          tokenAmount: params.tokenAmount,
          investmentAmount: params.investmentAmount,
        },
      });

      // 更新房产的可用代币数量
      await tx.property.update({
        where: { id: params.propertyId },
        data: {
          availableTokens: property.availableTokens - params.tokenAmount,
          // 如果所有代币都售完，更新状态为活跃 (1 = active)
          status: property.availableTokens - params.tokenAmount === 0 ? 1 : property.status,
        },
      });

      return investment;
    });

    return {
      id: result.id,
      propertyId: result.propertyId.toString(), // 转换为字符串以匹配 API 类型
      investorAddress: result.investorAddress,
      tokenAmount: result.tokenAmount,
      investmentAmount: result.investmentAmount,
      purchaseDate: result.purchaseDate.toISOString(),
    };
  }

  // 获取投资者统计数据
  static async getInvestorStats(): Promise<InvestorStats> {
    const investments = await prisma.investment.findMany({
      where: {  },
      include: {
        property: true,
      },
    });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const totalTokens = investments.reduce((sum, inv) => sum + inv.tokenAmount, 0);
    
    // 计算加权平均收益率
    const weightedYieldSum = investments.reduce((sum, inv) => {
      const propertyYield = inv.property.actualYield || inv.property.expectedYield;
      return sum + (propertyYield * inv.investmentAmount);
    }, 0);
    
    const averageYield = totalInvested > 0 ? weightedYieldSum / totalInvested : 0;
    
    // 计算月收入（基于当前投资和年收益率）
    const monthlyIncome = (totalInvested * averageYield / 100) / 12;

    return {
      totalInvested,
      monthlyIncome,
      totalProperties: investments.length, // 统一使用totalProperties
      averageApy: averageYield, // 统一使用averageApy
    };
  }

  // 获取平台统计数据
  static async getPlatformStats() {
    const [totalProperties, totalInvestments, properties] = await Promise.all([
      prisma.property.count(),
      prisma.investment.count(),
      prisma.property.findMany({
        include: {
          investments: true,
        },
      }),
    ]);

    const totalValueLocked = properties.reduce((sum, property) => {
      const soldTokens = property.tokenSupply - property.availableTokens;
      return sum + (soldTokens * property.tokenPrice);
    }, 0);

    const averageYield = properties.length > 0
      ? properties.reduce((sum, property) => sum + (property.actualYield || property.expectedYield), 0) / properties.length
      : 0;

    // 获取唯一投资者数量
    const uniqueInvestors = await prisma.investment.findMany({
      distinct: ['investorAddress'],
      select: { investorAddress: true },
    });

    return {
      totalValueLocked,
      totalProperties,
      activeInvestors: uniqueInvestors.length,
      averageYield,
    };
  }

  // 获取用户投资列表
  static async getUserInvestments(investorAddress: string) {
    const investments = await prisma.investment.findMany({
      where: { investorAddress },
      include: {
        property: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });

    return investments.map(investment => ({
      id: investment.id,
      propertyId: investment.propertyId.toString(), // 转换为字符串
      propertyTitle: investment.property.title,
      propertyLocation: investment.property.location,
      tokenAmount: investment.tokenAmount,
      investmentAmount: investment.investmentAmount,
      purchaseDate: investment.purchaseDate.toISOString(),
      currentYield: investment.property.actualYield || investment.property.expectedYield,
      estimatedMonthlyIncome: (investment.investmentAmount * (investment.property.actualYield || investment.property.expectedYield) / 100) / 12,
    }));
  }


  // 获取投资列表（带筛选和分页）
  static async getInvestments(filters: {
    page?: number;
    limit?: number;
    investorAddress?: string;
    propertyId?: string;
    status?: string;
    sortBy?: 'date' | 'amount' | 'tokens';
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      page = 1,
      limit = 10,
      investorAddress,
      propertyId,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (investorAddress) {
      where.investorAddress = investorAddress.toLowerCase();
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    // 构建排序
    let orderBy: any = {};
    switch (sortBy) {
      case 'amount':
        orderBy = { investmentAmount: sortOrder };
        break;
      case 'tokens':
        orderBy = { tokenAmount: sortOrder };
        break;
      case 'date':
      default:
        orderBy = { purchaseDate: sortOrder };
        break;
    }

    const [investments, totalCount] = await Promise.all([
      prisma.investment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          property: true,
        },
      }),
      prisma.investment.count({ where }),
    ]);

    const investmentsWithPropertyInfo = investments.map(investment => ({
      id: investment.id,
      propertyId: investment.propertyId.toString(), // 转换为字符串
      investorAddress: investment.investorAddress,
      tokenAmount: investment.tokenAmount,
      investmentAmount: investment.investmentAmount,
      purchaseDate: investment.purchaseDate.toISOString(),
      property: investment.property ? {
        id: investment.property.id.toString(), // 转换为字符串
        title: investment.property.title,
        location: investment.property.location,
        description: investment.property.description,
        monthlyRent: investment.property.price * (investment.property.expectedYield / 100) / 12,
        tokenPrice: investment.property.tokenPrice,
        totalTokens: investment.property.tokenSupply,
        soldTokens: investment.property.tokenSupply - investment.property.availableTokens,
        apy: investment.property.actualYield || investment.property.expectedYield,
        imageUrl: investment.property.imageUrl || `/property-${investment.property.id}.jpg`,
        status: investment.property.status.toString() as Property['status'], // 转换为字符串枚举
        ownerId: investment.property.owner,
        createdAt: investment.property.createdAt.toISOString(),
        updatedAt: investment.property.updatedAt.toISOString(),
      } : undefined,
    }));

    return {
      data: investmentsWithPropertyInfo,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}
