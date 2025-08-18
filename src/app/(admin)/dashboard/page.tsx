'use client';

import { useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Card, Tabs, Button, Space, Typography } from 'antd';
import { 
  PlusOutlined, 
  HomeOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import PortfolioSummary from '@/components/RWA/PortfolioSummary';
import PropertyCard from '@/components/RWA/PropertyCard';

const { Content, Header } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  // 模拟用户投资组合数据
  const portfolioData = {
    totalInvested: 125000,
    currentValue: 132500,
    monthlyIncome: 2100,
    totalReturn: 7500,
    returnPercentage: 6.0,
    activeProperties: 8,
    walletBalance: 25000,
  };

  // 模拟房产项目数据
  const properties = useMemo(() => [
    {
      id: '1',
      name: '曼哈顿豪华公寓',
      location: '纽约, 美国',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyRent: 4500,
      totalValue: 850000,
      yieldRate: 6.35,
      funded: 680000,
      targetAmount: 850000,
      remainingDays: 15,
      status: 'funding' as const,
      description: '位于曼哈顿核心区域的豪华公寓，交通便利，租赁需求旺盛。'
    },
    {
      id: '2',
      name: '伦敦市中心办公楼',
      location: '伦敦, 英国',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyRent: 8200,
      totalValue: 1200000,
      yieldRate: 8.2,
      funded: 1200000,
      targetAmount: 1200000,
      remainingDays: 0,
      status: 'active' as const,
      description: '伦敦金融区核心办公楼，租户为知名金融机构，收益稳定。'
    },
    {
      id: '3',
      name: '东京涩谷商业综合体',
      location: '东京, 日本',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyRent: 12000,
      totalValue: 2100000,
      yieldRate: 6.85,
      funded: 1680000,
      targetAmount: 2100000,
      remainingDays: 8,
      status: 'funding' as const,
      description: '涩谷核心商圈的现代化商业综合体，包含零售、办公多种业态。'
    },
    {
      id: '4',
      name: '新加坡滨海湾住宅',
      location: '新加坡',
      image: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      monthlyRent: 3800,
      totalValue: 680000,
      yieldRate: 6.7,
      funded: 680000,
      targetAmount: 680000,
      remainingDays: 0,
      status: 'active' as const,
      description: '滨海湾地区高端住宅，享有海景和城市景观，租赁市场活跃。'
    }
  ], []);

  const tabItems = [
    {
      key: 'all',
      label: '全部项目',
    },
    {
      key: 'funding',
      label: '募资中',
    },
    {
      key: 'active',
      label: '运营中',
    },
    {
      key: 'my-investments',
      label: '我的投资',
    },
  ];

  const [activeTab, setActiveTab] = useState('all');
  const [filteredProperties, setFilteredProperties] = useState(properties);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredProperties(properties);
    } else if (activeTab === 'my-investments') {
      setFilteredProperties(properties.filter(p => p.status === 'active'));
    } else {
      setFilteredProperties(properties.filter(p => p.status === activeTab));
    }
  }, [activeTab, properties]);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm border-b border-gray-200 px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <Title level={3} className="!mb-0 !text-slate-800">
              房产投资仪表板
            </Title>
          </div>
          <Space>
            <Button icon={<BarChartOutlined />}>
              市场分析
            </Button>
            <Button icon={<SettingOutlined />}>
              设置
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              发现新项目
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 投资组合概览 */}
          <PortfolioSummary data={portfolioData} />

          {/* 房产项目列表 */}
          <Card 
            title={
              <div className="flex items-center">
                <HomeOutlined className="mr-2" />
                房产投资项目
              </div>
            }
            style={{ borderRadius: 12 }}
            extra={
              <Button type="link" icon={<DollarOutlined />}>
                查看全部
              </Button>
            }
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={tabItems}
              className="mb-6"
            />
            
            <Row gutter={[16, 16]}>
              {filteredProperties.map((property) => (
                <Col key={property.id} xs={24} sm={12} lg={8} xl={6}>
                  <PropertyCard {...property} />
                </Col>
              ))}
            </Row>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <HomeOutlined className="text-4xl mb-4" />
                <p>暂无符合条件的房产项目</p>
              </div>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
  