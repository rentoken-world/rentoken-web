# 环境配置指南

本项目支持多环境部署，包括本地开发环境、测试网环境和生产环境。每个环境都有独立的合约地址配置。

## 环境类型

- **local**: 本地开发环境（Hardhat/Anvil）
- **testnet**: 测试网环境（Sepolia）  
- **mainnet**: 生产环境（Ethereum 主网）

## 快速开始

### 1. 环境变量配置

创建对应的环境变量文件（注意：这些文件可能被 `.gitignore` 忽略）：

```bash
# .env.local (本地开发)
NODE_ENV=development
NEXT_PUBLIC_DEPLOYMENT_ENV=local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# 本地合约地址（Hardhat 默认地址）
NEXT_PUBLIC_CONTRACT_LOCAL_RENTOKEN=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_LOCAL_PROPERTY_MANAGER=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# 测试网合约地址
NEXT_PUBLIC_CONTRACT_TESTNET_RENTOKEN=0x你的测试网合约地址
NEXT_PUBLIC_CONTRACT_TESTNET_PROPERTY_MANAGER=0x你的测试网合约地址

# 生产环境合约地址
NEXT_PUBLIC_CONTRACT_MAINNET_RENTOKEN=0x你的主网合约地址
NEXT_PUBLIC_CONTRACT_MAINNET_PROPERTY_MANAGER=0x你的主网合约地址
```

### 2. 运行不同环境

使用新添加的 npm 脚本：

```bash
# 本地开发环境
npm run dev:local

# 测试网环境
npm run dev:testnet

# 生产环境（谨慎使用）
npm run dev:mainnet

# 构建不同环境
npm run build:local
npm run build:testnet
npm run build:mainnet
```

### 3. 在代码中使用

```tsx
import { useContractConfig, useContractAddress } from '@/hooks/useContractConfig';

function MyComponent() {
  // 获取完整配置
  const config = useContractConfig();
  
  // 获取特定合约地址
  const renTokenAddress = useContractAddress('renToken');
  
  // 检查环境
  if (config.isProduction) {
    console.log('运行在生产环境');
  }
  
  return (
    <div>
      <p>当前环境: {config.environment}</p>
      <p>RenToken 合约: {renTokenAddress}</p>
    </div>
  );
}
```

## API 说明

### 环境配置 Hook

#### `useContractConfig()`

返回完整的合约配置信息：

```tsx
const config = useContractConfig();
// config.environment: 当前环境
// config.chainId: 当前链 ID
// config.addresses: 合约地址对象
// config.isProduction: 是否为生产环境
// config.isTestnet: 是否为测试网
// config.isLocal: 是否为本地环境
// config.isEnvironmentMatched: 链环境是否匹配配置
```

#### `useContractAddress(contractName)`

获取特定合约地址：

```tsx
const renTokenAddress = useContractAddress('renToken');
const propertyManagerAddress = useContractAddress('propertyManager');
```

#### `useContractValidation()`

验证合约配置：

```tsx
const validation = useContractValidation();
// validation.isValid: 配置是否有效
// validation.hasValidContracts: 合约地址是否有效
// validation.isEnvironmentMatched: 环境是否匹配
// validation.issues: 问题列表
```

### 工具函数

```tsx
import { 
  getCurrentEnvironment, 
  getContractAddresses,
  getContractAddress,
  getEnvironmentInfo 
} from '@/config/contracts';

// 获取当前环境
const env = getCurrentEnvironment(); // 'local' | 'testnet' | 'mainnet'

// 获取所有合约地址
const addresses = getContractAddresses();

// 获取特定合约地址
const renTokenAddress = getContractAddress('renToken');

// 获取环境信息
const envInfo = getEnvironmentInfo();
```

## 链配置

项目会根据环境自动配置支持的区块链：

- **本地环境**: Hardhat 本地链 + Sepolia 测试网
- **测试网环境**: Sepolia 等测试网
- **生产环境**: Ethereum 主网 + Polygon + Optimism + Arbitrum + Base

## 环境指示器

页面右上角会显示当前环境状态：

- 🟢 本地环境
- 🟡 测试网
- 🔴 生产环境
- ⚠️ 配置有问题

点击可查看详细配置信息。

## 部署指南

### Vercel 部署

在 Vercel 中设置环境变量：

```bash
# Environment Variables
NEXT_PUBLIC_DEPLOYMENT_ENV=mainnet
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_MAINNET_RENTOKEN=0x...
NEXT_PUBLIC_CONTRACT_MAINNET_PROPERTY_MANAGER=0x...
```

### Docker 部署

```dockerfile
# 在 Dockerfile 中设置环境
ENV NEXT_PUBLIC_DEPLOYMENT_ENV=mainnet
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 故障排查

### 常见问题

1. **合约地址无效**
   - 检查环境变量是否正确设置
   - 确认合约地址格式正确（42字符，以0x开头）

2. **环境不匹配**
   - 检查钱包连接的链是否与配置环境匹配
   - 确认 `NEXT_PUBLIC_DEPLOYMENT_ENV` 设置正确

3. **本地环境连接失败**
   - 确保 Hardhat 或 Anvil 正在运行
   - 检查本地链配置（默认端口 8545）

### 调试模式

开启环境指示器查看详细配置信息，或在控制台运行：

```javascript
// 在浏览器控制台中检查配置
console.log('Environment:', process.env.NEXT_PUBLIC_DEPLOYMENT_ENV);
console.log('Contracts:', {
  renToken: process.env.NEXT_PUBLIC_CONTRACT_LOCAL_RENTOKEN,
  propertyManager: process.env.NEXT_PUBLIC_CONTRACT_LOCAL_PROPERTY_MANAGER
});
```

## 安全注意事项

1. **生产环境谨慎操作**: 确保在生产环境中使用正确的合约地址
2. **私钥管理**: 永远不要在环境变量中存储私钥
3. **环境隔离**: 测试和生产环境应该完全隔离
4. **合约验证**: 部署前验证所有合约地址的正确性
