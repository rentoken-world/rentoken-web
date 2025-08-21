# USDC Decimals 测试脚本

这个测试脚本用于排查 USDC decimals 读取问题，分别使用 wagmi 和 viem 两种方式进行测试。

## 功能特性

- ✅ 支持 wagmi 和 viem 两种方式测试
- ✅ 支持多环境测试（local、testnet、mainnet）
- ✅ 详细的错误信息和调试输出
- ✅ 自动对比两种方式的结果
- ✅ 额外测试合约的其他基本信息（name、symbol、totalSupply）

## 使用方法

### 1. 直接运行脚本

```bash
# 测试本地环境（默认）
node _commons_/utils/test.js

# 测试指定环境
node _commons_/utils/test.js local
node _commons_/utils/test.js testnet
node _commons_/utils/test.js mainnet

# 测试所有环境
node _commons_/utils/test.js --all
```

### 2. 使用 npm 脚本

```bash
# 测试本地环境（默认）
npm run test:usdc

# 测试指定环境
npm run test:usdc:local
npm run test:usdc:testnet
npm run test:usdc:mainnet

# 测试所有环境
npm run test:usdc:all
```

## 环境配置

### 本地环境 (local)
- **USDC 地址**: `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` (主网 USDC，用于 fork)
- **RPC URL**: `http://127.0.0.1:8545`
- **要求**: 需要运行 Hardhat 节点并 fork 主网

### 测试网环境 (testnet)
- **USDC 地址**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` (Sepolia USDC)
- **RPC URL**: 需要配置 Infura 或其他 RPC 提供商
- **链**: Sepolia

### 主网环境 (mainnet)
- **USDC 地址**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (主网 USDC)
- **RPC URL**: 需要配置 Infura 或其他 RPC 提供商
- **链**: Ethereum Mainnet

## 预期输出

成功的测试输出应该类似：

```
🚀 开始 USDC decimals 读取测试

============================================================
测试环境: LOCAL
============================================================

=== 使用 viem 测试 USDC decimals (local 环境) ===
RPC URL: http://127.0.0.1:8545
USDC Address: 0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48

1. 测试网络连接...
✅ 网络连接成功，当前区块号: 12345678

2. 使用 client.readContract 读取 decimals...
✅ decimals (方法1): 6

3. 使用 getContract 读取 decimals...
✅ decimals (方法2): 6

4. 读取其他合约信息...
✅ Name: USD Coin
✅ Symbol: USDC
✅ Total Supply: 123456789000000

=== 使用 wagmi 测试 USDC decimals (local 环境) ===
RPC URL: http://127.0.0.1:8545
USDC Address: 0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48

1. 使用 wagmi readContract 读取 decimals...
✅ decimals: 6

2. 读取其他合约信息...
✅ Name: USD Coin
✅ Symbol: USDC

--- local 环境测试结果对比 ---
viem 结果: ✅ 成功
wagmi 结果: ✅ 成功
decimals 一致性: ✅ 一致
```

## 故障排除

### 本地环境问题

如果本地测试失败，请检查：

1. **Hardhat 节点是否运行**:
   ```bash
   npx hardhat node
   ```

2. **是否 fork 了主网**:
   ```bash
   npx hardhat node --fork https://mainnet.infura.io/v3/YOUR_INFURA_KEY
   ```

3. **RPC URL 是否正确**: 默认应该是 `http://127.0.0.1:8545`

### 测试网/主网问题

1. **RPC URL 配置**: 需要在脚本中替换 `YOUR_INFURA_KEY` 为实际的 API 密钥
2. **网络连接**: 确保网络连接正常
3. **合约地址**: 确认 USDC 合约地址是否正确

## 调试信息

脚本会输出详细的调试信息，包括：
- 网络连接状态
- 合约地址
- RPC URL
- 错误详情（如果有）
- 两种方式的结果对比

## 常见错误

1. **网络连接错误**: 检查 RPC URL 和网络连接
2. **合约不存在**: 检查合约地址是否正确
3. **ABI 错误**: 检查 USDC ABI 文件是否正确
4. **权限错误**: 某些 RPC 可能有访问限制

## 扩展使用

你也可以在代码中导入和使用这些函数：

```javascript
import { 
  testUSDCDecimalsWithViem, 
  testUSDCDecimalsWithWagmi, 
  testSingleEnvironment 
} from './_commons_/utils/test.js';

// 单独测试 viem
const viemResult = await testUSDCDecimalsWithViem('local');

// 单独测试 wagmi
const wagmiResult = await testUSDCDecimalsWithWagmi('local');

// 测试指定环境
await testSingleEnvironment('testnet');
```
