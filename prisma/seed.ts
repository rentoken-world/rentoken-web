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
        "id": "1",
        "title": "Manhattan Luxury Apartment",
        "location": "New York, NY, USA",
        "description": "A premium luxury apartment in the heart of Manhattan with stunning city views.",
        "price": 40000,  // 添加必填的 price 字段
        "availableTokens": 160,  // totalTokens - soldTokens
        "tokenPrice": 100,
        "monthlyRent": 8500,
        "totalTokens": 400,
        "soldTokens": 240,
        "apy": 283.3,
        "imageUrl": "/property-1.jpg",
        "status": "funding",
        "ownerId": "owner_dc79C8",
        "createdAt": new Date("2025-08-22T10:00:00.000Z"),
        "updatedAt": new Date("2025-08-21T16:58:21.946Z"),
        "propertyId": 1,
        "payoutToken": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "valuation": BigInt(40000000000),
        "minRaising": BigInt(28800000000),
        "maxRaising": BigInt(36000000000),
        "accrualStart": BigInt(1755856800),
        "accrualEnd": BigInt(1841392800),
        "landlord": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "docHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "offchainURL": "https://ipfs.io/ipfs/QmTestApartment",
        "renTokenAddress": "0x03624F93910f251e0861fabc262d3658b39247C7"
      },
      {
        "id": "2",
        "title": "Luxury Villa in Beverly Hills",
        "location": "Beverly Hills, CA, USA",
        "description": "An exquisite luxury villa featuring private pool, garden, and panoramic city views.",
        "price": 180000,  // 添加必填的 price 字段
        "availableTokens": 379,  // totalTokens - soldTokens
        "tokenPrice": 100,
        "monthlyRent": 15000,
        "totalTokens": 1800,
        "soldTokens": 1421,
        "apy": 100,
        "imageUrl": "/property-2.jpg",
        "status": "active",
        "ownerId": "owner_dc79C8",
        "createdAt": new Date("2025-08-22T10:00:00.000Z"),
        "updatedAt": new Date("2025-08-21T16:58:21.946Z"),
        "propertyId": 2,
        "payoutToken": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "valuation": BigInt(180000000000),
        "minRaising": BigInt(120000000000),
        "maxRaising": BigInt(180000000000),
        "accrualStart": BigInt(1755856800),
        "accrualEnd": BigInt(1841392800),
        "landlord": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "docHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "offchainURL": "https://ipfs.io/ipfs/QmLuxuryVilla",
        "renTokenAddress": "0xd62c31b76C346760f2524630268B44D01c31De58"
      },
      {
        "id": "3",
        "title": "Cozy Studio in Downtown",
        "location": "San Francisco, CA, USA",
        "description": "A modern studio apartment perfect for young professionals in the vibrant downtown area.",
        "price": 19200,  // 添加必填的 price 字段
        "availableTokens": 59,  // totalTokens - soldTokens
        "tokenPrice": 100,
        "monthlyRent": 3200,
        "totalTokens": 192,
        "soldTokens": 133,
        "apy": 200,
        "imageUrl": "/property-3.jpg",
        "status": "active",
        "ownerId": "owner_dc79C8",
        "createdAt": new Date("2025-08-22T10:00:00.000Z"),
        "updatedAt": new Date("2025-08-21T16:58:21.946Z"),
        "propertyId": 3,
        "payoutToken": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "valuation": BigInt(19200000000),
        "minRaising": BigInt(10000000000),
        "maxRaising": BigInt(19200000000),
        "accrualStart": BigInt(1755856800),
        "accrualEnd": BigInt(1841392800),
        "landlord": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "docHash": "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        "offchainURL": "https://ipfs.io/ipfs/QmCozyStudio",
        "renTokenAddress": "0xcC148AFB7183cb29B731eE1B769Fe42E5380092D"
      }
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
        propertyId: createdProperties[2].id, // 修复：使用索引2（第三个房产）
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A2",
        tokenAmount: 50,
        investmentAmount: 50000,
      },
      {
        propertyId: createdProperties[2].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A3",
        tokenAmount: 30,
        investmentAmount: 30000,
      },
      {
        propertyId: createdProperties[1].id,
        investorAddress: "0x742d35Cc6634C0532925a3b8D6A0a4D3B6c8b1A6",
        tokenAmount: 100,
        investmentAmount: 100000,
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
