import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化示例数据...');

  // 清理现有数据
  await prisma.investment.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.transaction.deleteMany({});

  // 创建示例房产（基于备份数据）
  const properties = await prisma.property.createMany({
    data: [
      {
        id: 1,
        title: "Manhattan Luxury Apartment",
        location: "New York, NY, USA",
        description: "A premium luxury apartment in the heart of Manhattan with stunning city views.",
        price: 40000,
        availableTokens: 160,
        tokenPrice: 100,
        monthlyRent: 8500,
        totalTokens: 400,
        soldTokens: 240,
        apy: 283.3,
        imageUrl: "/property-1.jpg",
        status: 1,
        ownerId: "owner_dc79C8",
        createdAt: new Date("2025-08-22T10:00:00.000Z"),
        updatedAt: new Date("2025-08-23T14:17:12.622Z"),
        propertyId: 1,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(40000000000),
        minRaising: BigInt(28800000000),
        maxRaising: BigInt(36000000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        offchainURL: "https://ipfs.io/ipfs/QmTestApartment",
        renTokenAddress: "0x03624F93910f251e0861fabc262d3658b39247C7"
      },
      {
        id: 2,
        title: "Luxury Villa in Beverly Hills",
        location: "Beverly Hills, CA, USA",
        description: "An exquisite luxury villa featuring private pool, garden, and panoramic city views.",
        price: 180000,
        availableTokens: 379,
        tokenPrice: 100,
        monthlyRent: 15000,
        totalTokens: 1800,
        soldTokens: 1421,
        apy: 100,
        imageUrl: "/property-2.jpg",
        status: 1,
        ownerId: "owner_dc79C8",
        createdAt: new Date("2025-08-22T10:00:00.000Z"),
        updatedAt: new Date("2025-08-23T14:16:55.342Z"),
        propertyId: 2,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(180000000000),
        minRaising: BigInt(120000000000),
        maxRaising: BigInt(180000000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        offchainURL: "https://ipfs.io/ipfs/QmLuxuryVilla",
        renTokenAddress: "0xd62c31b76C346760f2524630268B44D01c31De58"
      },
      {
        id: 3,
        title: "Cozy Studio in Downtown",
        location: "San Francisco, CA, USA",
        description: "A modern studio apartment perfect for young professionals in the vibrant downtown area.",
        price: 19200,
        availableTokens: 59,
        tokenPrice: 100,
        monthlyRent: 3200,
        totalTokens: 192,
        soldTokens: 133,
        apy: 200,
        imageUrl: "/property-3.jpg",
        status: 3,
        ownerId: "owner_dc79C8",
        createdAt: new Date("2025-08-22T10:00:00.000Z"),
        updatedAt: new Date("2025-08-23T14:17:22.306Z"),
        propertyId: 3,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(19200000000),
        minRaising: BigInt(10000000000),
        maxRaising: BigInt(19200000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        offchainURL: "https://ipfs.io/ipfs/QmCozyStudio",
        renTokenAddress: "0xcC148AFB7183cb29B731eE1B769Fe42E5380092D"
      },
      {
        id: 4,
        title: "Cozy Studio in Downtown",
        location: "San Francisco, CA, USA",
        description: "A modern studio apartment perfect for young professionals in the vibrant downtown area.",
        price: 19200,
        availableTokens: 59,
        tokenPrice: 100,
        monthlyRent: 3200,
        totalTokens: 192,
        soldTokens: 133,
        apy: 200,
        imageUrl: "/property-3.jpg",
        status: 2,
        ownerId: "owner_dc79C8",
        createdAt: new Date("2025-08-23T10:00:00.000Z"),
        updatedAt: new Date("2025-08-23T13:16:48.408Z"),
        propertyId: 4,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(19200000000),
        minRaising: BigInt(10000000000),
        maxRaising: BigInt(19200000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        offchainURL: "https://ipfs.io/ipfs/QmCozyStudio",
        renTokenAddress: "0x594af88B22a402dc2F633e71028292D5Ee8A078a"
      },
      {
        id: 5,
        title: "233",
        location: "SZ",
        description: "666",
        price: 61.937,
        availableTokens: 1000,
        tokenPrice: 0.06193693693693694,
        monthlyRent: 0,
        totalTokens: 1000,
        soldTokens: 0,
        apy: 0,
        imageUrl: "/property-5.jpg",
        status: 0,
        ownerId: "unknown",
        createdAt: new Date("2025-08-22T17:08:48.531Z"),
        updatedAt: new Date("2025-08-23T13:28:32.809Z"),
        propertyId: 5,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(61937000),
        minRaising: BigInt(0),
        maxRaising: BigInt(61937000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        offchainURL: "https://example.com",
        renTokenAddress: "0x0000000000000000000000000000000000000000"
      },
      {
        id: 6,
        title: "bape",
        location: "1",
        description: "1",
        price: 0.001,
        availableTokens: 1000,
        tokenPrice: 0.000001,
        monthlyRent: 0,
        totalTokens: 1000,
        soldTokens: 0,
        apy: 0,
        imageUrl: "/property-6.jpg",
        status: 0,
        ownerId: "unknown",
        createdAt: new Date("2025-08-23T08:32:02.238Z"),
        updatedAt: new Date("2025-08-23T13:28:32.809Z"),
        propertyId: 6,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(1000),
        minRaising: BigInt(0),
        maxRaising: BigInt(1000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        offchainURL: "https://example.com",
        renTokenAddress: "0x0000000000000000000000000000000000000000"
      },
      {
        id: 7,
        title: "testTitle",
        location: "SZ",
        description: "testDesc",
        price: 100,
        availableTokens: 1000,
        tokenPrice: 0.1,
        monthlyRent: 0,
        totalTokens: 1000,
        soldTokens: 0,
        apy: 0,
        imageUrl: "/property-7.jpg",
        status: 0,
        ownerId: "unknown",
        createdAt: new Date("2025-08-23T09:50:01.101Z"),
        updatedAt: new Date("2025-08-23T13:28:32.809Z"),
        propertyId: 7,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(100000000),
        minRaising: BigInt(0),
        maxRaising: BigInt(100000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        offchainURL: "https://example.com",
        renTokenAddress: "0x0000000000000000000000000000000000000000"
      },
      {
        id: 8,
        title: "test",
        location: "SH",
        description: "test233",
        price: 100,
        availableTokens: 1000,
        tokenPrice: 0.1,
        monthlyRent: 0,
        totalTokens: 1000,
        soldTokens: 0,
        apy: 0,
        imageUrl: "/property-8.jpg",
        status: 0,
        ownerId: "unknown",
        createdAt: new Date("2025-08-22T12:24:35.000Z"),
        updatedAt: new Date("2025-08-23T13:28:32.809Z"),
        propertyId: 8,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(100000000),
        minRaising: BigInt(0),
        maxRaising: BigInt(100000000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        offchainURL: "https://example.com",
        renTokenAddress: "0x0000000000000000000000000000000000000000"
      },
      {
        id: 9,
        title: "fyhTest",
        location: "ShenZhen",
        description: "fyhTest",
        price: 0.1,
        availableTokens: 1000,
        tokenPrice: 0.0001,
        monthlyRent: 0,
        totalTokens: 1000,
        soldTokens: 0,
        apy: 0,
        imageUrl: "/property-9.jpg",
        status: 0,
        ownerId: "unknown",
        createdAt: new Date("2025-08-23T13:23:31.260Z"),
        updatedAt: new Date("2025-08-23T13:30:22.060Z"),
        propertyId: 9,
        payoutToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        valuation: BigInt(100000),
        minRaising: BigInt(0),
        maxRaising: BigInt(100000),
        accrualStart: BigInt(1755856800),
        accrualEnd: BigInt(1841392800),
        landlord: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        offchainURL: "https://example.com",
        renTokenAddress: "0x0000000000000000000000000000000000000000"
      }
    ],
  });

  console.log(`创建了 ${properties.count} 个房产`);

  // 创建示例投资（使用固定的房产ID）
  const investments = await prisma.investment.createMany({
    data: [
      {
        propertyId: 1, // Manhattan Luxury Apartment
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 50,
        investmentAmount: 5000,
      },
      {
        propertyId: 1, // Manhattan Luxury Apartment
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        tokenAmount: 100,
        investmentAmount: 10000,
      },
      {
        propertyId: 2, // Luxury Villa in Beverly Hills
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 200,
        investmentAmount: 20000,
      },
      {
        propertyId: 3, // Cozy Studio in Downtown
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 50,
        investmentAmount: 5000,
      },
      {
        propertyId: 3, // Cozy Studio in Downtown
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        tokenAmount: 30,
        investmentAmount: 3000,
      },
      {
        propertyId: 2, // Luxury Villa in Beverly Hills
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A6",
        tokenAmount: 100,
        investmentAmount: 10000,
      },
    ],
  });

  console.log(`创建了 ${investments.count} 个投资记录`);

  // 创建示例用户
  const users = await prisma.user.createMany({
    data: [
      {
        address: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        name: "Alice Johnson",
        email: "alice@example.com",
        isVerified: true,
      },
      {
        address: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        name: "Bob Smith",
        email: "bob@example.com",
        isVerified: true,
      },
      {
        address: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        name: "Carol Davis",
        email: "carol@example.com",
        isVerified: false,
      },
    ],
  });

  console.log(`创建了 ${users.count} 个用户`);

  // 创建示例交易记录（使用固定的房产ID）
  const transactions = await prisma.transaction.createMany({
    data: [
      {
        hash: "0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456",
        from: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        to: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        amount: 5000,
        tokenAmount: 50,
        propertyId: 1, // Manhattan Luxury Apartment
        type: "purchase",
        status: "confirmed",
        blockNumber: 18500000,
        gasUsed: "21000",
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef12345678901234567890abcdef",
        from: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        to: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        amount: 10000,
        tokenAmount: 100,
        propertyId: 1, // Manhattan Luxury Apartment
        type: "purchase",
        status: "confirmed",
        blockNumber: 18500100,
        gasUsed: "21000",
      },
    ],
  });

  console.log(`创建了 ${transactions.count} 个交易记录`);

  console.log('示例数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('初始化数据时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
