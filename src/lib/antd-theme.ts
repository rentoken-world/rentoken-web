import { ThemeConfig } from 'antd';

// 房产RWA系统专业主题配置
export const rwaTheme: ThemeConfig = {
  token: {
    // 主色调 - 专业的深蓝色，体现金融可信度
    colorPrimary: '#1f4e79',
    colorPrimaryHover: '#2d5aa0',
    colorPrimaryActive: '#1a3d5f',
    
    // 成功色 - 房产收益绿色
    colorSuccess: '#059669',
    colorSuccessHover: '#10b981',
    
    // 警告色 - 投资风险橙色
    colorWarning: '#d97706',
    colorWarningHover: '#f59e0b',
    
    // 错误色 - 亏损红色
    colorError: '#dc2626',
    colorErrorHover: '#ef4444',
    
    // 信息色 - 中性蓝色
    colorInfo: '#0ea5e9',
    colorInfoHover: '#38bdf8',
    
    // 背景色
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#f1f5f9',
    
    // 文字色
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorTextTertiary: '#9ca3af',
    
    // 边框色
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f3f4f6',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 阴影
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  
  components: {
    // 按钮组件主题
    Button: {
      primaryShadow: '0 2px 4px rgba(31, 78, 121, 0.2)',
      defaultShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      fontWeight: 500,
    },
    
    // 卡片组件主题
    Card: {
      paddingLG: 24,
      borderRadiusLG: 12,
      headerBg: '#f8fafc',
    },
    
    // 表格组件主题
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#374151',
      rowHoverBg: '#f8fafc',
    },
    
    // 导航组件主题
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e0f2fe',
      itemSelectedColor: '#1f4e79',
      itemHoverBg: '#f0f9ff',
    },
    
    // 输入框组件主题
    Input: {
      activeBorderColor: '#1f4e79',
      hoverBorderColor: '#2d5aa0',
    },
    
    // 统计数值组件主题
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
      fontFamily: 'monospace',
    },
  },
  
  // 算法配置
  algorithm: undefined, // 使用默认算法
};

// 暗色主题配置（可选）
export const rwaDarkTheme: ThemeConfig = {
  ...rwaTheme,
  token: {
    ...rwaTheme.token,
    colorBgContainer: '#1f2937',
    colorBgElevated: '#374151',
    colorBgLayout: '#111827',
    colorText: '#f9fafb',
    colorTextSecondary: '#d1d5db',
    colorTextTertiary: '#9ca3af',
    colorBorder: '#4b5563',
    colorBorderSecondary: '#374151',
  },
};
