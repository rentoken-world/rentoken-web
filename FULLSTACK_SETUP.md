# Next.js 全栈 RWA 系统设置指南

## 🎉 迁移完成！

您的后端代码已成功迁移到 Next.js 全栈架构中。所有 API 路由现在位于 `src/app/api/` 目录下。

## 📁 项目结构

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/                    # 后端 API 路由
│   │   │   ├── kyc/               # KYC 认证 API
│   │   │   │   ├── submit/route.ts
│   │   │   │   ├── status/route.ts
│   │   │   │   └── upload-document/route.ts
│   │   │   ├── mint/               # 质押铸造 API
│   │   │   │   ├── assets/route.ts
│   │   │   │   ├── calculate/route.ts
│   │   │   │   ├── stake/route.ts
│   │   │   │   └── mint/route.ts
│   │   │   ├── swap/               # 交易 API
│   │   │   │   ├── tokens/route.ts
│   │   │   │   ├── quote/route.ts
│   │   │   │   ├── execute/route.ts
│   │   │   │   ├── pools/route.ts
│   │   │   │   └── balances/route.ts
│   │   │   └── redeem/             # 赎回 API
│   │   │       ├── assets/route.ts
│   │   │       ├── calculate/route.ts
│   │   │       ├── request/route.ts
│   │   │       └── history/route.ts
│   │   ├── (admin)/               # 管理页面
│   │   └── (auth)/                # 认证页面
│   ├── lib/                       # 共享库
│   │   ├── db.ts                  # 数据库连接
│   │   └── auth.ts                # 认证工具
│   └── components/                # UI 组件
├── prisma/
│   └── schema.prisma              # 数据库模式
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install zod prisma @prisma/client jsonwebtoken @types/jsonwebtoken
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，配置以下变量：

```env
# 数据库连接
DATABASE_URL="mongodb://localhost:27017/rwa_database"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js 配置
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npx prisma generate

# 如果使用 MongoDB，确保 MongoDB 服务正在运行
# 数据库会在第一次 API 调用时自动创建
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 📊 API 路由说明

### KYC 认证 API
- `POST /api/kyc/submit` - 提交 KYC 申请
- `GET /api/kyc/status` - 获取 KYC 状态
- `POST /api/kyc/upload-document` - 上传身份证件

### 质押铸造 API
- `GET /api/mint/assets` - 获取可质押资产
- `POST /api/mint/calculate` - 计算质押估值
- `POST /api/mint/stake` - 创建质押订单
- `POST /api/mint/mint` - 确认铸造代币

### 交易 API
- `GET /api/swap/tokens` - 获取代币列表
- `POST /api/swap/quote` - 获取交易报价
- `POST /api/swap/execute` - 执行交易
- `GET /api/swap/pools` - 获取流动性池
- `GET /api/swap/balances` - 获取用户余额

### 赎回 API
- `GET /api/redeem/assets` - 获取可赎回资产
- `POST /api/redeem/calculate` - 计算赎回价值
- `POST /api/redeem/request` - 创建赎回申请
- `GET /api/redeem/history` - 获取赎回历史

## 🔧 功能特性

### 已实现功能
- ✅ **JWT 身份认证**: 基于钱包地址的用户认证
- ✅ **数据验证**: 使用 Zod 进行严格的输入验证
- ✅ **错误处理**: 统一的错误响应格式
- ✅ **MongoDB 集成**: 使用 Prisma ORM
- ✅ **TypeScript**: 完整的类型支持

### 核心模块
1. **KYC 认证系统**: 身份验证和钱包绑定
2. **资产质押系统**: 房产资产质押和代币铸造
3. **DEX 交易系统**: Uniswap 风格的去中心化交易
4. **赎回管理系统**: 代币赎回和资产提取

## 🛠️ 开发说明

### API 调用示例

```javascript
// KYC 提交示例
const response = await fetch('/api/kyc/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    phone: '13888888888',
    email: 'user@example.com',
    idNumber: '110101199001011234',
    walletAddress: '0x742d35Cc6634C0532925a3b8D467de80C-example'
  })
});

// 质押计算示例
const stakeResponse = await fetch('/api/mint/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    assetId: '1',
    amount: 10000,
    lockPeriod: 12
  })
});

// 交易执行示例
const swapResponse = await fetch('/api/swap/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fromToken: 'eth',
    toToken: 'usdc',
    fromAmount: 1.0,
    minReceived: 2300
  })
});
```

### 数据模型

系统使用以下主要数据模型：

- `users`: 用户基本信息
- `kyc`: KYC 认证记录
- `stakes`: 质押记录
- `tokenBalances`: 代币余额
- `swaps`: 交易记录
- `liquidityPositions`: 流动性位置
- `redemptions`: 赎回申请

## 🔐 安全特性

- **JWT 认证**: 所有敏感 API 都需要有效的 JWT 令牌
- **数据验证**: 使用 Zod 严格验证所有输入数据
- **钱包绑定**: KYC 与钱包地址强关联，防止身份冒用
- **权限控制**: 用户只能访问自己的数据

## 📝 下一步

1. **安装依赖**: 运行 `npm install` 安装所需依赖
2. **配置环境**: 设置 `.env.local` 文件
3. **启动应用**: 运行 `npm run dev` 启动开发服务器
4. **测试 API**: 使用前端页面或 API 工具测试各个端点
5. **自定义配置**: 根据需要调整数据库连接和其他配置

## 🎯 生产部署

部署到生产环境时，请确保：

1. 设置正确的环境变量
2. 配置生产数据库
3. 启用 HTTPS
4. 设置适当的 CORS 策略
5. 配置日志和监控

---

**恭喜！您的房产 RWA 系统现在是一个完整的 Next.js 全栈应用！** 🎉
