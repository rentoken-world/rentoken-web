/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-22 01:01:53
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-22 01:34:30
 * @FilePath: /rentoken-web/_commons_/utils/test.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-22 01:01:53
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-22 01:29:36
 * @FilePath: /rentoken-web/_commons_/utils/test.js
 * @Description: USDC decimals reading test using wagmi and viem
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { createPublicClient, http, getContract } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { readContract } from 'wagmi/actions';
import { createConfig, http as wagmiHttp } from 'wagmi';
import fs from 'fs';
import path from 'path';

// 读取 USDC ABI
const USDC_ABI = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '_commons_/ABI/USDC.json'), 'utf8')
);

// 从 contracts.ts 导入本地配置
const LOCAL_USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // 主网USDC (与contracts.ts保持一致)

// 合约地址配置 (使用正确的EIP-55校验和格式)
const CONTRACTS = {
  local: {
    USDC_ADDR: LOCAL_USDC_ADDR, // 主网USDC地址 (Anvil fork)
    RPC_URL: 'http://127.0.0.1:8545'
  },
  testnet: {
    USDC_ADDR: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY' // 需要替换为实际的RPC URL
  },
  mainnet: {
    USDC_ADDR: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // 主网USDC
    RPC_URL: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY' // 需要替换为实际的RPC URL
  }
};

// 获取环境配置
function getEnvironmentConfig(env = 'local') {
  return CONTRACTS[env] || CONTRACTS.local;
}

// 创建 viem 客户端
function createViemClient(env = 'local') {
  const config = getEnvironmentConfig(env);
  
  let chain;
  switch (env) {
    case 'mainnet':
      chain = mainnet;
      break;
    case 'testnet':
      chain = sepolia;
      break;
    case 'local':
    default:
      // 本地Anvil链配置 (Fork主网)
      chain = {
        id: 31337,
        name: 'Anvil (Mainnet Fork)',
        nativeCurrency: {
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: [config.RPC_URL],
          },
        },
      };
      break;
  }

  return createPublicClient({
    chain,
    transport: http(config.RPC_URL)
  });
}

// 创建 wagmi 配置
function createWagmiConfig(env = 'local') {
  const config = getEnvironmentConfig(env);
  
  let chains;
  switch (env) {
    case 'mainnet':
      chains = [mainnet];
      break;
    case 'testnet':
      chains = [sepolia];
      break;
    case 'local':
    default:
      // 本地Anvil链配置 (Fork主网)
      const hardhatChain = {
        id: 31337,
        name: 'Anvil (Mainnet Fork)',
        nativeCurrency: {
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: [config.RPC_URL],
          },
        },
      };
      chains = [hardhatChain];
      break;
  }

  return createConfig({
    chains,
    transports: {
      [chains[0].id]: wagmiHttp(config.RPC_URL)
    }
  });
}

