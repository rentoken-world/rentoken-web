const fs = require('fs');
const path = require('path');

/**
 * 将链上原始数据转换为业务结构数据
 * @param {Object} sourceData - 链上原始数据
 * @returns {Object} - 转换后的业务数据
 */
function transformPropertyData(sourceData) {
  // 将wei转换为USD (假设1 ETH = 3000 USD，这里需要根据实际情况调整)
  // 注意：这里的数值看起来已经是USD的微单位，所以直接除以1e6
  const weiToUSD = (wei) => wei / 1e6;
  
  // 将timestamp转换为ISO字符串
  const timestampToISO = (timestamp) => {
    return new Date(timestamp * 1000).toISOString();
  };

  // 根据propertyId生成不同的属性信息
  const propertyInfo = {
    1: {
      title: "Manhattan Luxury Apartment",
      location: "New York, NY, USA",
      description: "A premium luxury apartment in the heart of Manhattan with stunning city views.",
      monthlyRent: 8500,
      imageUrl: "/property-1.jpg"
    },
    2: {
      title: "Luxury Villa in Beverly Hills",
      location: "Beverly Hills, CA, USA",
      description: "An exquisite luxury villa featuring private pool, garden, and panoramic city views.",
      monthlyRent: 15000,
      imageUrl: "/property-2.jpg"
    },
    3: {
      title: "Cozy Studio in Downtown",
      location: "San Francisco, CA, USA",
      description: "A modern studio apartment perfect for young professionals in the vibrant downtown area.",
      monthlyRent: 3200,
      imageUrl: "/property-3.jpg"
    }
  };

  const info = propertyInfo[sourceData.propertyId] || {
    title: `Property ${sourceData.propertyId}`,
    location: "Unknown Location",
    description: "A real estate property available for investment.",
    monthlyRent: 5000,
    imageUrl: "/placeholder-property.jpg"
  };

  // 计算token相关信息
  const totalValue = weiToUSD(sourceData.valuation);
  const tokenPrice = 100; // 每个token 100 USD (根据新的业务结构)
  const totalTokens = Math.floor(totalValue / tokenPrice); // 总token数量
  const maxRaisingValue = weiToUSD(sourceData.maxRaising);
  const maxTokensToSell = Math.floor(maxRaisingValue / tokenPrice);
  
  // 模拟已售token数量 (60-80% 的可售token)
  const soldTokensRatio = 0.6 + Math.random() * 0.2; // 60-80%
  const soldTokens = Math.floor(maxTokensToSell * soldTokensRatio);

  // 计算年化收益率 APY (基于月租金和token价格)
  const monthlyYield = info.monthlyRent / (maxTokensToSell * tokenPrice);
  const apy = (monthlyYield * 12 * 100).toFixed(1); // 转换为年化百分比

  // 确定状态
  const now = Math.floor(Date.now() / 1000);
  let status = "funding";
  if (now < sourceData.accrualStart) {
    status = "upcoming";
  } else if (now > sourceData.accrualEnd) {
    status = "closed";
  }

  // 生成业主ID (基于landlord地址后缀)
  const ownerIdSuffix = sourceData.landlord.slice(-6);
  const ownerId = `owner_${ownerIdSuffix}`;

  // 生成创建和更新时间
  const createdAt = timestampToISO(sourceData.accrualStart);
  const updatedAt = timestampToISO(Date.now() / 1000);

  return {
    id: sourceData.propertyId.toString(), // 转换为字符串
    title: info.title,
    location: info.location,
    description: info.description,
    monthlyRent: info.monthlyRent,
    tokenPrice: tokenPrice,
    totalTokens: totalTokens,
    soldTokens: soldTokens,
    apy: parseFloat(apy),
    imageUrl: info.imageUrl,
    status: status,
    ownerId: ownerId,
    createdAt: createdAt,
    updatedAt: updatedAt,
    sourceData:{
      ...sourceData
    }
  };
}

/**
 * 主转换函数
 */
function transfer() {
  try {
    // 读取源数据
    const sourcePath = path.join(__dirname, '../TEST_DATA/source/propert.json');
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    // 转换数据
    const transformedData = sourceData.map(transformPropertyData);

    // 确保目标目录存在
    const dataDir = path.join(__dirname, '../TEST_DATA/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 写入转换后的数据
    const outputPath = path.join(dataDir, 'properties.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

    console.log(`✅ 数据转换完成！`);
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`📊 转换了 ${transformedData.length} 条记录`);

    return transformedData;
  } catch (error) {
    console.error('❌ 数据转换失败:', error.message);
    throw error;
  }
}

/**
 * 验证转换结果
 */
function validateTransfer() {
  try {
    const dataPath = path.join(__dirname, '../TEST_DATA/data/properties.json');
    const transformedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('\n🔍 验证转换结果:');
    console.log(`📊 总记录数: ${transformedData.length}`);
    
    transformedData.forEach((item, index) => {
      console.log(`\n🏠 属性 ${index + 1}:`);
      console.log(`  ID: ${item.id}`);
      console.log(`  标题: ${item.title}`);
      console.log(`  位置: ${item.location}`);
      console.log(`  月租金: $${item.monthlyRent.toLocaleString()}`);
      console.log(`  Token价格: $${item.tokenPrice}`);
      console.log(`  总Token数: ${item.totalTokens}`);
      console.log(`  已售Token数: ${item.soldTokens}`);
      console.log(`  APY: ${item.apy}%`);
      console.log(`  状态: ${item.status}`);
      console.log(`  业主ID: ${item.ownerId}`);
    });

    return true;
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    return false;
  }
}

// 如果直接运行此文件，执行转换
if (require.main === module) {
  transfer();
  validateTransfer();
}

module.exports = {
  transfer,
  validateTransfer,
  transformPropertyData
};
