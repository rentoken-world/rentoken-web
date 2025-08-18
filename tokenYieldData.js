// 示例数据，uniswap池和中心化池的收益率（%）随时间（天）变化
window.tokenYieldData = {
  days: [0, 5, 10, 15, 20, 25, 30],
  uniswap: [0, 0.8, 1.7, 2.5, 3.2, 4.0, 5.0],
  centralized: [0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2],
  // K线数据，open/close/high/low
  klines: [
    { open: 1.00, close: 1.08, high: 1.10, low: 0.98 },
    { open: 1.08, close: 1.15, high: 1.18, low: 1.05 },
    { open: 1.15, close: 1.12, high: 1.20, low: 1.10 },
    { open: 1.12, close: 1.20, high: 1.22, low: 1.10 },
    { open: 1.20, close: 1.18, high: 1.23, low: 1.15 },
    { open: 1.18, close: 1.25, high: 1.28, low: 1.16 },
    { open: 1.25, close: 1.30, high: 1.32, low: 1.22 }
  ]
};
