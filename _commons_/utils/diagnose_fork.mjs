#!/usr/bin/env node
/*
 * Fork 环境诊断脚本
 * 用于检查 Anvil fork 环境中的 USDC 余额和网络连接
 */

import { createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import fs from 'fs';
import path from 'path';

// 读取 USDC ABI
const USDC_ABI = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '_commons_/ABI/USDC.json'), 'utf8')
);

// 配置
const LOCAL_RPC = 'http://127.0.0.1:8545'; // 本地 Anvil 节点
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // 主网 USDC
const USER_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // 从错误信息中获取的用户地址
const RENT_TOKEN_ADDRESS = '0x6E0D1a311Db4525e0953A751EA32E810c6E464C8'; // 从错误信息中获取的spender地址

// USDC 富有地址（主网上的大户地址）
const USDC_WHALE = '0x55fe002aeff02f77364de339a1292923a15844b8'; // Circle 的地址

async function diagnoseNetwork() {
  console.log('🔍 Fork 网络诊断开始...\n');

  try {
    // 创建客户端连接到本地 Anvil 节点
    const client = createPublicClient({
      chain: {
        ...mainnet,
        rpcUrls: {
          default: { http: [LOCAL_RPC] }
        }
      },
      transport: http(LOCAL_RPC)
    });

    console.log('=== 网络连接测试 ===');
    
    // 1. 测试网络连接
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ 连接成功! 当前区块: ${blockNumber}`);

    // 2. 检查用户地址的 ETH 余额
    const ethBalance = await client.getBalance({ address: USER_ADDRESS });
    console.log(`💰 ETH 余额: ${formatUnits(ethBalance, 18)} ETH`);

    // 3. 检查用户地址的 USDC 余额
    console.log('\n=== USDC 余额检查 ===');
    const usdcBalance = await client.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [USER_ADDRESS],
    });

    const decimals = await client.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'decimals',
    });

    console.log(`💵 USDC 余额: ${formatUnits(usdcBalance, decimals)} USDC`);
    console.log(`🔢 USDC 精度: ${decimals}`);

    // 4. 检查当前授权情况
    console.log('\n=== 授权状态检查 ===');
    const currentAllowance = await client.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [USER_ADDRESS, RENT_TOKEN_ADDRESS],
    });

    console.log(`🔐 当前授权额度: ${formatUnits(currentAllowance, decimals)} USDC`);
    console.log(`📍 授权给地址: ${RENT_TOKEN_ADDRESS}`);

    // 5. 检查 USDC 富有地址的余额
    console.log('\n=== USDC 富有地址检查 ===');
    const whaleBalance = await client.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [USDC_WHALE],
    });
    console.log(`🐋 富有地址余额: ${formatUnits(whaleBalance, decimals)} USDC`);

    // 分析结果
    console.log('\n=== 诊断结果 ===');
    
    if (usdcBalance === 0n) {
      console.log('❌ 问题发现: 用户地址没有 USDC 余额');
      console.log('💡 解决方案:');
      console.log('1. 使用 anvil 模拟转账从富有地址转 USDC 给测试地址');
      console.log(`2. 运行命令: anvil --fork-url https://rpc.mevblocker.io --unlock ${USDC_WHALE}`);
      console.log('3. 或者使用 cast 命令直接设置余额');
      
      // 提供具体的修复脚本
      console.log('\n📝 修复脚本:');
      console.log(`cast send ${USDC_ADDRESS} "transfer(address,uint256)" ${USER_ADDRESS} $(cast --to-wei 10000 6) --rpc-url ${LOCAL_RPC} --unlocked-from ${USDC_WHALE}`);
    } else {
      console.log(`✅ USDC 余额充足: ${formatUnits(usdcBalance, decimals)} USDC`);
      
      if (currentAllowance === 0n) {
        console.log('ℹ️  当前无授权，这是正常的首次投资流程');
      } else {
        console.log(`✅ 已有授权: ${formatUnits(currentAllowance, decimals)} USDC`);
      }
      
      console.log('🤔 可能的其他问题:');
      console.log('- 网络连接问题');
      console.log('- Gas 费用问题'); 
      console.log('- 合约调用权限问题');
    }

    // 6. 测试一个简单的合约读取确保没有其他问题
    console.log('\n=== 合约交互测试 ===');
    const usdcName = await client.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'name',
    });
    console.log(`✅ USDC 合约名称: ${usdcName}`);

  } catch (error) {
    console.error('❌ 诊断过程中发生错误:');
    console.error(error.message);
    console.error('\n可能的原因:');
    console.error('1. Anvil 节点未启动或 RPC URL 错误');
    console.error('2. 网络连接问题');
    console.error('3. 合约地址错误');
  }
}

async function generateTransferScript() {
  console.log('\n🛠️  生成 USDC 转账脚本...');
  
  const transferScript = `#!/bin/bash
# USDC 转账脚本 - 给测试账户转入 USDC
# 使用前请确保 Anvil 运行在 http://127.0.0.1:8545

echo "开始给测试账户转入 USDC..."

# 方案 1: 使用 cast 从富有地址转账 (推荐)
cast send ${USDC_ADDRESS} \\
  "transfer(address,uint256)" \\
  ${USER_ADDRESS} \\
  $(cast --to-wei 10000 6) \\
  --rpc-url ${LOCAL_RPC} \\
  --unlocked-from ${USDC_WHALE}

# 方案 2: 直接设置余额 (如果方案1不work)
# cast rpc anvil_setBalance ${USER_ADDRESS} 0x56BC75E2D630FFFFF --rpc-url ${LOCAL_RPC}

echo "转账完成，请重新运行诊断脚本确认"
`;

  fs.writeFileSync('_commons_/utils/transfer_usdc.sh', transferScript);
  console.log('✅ 转账脚本已生成: _commons_/utils/transfer_usdc.sh');
  console.log('📝 使用方法: chmod +x _commons_/utils/transfer_usdc.sh && ./_commons_/utils/transfer_usdc.sh');
}

// 主函数
async function main() {
  await diagnoseNetwork();
  await generateTransferScript();
  
  console.log('\n🎯 下一步建议:');
  console.log('1. 如果发现余额不足，运行生成的转账脚本');
  console.log('2. 确保前端配置正确连接到 http://127.0.0.1:8545');
  console.log('3. 重新测试投资功能');
}

// 运行主函数
main().catch(console.error);
