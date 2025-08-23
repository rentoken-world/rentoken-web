#!/bin/bash
# USDC 转账脚本 - 给测试账户转入 USDC
# 使用前请确保 Anvil 运行在 http://127.0.0.1:8545

echo "开始给测试账户转入 USDC..."

# 方案 1: 使用 cast 从富有地址转账 (推荐)
cast send 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 \
  "transfer(address,uint256)" \
  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC \
  $(cast --to-wei 10000 6) \
  --rpc-url http://127.0.0.1:8545 \
  --unlocked-from 0x55fe002aeff02f77364de339a1292923a15844b8

# 方案 2: 直接设置余额 (如果方案1不work)
# cast rpc anvil_setBalance 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 0x56BC75E2D630FFFFF --rpc-url http://127.0.0.1:8545

echo "转账完成，请重新运行诊断脚本确认"
