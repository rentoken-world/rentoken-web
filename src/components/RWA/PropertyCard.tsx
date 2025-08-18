'use client';

import { Card, Typography, Progress, Tag, Space, Button, Statistic } from 'antd';
import { HomeOutlined, EnvironmentOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  monthlyRent: number;
  totalValue: number;
  yieldRate: number;
  funded: number;
  targetAmount: number;
  remainingDays: number;
  status: 'funding' | 'active' | 'completed';
  description: string;
}

export default function PropertyCard({
  name,
  location,
  image,
  monthlyRent,
  totalValue,
  yieldRate,
  funded,
  targetAmount,
  remainingDays,
  status,
  description
}: PropertyCardProps) {
  const fundingProgress = (funded / targetAmount) * 100;
  
  const getStatusTag = () => {
    const statusMap = {
      funding: { color: 'processing', text: '募资中' },
      active: { color: 'success', text: '运营中' },
      completed: { color: 'default', text: '已完成' }
    };
    return statusMap[status];
  };

  const getStatusColor = () => {
    return status === 'funding' ? '#1890ff' : status === 'active' ? '#52c41a' : '#d9d9d9';
  };

  return (
    <Card
      hoverable
      className="w-full"
      style={{ borderRadius: 12 }}
      cover={
        <div className="relative">
          <Image
            alt={name}
            src={image}
            width={400}
            height={192}
            className="h-48 w-full object-cover"
            style={{ borderRadius: '12px 12px 0 0' }}
          />
          <div className="absolute top-4 right-4">
            <Tag color={getStatusTag().color} className="font-medium">
              {getStatusTag().text}
            </Tag>
          </div>
        </div>
      }
      actions={[
        <Button key="invest" type="primary" size="small" disabled={status !== 'funding'}>
          {status === 'funding' ? '立即投资' : status === 'active' ? '查看详情' : '已结束'}
        </Button>
      ]}
    >
      <div className="space-y-4">
        {/* 房产基本信息 */}
        <div>
          <Title level={5} className="!mb-2 flex items-center">
            <HomeOutlined className="mr-2" />
            {name}
          </Title>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <EnvironmentOutlined className="mr-1" />
            <span>{location}</span>
          </div>
          <Paragraph ellipsis={{ rows: 2 }} className="!mb-0 text-sm text-gray-600">
            {description}
          </Paragraph>
        </div>

        {/* 收益数据 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text className="text-xs text-gray-500">月租金收入</Text>
            <div className="text-lg font-semibold text-green-600">
              ${monthlyRent.toLocaleString()}
            </div>
          </div>
          <div>
            <Text className="text-xs text-gray-500">年化收益率</Text>
            <div className="text-lg font-semibold text-blue-600">
              {yieldRate.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* 投资进度 */}
        {status === 'funding' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">募资进度</Text>
              <Text className="text-sm font-medium">
                ${funded.toLocaleString()} / ${targetAmount.toLocaleString()}
              </Text>
            </div>
            <Progress 
              percent={fundingProgress} 
              strokeColor={getStatusColor()}
              showInfo={false}
              className="mb-2"
            />
            <div className="flex justify-between items-center">
              <Text className="text-xs text-gray-500 flex items-center">
                <CalendarOutlined className="mr-1" />
                剩余 {remainingDays} 天
              </Text>
              <Text className="text-xs text-gray-500">
                {fundingProgress.toFixed(1)}% 完成
              </Text>
            </div>
          </div>
        )}

        {/* 活跃资产数据 */}
        {status === 'active' && (
          <div className="bg-green-50 p-3 rounded-lg">
            <Space direction="vertical" size="small" className="w-full">
              <div className="flex justify-between">
                <Text className="text-sm text-gray-600">资产总值</Text>
                <Text className="text-sm font-semibold">${totalValue.toLocaleString()}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-sm text-gray-600">您的投资</Text>
                <Text className="text-sm font-semibold text-green-600">${funded.toLocaleString()}</Text>
              </div>
            </Space>
          </div>
        )}
      </div>
    </Card>
  );
}
