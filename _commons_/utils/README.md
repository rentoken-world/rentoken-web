# 数据转换工具 (Transfer Utility)

这个工具用于将链上原始数据转换为服务端需要的业务结构数据。

## 文件结构

```
_commons_/
├── TEST_DATA/
│   ├── source/          # 链上原始数据
│   │   └── propert.json
│   ├── to/              # 目标业务结构示例
│   │   └── propert.json
│   └── data/            # 转换后的数据输出目录
│       └── properties.json
└── utils/
    ├── transfer.js      # 转换工具
    └── README.md        # 本文件
```

## 使用方法

### 1. 直接运行转换

```bash
node _commons_/utils/transfer.js
```

### 2. 在代码中使用

```javascript
const { transfer, validateTransfer } = require('./_commons_/utils/transfer.js');

// 执行转换
const transformedData = transfer();

// 验证结果
validateTransfer();
```

## 数据转换说明

### 输入数据 (source/propert.json)
链上原始数据，包含以下字段：
- `propertyId`: 属性ID
- `payoutToken`: 支付代币地址
- `valuation`: 估值 (微单位)
- `minRaising`: 最小募资额 (微单位)
- `maxRaising`: 最大募资额 (微单位)
- `accrualStart`: 开始时间戳
- `accrualEnd`: 结束时间戳
- `landlord`: 房东地址
- `docHash`: 文档哈希
- `offchainURL`: 链下数据URL

### 输出数据 (data/properties.json)
业务结构数据，包含以下字段：
- `id`: 属性ID
- `title`: 属性标题
- `location`: 位置
- `description`: 描述
- `price`: 价格 (USD)
- `tokenSupply`: Token供应量
- `availableTokens`: 可用Token数量
- `tokenPrice`: Token价格
- `expectedYield`: 预期收益率
- `category`: 类别
- `status`: 状态 (upcoming/funding/closed)
- `owner`: 所有者地址
- `imageUrl`: 图片URL
- `originalData`: 原始数据备份
- `accrualStartDate`: 开始日期
- `accrualEndDate`: 结束日期

## 转换逻辑

1. **价格转换**: 将微单位转换为USD (除以1e6)
2. **Token计算**: 基于价格计算Token供应量
3. **状态判断**: 根据当前时间与时间戳比较确定状态
4. **收益率计算**: 基于最小和最大募资额计算
5. **时间格式化**: 将时间戳转换为可读日期

## 注意事项

- 确保源数据文件存在且格式正确
- 转换后的数据会保存在 `_commons_/TEST_DATA/data/` 目录下
- 原始数据会保留在 `originalData` 字段中以便参考
- 价格转换系数可能需要根据实际情况调整
