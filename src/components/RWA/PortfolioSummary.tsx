'use client';

import { Card, Statistic, Row, Col, Typography, Progress, Space, Avatar } from 'antd';
import { 
  DollarOutlined, 
  RiseOutlined, 
  FallOutlined, 
  HomeOutlined,
  WalletOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title } = Typography;

interface PortfolioData {
  totalInvested: number;
  currentValue: number;
  monthlyIncome: number;
  totalReturn: number;
  returnPercentage: number;
  activeProperties: number;
  walletBalance: number;
}

interface PortfolioSummaryProps {
  data: PortfolioData;
}

export default function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const {
    totalInvested,
    currentValue,
    monthlyIncome,
    totalReturn,
    returnPercentage,
    activeProperties,
    walletBalance
  } = data;

  const isPositiveReturn = returnPercentage >= 0;

  return (
    <div className="space-y-6">
      {/* 头部欢迎区域 */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white" style={{ borderRadius: 16 }}>
        <div className="flex items-center justify-between">
          <div>
            <Title level={3} className="!text-white !mb-2">
              欢迎回来！
            </Title>
            <p className="text-blue-100 mb-0">查看您的房产投资组合表现</p>
          </div>
          <Avatar size={64} icon={<HomeOutlined />} className="bg-white text-blue-600" />
        </div>
      </Card>

      {/* 核心数据卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="投资总额"
              value={totalInvested}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1f4e79', fontSize: '24px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="当前价值"
              value={currentValue}
              precision={2}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#059669', fontSize: '24px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="月收入"
              value={monthlyIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="/月"
              valueStyle={{ color: '#0ea5e9', fontSize: '24px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="总收益"
              value={totalReturn}
              precision={2}
              prefix={isPositiveReturn ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ 
                color: isPositiveReturn ? '#059669' : '#dc2626', 
                fontSize: '24px', 
                fontWeight: 'bold' 
              }}
            />
            <div className="mt-2">
              <span className={`text-sm ${isPositiveReturn ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveReturn ? '+' : ''}{returnPercentage.toFixed(2)}%
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细信息卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="投资组合概览" style={{ borderRadius: 12 }}>
            <Space direction="vertical" size="large" className="w-full">
              {/* 投资分配 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">投资配置率</span>
                  <span className="font-medium">
                    {((totalInvested / (totalInvested + walletBalance)) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  percent={(totalInvested / (totalInvested + walletBalance)) * 100}
                  strokeColor={{
                    '0%': '#1f4e79',
                    '100%': '#0ea5e9',
                  }}
                  className="mb-1"
                />
                <div className="text-xs text-gray-500">
                  已投资 ${totalInvested.toLocaleString()} / 钱包余额 ${walletBalance.toLocaleString()}
                </div>
              </div>

              {/* 月收益趋势 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">月收益率</span>
                  <span className="font-medium text-green-600">
                    {((monthlyIncome / totalInvested) * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress 
                  percent={(monthlyIncome / totalInvested) * 100 * 12} // 年化显示
                  strokeColor="#059669"
                  className="mb-1"
                />
                <div className="text-xs text-gray-500">
                  预计年化收益率: {((monthlyIncome / totalInvested) * 100 * 12).toFixed(2)}%
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="快速统计" style={{ borderRadius: 12 }}>
            <Space direction="vertical" size="middle" className="w-full">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <HomeOutlined className="text-blue-600 mr-2" />
                  <span className="text-gray-700">活跃房产</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">{activeProperties}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrophyOutlined className="text-green-600 mr-2" />
                  <span className="text-gray-700">投资等级</span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {totalInvested > 100000 ? '黄金' : totalInvested > 50000 ? '白银' : '青铜'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <WalletOutlined className="text-orange-600 mr-2" />
                  <span className="text-gray-700">可用余额</span>
                </div>
                <span className="text-lg font-semibold text-orange-600">
                  ${walletBalance.toLocaleString()}
                </span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
