import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化示例数据...');

  // 清理现有数据
  await prisma.investment.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.transaction.deleteMany({});

  // 创建示例房产
  const properties = await prisma.property.createMany({
    data: [
      {
        title: "Manhattan Luxury Apartment",
        location: "New York, NY, USA",
        description: "A premium luxury apartment in the heart of Manhattan with stunning city views and modern amenities.",
        price: 1000000,
        tokenSupply: 1000,
        availableTokens: 350,
        tokenPrice: 1000,
        expectedYield: 8.5,
        category: "residential",
        status: "funding",
        owner: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        imageUrl: "/property-1.jpg",
      },
      {
        title: "Downtown Office Building",
        location: "San Francisco, CA, USA",
        description: "Modern office building in downtown San Francisco with high-quality tenants and excellent rental yields.",
        price: 2500000,
        tokenSupply: 2000,
        availableTokens: 200,
        tokenPrice: 1250,
        expectedYield: 7.2,
        category: "commercial",
        status: "active",
        owner: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        imageUrl: "/property-2.jpg",
      },
      {
        title: "Miami Beach Condo",
        location: "Miami, FL, USA", 
        description: "Luxury beachfront condominium with ocean views and resort-style amenities.",
        price: 750000,
        tokenSupply: 1500,
        availableTokens: 600,
        tokenPrice: 500,
        expectedYield: 9.1,
        category: "residential",
        status: "funding",
        owner: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        imageUrl: "/property-3.jpg",
      },
      {
        title: "Austin Retail Plaza",
        location: "Austin, TX, USA",
        description: "Prime retail space in a growing Austin neighborhood with established tenant base.",
        price: 1200000,
        tokenSupply: 1200,
        availableTokens: 250,
        tokenPrice: 1000,
        expectedYield: 8.8,
        category: "commercial",
        status: "funding",
        owner: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A4",
        imageUrl: "/property-4.jpg",
      },
      {
        title: "Seattle Tech Hub Apartment",
        location: "Seattle, WA, USA",
        description: "Modern apartment building near major tech companies with smart home features throughout.",
        price: 1800000,
        tokenSupply: 1500,
        availableTokens: 0,
        tokenPrice: 1200,
        expectedYield: 9.5,
        actualYield: 9.8,
        category: "residential",
        status: "active",
        owner: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A5",
        imageUrl: "/property-5.jpg",
      },
    ],
  });

  console.log(`创建了 ${properties.count} 个房产`);

  // 获取创建的房产ID
  const createdProperties = await prisma.property.findMany({
    select: { id: true, title: true }
  });

  // 创建示例投资
  const investments = await prisma.investment.createMany({
    data: [
      {
        propertyId: createdProperties[0].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 50,
        investmentAmount: 50000,
      },
      {
        propertyId: createdProperties[0].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        tokenAmount: 100,
        investmentAmount: 100000,
      },
      {
        propertyId: createdProperties[1].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 200,
        investmentAmount: 250000,
      },
      {
        propertyId: createdProperties[4].id, // Seattle apartment (fully sold)
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 500,
        investmentAmount: 600000,
      },
      {
        propertyId: createdProperties[4].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        tokenAmount: 300,
        investmentAmount: 360000,
      },
      {
        propertyId: createdProperties[4].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A6",
        tokenAmount: 700,
        investmentAmount: 840000,
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

  // 创建示例交易记录
  const transactions = await prisma.transaction.createMany({
    data: [
      {
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        from: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        to: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        amount: 50000,
        tokenAmount: 50,
        propertyId: createdProperties[0].id,
        type: "purchase",
        status: "confirmed",
        blockNumber: 18500000,
        gasUsed: "21000",
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef12",
        from: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        to: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A1",
        amount: 100000,
        tokenAmount: 100,
        propertyId: createdProperties[0].id,
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
