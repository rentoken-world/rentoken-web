#!/usr/bin/env node
/*
 * 前端配置测试脚本
 * 用于验证前端是否正确连接到本地 Anvil 节点
 */

console.log('🔍 前端配置诊断开始...\n');

// 1. 检查环境变量
console.log('=== 环境变量检查 ===');
const deploymentEnv = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local';
console.log(`📌 当前环境: ${deploymentEnv}`);
console.log(`🔗 WalletConnect 项目ID: ${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '未设置'}`);

// 2. 检查当前配置
const LOCAL_RPC = 'http://127.0.0.1:8545';
const ANVIL_CHAIN_ID = 31337;

console.log('\n=== Anvil 节点连接测试 ===');

// 3. 测试 Anvil 节点是否响应
async function testAnvilConnection() {
  try {
    const response = await fetch(LOCAL_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = await response.json();
    const chainId = parseInt(data.result, 16);

    console.log(`✅ Anvil 节点响应正常`);
    console.log(`🔗 链ID: ${chainId} (期望: ${ANVIL_CHAIN_ID})`);

    if (chainId !== ANVIL_CHAIN_ID) {
      console.log(`⚠️  警告: 链ID不匹配，期望 ${ANVIL_CHAIN_ID}，实际 ${chainId}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Anvil 节点连接失败: ${error.message}`);
    console.error('请确保运行: anvil --fork-url https://rpc.mevblocker.io');
    return false;
  }
}

// 4. 测试 USDC 合约
async function testUSDCContract() {
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  
  try {
    const response = await fetch(LOCAL_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: USDC_ADDRESS,
            data: '0x313ce567', // decimals() 函数的选择器
          },
          'latest'
        ],
        id: 2,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    const decimals = parseInt(data.result, 16);
    console.log(`✅ USDC 合约可访问，精度: ${decimals}`);
    return true;
  } catch (error) {
    console.error(`❌ USDC 合约测试失败: ${error.message}`);
    return false;
  }
}

// 主测试函数
async function main() {
  const anvilOk = await testAnvilConnection();
  
  if (anvilOk) {
    console.log('\n=== 合约访问测试 ===');
    await testUSDCContract();
  }

  console.log('\n=== 修复建议 ===');
  
  if (!anvilOk) {
    console.log('🚨 Anvil 节点问题:');
    console.log('1. 确保运行: anvil --fork-url https://rpc.mevblocker.io');
    console.log('2. 确保端口 8545 没有被占用');
    console.log('3. 检查防火墙设置');
  } else {
    console.log('✅ 网络配置看起来正常');
  }

  console.log('\n💡 前端调试建议:');
  console.log('1. 重启前端开发服务器');
  console.log('2. 清除浏览器缓存和本地存储');
  console.log('3. 在浏览器开发者工具中检查网络请求');
  console.log('4. 确保钱包连接到正确的网络 (Chain ID: 31337)');
  console.log('5. 检查钱包是否已添加本地网络');

  console.log('\n🔧 手动添加本地网络到 MetaMask:');
  console.log('- 网络名称: Hardhat Local');
  console.log('- RPC URL: http://127.0.0.1:8545');
  console.log('- 链 ID: 31337');
  console.log('- 货币符号: ETH');

  console.log('\n📝 如果问题持续存在，请检查:');
  console.log('1. 前端 console 中的错误信息');
  console.log('2. 网络请求是否被发送到正确的 RPC URL');
  console.log('3. 是否有 CORS 问题');
}

main().catch(console.error);