// 使用 viem 测试 USDC decimals
async function testUSDCDecimalsWithViem(env = 'local') {
  console.log(`\n=== 使用 viem 测试 USDC decimals (${env} 环境) ===`);
  
  try {
    const config = getEnvironmentConfig(env);
    const client = createViemClient(env);
    
    console.log(`RPC URL: ${config.RPC_URL}`);
    console.log(`USDC Address: ${config.USDC_ADDR}`);
    
    // 测试网络连接
    console.log('\n1. 测试网络连接...');
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ 网络连接成功，当前区块号: ${blockNumber}`);
    
    // 方法1: 直接使用 readContract
    console.log('\n2. 使用 client.readContract 读取 decimals...');
    const decimals1 = await client.readContract({
      address: config.USDC_ADDR,
      abi: USDC_ABI,
      functionName: 'decimals'
    });
    console.log(`✅ decimals (方法1): ${decimals1}`);
    
    // 方法2: 使用 getContract
    console.log('\n3. 使用 getContract 读取 decimals...');
    const contract = getContract({
      address: config.USDC_ADDR,
      abi: USDC_ABI,
      client
    });
    const decimals2 = await contract.read.decimals();
    console.log(`✅ decimals (方法2): ${decimals2}`);
    
    
    return { success: true, decimals: decimals1 };
    
  } catch (error) {
    console.error(`❌ viem 测试失败:`, error);
    console.error(`错误详情:`, {
      message: error.message,
      code: error.code,
      data: error.data
    });
    return { success: false, error: error.message };
  }
}

// 使用 wagmi 测试 USDC decimals
async function testUSDCDecimalsWithWagmi(env = 'local') {
  console.log(`\n=== 使用 wagmi 测试 USDC decimals (${env} 环境) ===`);
  
  try {
    const envConfig = getEnvironmentConfig(env);
    const wagmiConfig = createWagmiConfig(env);
    
    console.log(`RPC URL: ${envConfig.RPC_URL}`);
    console.log(`USDC Address: ${envConfig.USDC_ADDR}`);
    
    // 使用 wagmi 的 readContract
    console.log('\n1. 使用 wagmi readContract 读取 decimals...');
    const decimals = await readContract(wagmiConfig, {
      address: envConfig.USDC_ADDR,
      abi: USDC_ABI,
      functionName: 'decimals'
    });
    console.log(`✅ decimals: ${decimals}`);
    
    return { success: true, decimals };
    
  } catch (error) {
    console.error(`❌ wagmi 测试失败:`, error);
    console.error(`错误详情:`, {
      message: error.message,
      code: error.code,
      data: error.data,
      cause: error.cause
    });
    return { success: false, error: error.message };
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始 USDC decimals 读取测试\n');
  
  // 测试环境列表
  const environments = ['local', 'testnet', 'mainnet'];
  
  for (const env of environments) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`测试环境: ${env.toUpperCase()}`);
    console.log(`${'='.repeat(60)}`);
    
    // viem 测试
    const viemResult = await testUSDCDecimalsWithViem(env);
    
    // wagmi 测试
    const wagmiResult = await testUSDCDecimalsWithWagmi(env);
    
    // 结果对比
    console.log(`\n--- ${env} 环境测试结果对比 ---`);
    console.log(`viem 结果: ${viemResult.success ? '✅ 成功' : '❌ 失败'}`);
    console.log(`wagmi 结果: ${wagmiResult.success ? '✅ 成功' : '❌ 失败'}`);
    
    if (viemResult.success && wagmiResult.success) {
      console.log(`decimals 一致性: ${viemResult.decimals === wagmiResult.decimals ? '✅ 一致' : '❌ 不一致'}`);
      if (viemResult.decimals !== wagmiResult.decimals) {
        console.log(`viem decimals: ${viemResult.decimals}`);
        console.log(`wagmi decimals: ${wagmiResult.decimals}`);
      }
    }
    
    // 如果是本地环境且失败，给出建议
    if (env === 'local' && (!viemResult.success || !wagmiResult.success)) {
      console.log('\n💡 本地环境测试失败建议:');
      console.log('1. 确保 Hardhat 节点正在运行: npx hardhat node');
      console.log('2. 确保已经 fork 主网: npx hardhat node --fork https://mainnet.infura.io/v3/YOUR_KEY');
      console.log('3. 检查 RPC URL 是否正确: http://127.0.0.1:8545');
    }
  }
  
  console.log('\n🏁 测试完成');
}

// 单独测试函数 - 可以指定环境
async function testSingleEnvironment(env = 'local') {
  console.log(`🎯 单独测试 ${env} 环境\n`);
  
  const viemResult = await testUSDCDecimalsWithViem(env);
  // const wagmiResult = await testUSDCDecimalsWithWagmi(env);
  
  console.log('\n📊 测试结果汇总:');
  console.log(`viem: ${viemResult.success ? '✅' : '❌'} ${viemResult.success ? `decimals=${viemResult.decimals}` : viemResult.error}`);
  // console.log(`wagmi: ${wagmiResult.success ? '✅' : '❌'} ${wagmiResult.success ? `decimals=${wagmiResult.decimals}` : wagmiResult.error}`);
}

// 导出函数供外部调用
export {
  testUSDCDecimalsWithViem,
  testUSDCDecimalsWithWagmi,
  runTests,
  testSingleEnvironment
};

// 如果直接运行此脚本
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检查是否直接运行此脚本
if (process.argv[1] === __filename) {
  // 检查命令行参数
  const args = process.argv.slice(2);
  const env = args[0] || 'local';
  
  if (args.includes('--all')) {
    runTests().catch(console.error);
  } else {
    testSingleEnvironment(env).catch(console.error);
  }
}