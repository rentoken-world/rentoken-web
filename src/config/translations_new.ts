export type Language = "en" | "zh";

export interface Translations {
  // 通用
  rentoken: string;
  investor: string;
  owner: string;
  email: string;
  
  // KYC 相关
  checkingKyc: string;
  kycVerified: string;
  kycRequired: string;
  contactUs: string;
  
  // 首页
  welcomeTo: string;
  heroDescription: string;
  startInvesting: string;
  listProperty: string;
  howItWorks: string;
  tokenizeProperty: string;
  tokenizeDescription: string;
  earnRentalIncome: string;
  earnDescription: string;
  tradeLiquidity: string;
  tradeDescription: string;
  totalValueLocked: string;
  propertiesTokenized: string;
  activeInvestors: string;
  averageYield: string;
  
  // 投资者页面
  investorDashboard: string;
  availableProjects: string;
  searchPlaceholder: string;
  myProjects: string;
  
  // 业主页面
  ownerDashboard: string;
  myProperties: string;
  addProperty: string;
  propertyManagement: string;
}

export type TranslationKey = keyof Translations;

export const translations: Record<Language, Translations> = {
  en: {
    // 通用
    rentoken: "RenToken",
    investor: "Investor",
    owner: "Owner",
    email: "Email",
    
    // KYC 相关
    checkingKyc: "Checking KYC...",
    kycVerified: "KYC Verified",
    kycRequired: "KYC Required",
    contactUs: "Contact Us",
    
    // 首页
    welcomeTo: "Welcome to",
    heroDescription: "Tokenize your rental property income. Invest in real estate revenue streams. Bridge traditional real estate with decentralized finance.",
    startInvesting: "Start Investing",
    listProperty: "List Your Property",
    howItWorks: "How RenToken Works",
    tokenizeProperty: "Tokenize Property",
    tokenizeDescription: "Convert your rental properties into tradeable tokens representing future rental income streams.",
    earnRentalIncome: "Earn Rental Income",
    earnDescription: "Receive proportional rental income distributions automatically through smart contracts.",
    tradeLiquidity: "Trade & Liquidity",
    tradeDescription: "Buy and sell property tokens on secondary markets for instant liquidity.",
    totalValueLocked: "Total Value Locked",
    propertiesTokenized: "Properties Tokenized",
    activeInvestors: "Active Investors",
    averageYield: "Average Yield",
    
    // 投资者页面
    investorDashboard: "Investor Dashboard",
    availableProjects: "Available RenToken Projects",
    searchPlaceholder: "Search by name...",
    myProjects: "My Projects",
    
    // 业主页面
    ownerDashboard: "Owner Dashboard",
    myProperties: "My Properties",
    addProperty: "Add Property",
    propertyManagement: "Property Management",
  },
  zh: {
    // 通用
    rentoken: "租房通",
    investor: "投资者",
    owner: "业主",
    email: "邮箱",
    
    // KYC 相关
    checkingKyc: "正在检查身份验证...",
    kycVerified: "身份已验证",
    kycRequired: "需要身份验证",
    contactUs: "联系我们",
    
    // 首页
    welcomeTo: "欢迎来到",
    heroDescription: "将您的租金收入代币化。投资房地产收益流。连接传统房地产与去中心化金融。",
    startInvesting: "开始投资",
    listProperty: "列出您的房产",
    howItWorks: "租房通的运作方式",
    tokenizeProperty: "房产代币化",
    tokenizeDescription: "将您的租赁房产转换为代表未来租金收入流的可交易代币。",
    earnRentalIncome: "赚取租金收入",
    earnDescription: "通过智能合约自动获得按比例分配的租金收入。",
    tradeLiquidity: "交易与流动性",
    tradeDescription: "在二级市场买卖房产代币，获得即时流动性。",
    totalValueLocked: "总锁定价值",
    propertiesTokenized: "已代币化房产",
    activeInvestors: "活跃投资者",
    averageYield: "平均收益率",
    
    // 投资者页面
    investorDashboard: "投资者仪表板",
    availableProjects: "可用的租房通项目",
    searchPlaceholder: "按名称搜索...",
    myProjects: "我的项目",
    
    // 业主页面
    ownerDashboard: "业主仪表板",
    myProperties: "我的房产",
    addProperty: "添加房产",
    propertyManagement: "房产管理",
  },
};
