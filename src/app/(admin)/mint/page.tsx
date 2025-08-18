'use client';

import { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Alert, 
  Statistic,
  Progress,
  Modal,
  Steps,
  Select,
  message,
  Row,
  Col
} from 'antd';
import { 
  DollarOutlined,
  HomeOutlined,
  LockOutlined,
  // LockOutlined,
  TrophyOutlined,
  CalculatorOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PropertyAsset {
  id: string;
  name: string;
  location: string;
  estimatedValue: number;
  monthlyRent: number;
  yieldRate: number;
  tokenRatio: number; // 1 USD = X tokens
}

interface StakeData {
  assetId: string;
  stakeAmount: number;
  estimatedTokens: number;
  lockPeriod: number;
  expectedYield: number;
}

export default function MintPage() {
  const [form] = Form.useForm();
  const [selectedAsset, setSelectedAsset] = useState<PropertyAsset | null>(null);
  const [stakeData, setStakeData] = useState<StakeData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 模拟房产资产数据
  const propertyAssets: PropertyAsset[] = [
    {
      id: '1',
      name: '曼哈顿豪华公寓A座',
      location: '纽约, 美国',
      estimatedValue: 850000,
      monthlyRent: 4500,
      yieldRate: 6.35,
      tokenRatio: 1000 // 1 USD = 1000 tokens
    },
    {
      id: '2',
      name: '伦敦市中心办公楼',
      location: '伦敦, 英国',
      estimatedValue: 1200000,
      monthlyRent: 8200,
      yieldRate: 8.2,
      tokenRatio: 800
    },
    {
      id: '3',
      name: '东京涩谷商业综合体',
      location: '东京, 日本',
      estimatedValue: 2100000,
      monthlyRent: 12000,
      yieldRate: 6.85,
      tokenRatio: 1200
    }
  ];

  const steps = [
    {
      title: '选择资产',
      description: '选择要质押的房产资产',
      icon: <HomeOutlined />
    },
    {
      title: '质押金额',
      description: '设置质押金额和期限',
      icon: <LockOutlined />
    },
    {
      title: '估值确认',
      description: '确认估值和代币数量',
      icon: <CalculatorOutlined />
    },
    {
      title: '铸造代币',
      description: '完成质押铸造代币',
      icon: <LockOutlined />
    }
  ];

  const handleAssetSelect = (assetId: string) => {
    const asset = propertyAssets.find(a => a.id === assetId);
    setSelectedAsset(asset || null);
    form.setFieldsValue({ assetId });
  };

  const calculateTokens = (amount: number) => {
    if (!selectedAsset || !amount) return 0;
    return amount * selectedAsset.tokenRatio;
  };

  const calculateExpectedYield = (amount: number, period: number) => {
    if (!selectedAsset || !amount || !period) return 0;
    const annualYield = (amount * selectedAsset.yieldRate) / 100;
    return (annualYield * period) / 12;
  };

  const handleStakeCalculation = () => {
    form.validateFields(['stakeAmount', 'lockPeriod']).then(values => {
      const { stakeAmount, lockPeriod } = values;
      const estimatedTokens = calculateTokens(stakeAmount);
      const expectedYield = calculateExpectedYield(stakeAmount, lockPeriod);
      
      setStakeData({
        assetId: selectedAsset!.id,
        stakeAmount,
        estimatedTokens,
        lockPeriod,
        expectedYield
      });
      
      setCurrentStep(2);
    });
  };

  const handleMint = async () => {
    setLoading(true);
    try {
      // 模拟铸造过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      message.success('代币铸造成功！');
      setCurrentStep(3);
      setModalVisible(true);
    } catch (error) {
      message.error('铸造失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Alert
              message="房产资产质押"
              description="选择一个房产资产进行质押，系统将根据资产估值为您铸造对应的RWA代币"
              type="info"
              showIcon
            />

            <Form.Item
              name="assetId"
              label="选择房产资产"
              rules={[{ required: true, message: '请选择要质押的房产资产' }]}
            >
              <Select
                placeholder="请选择房产资产"
                size="large"
                onChange={handleAssetSelect}
              >
                {propertyAssets.map(asset => (
                  <Option key={asset.id} value={asset.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>{asset.name}</strong>
                        <br />
                        <small className="text-gray-500">{asset.location}</small>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">
                          ${asset.estimatedValue.toLocaleString()}
                        </div>
                        <small className="text-gray-500">
                          收益率: {asset.yieldRate}%
                        </small>
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedAsset && (
              <Card className="bg-blue-50 border-blue-200">
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="资产估值"
                      value={selectedAsset.estimatedValue}
                      prefix={<DollarOutlined />}
                      precision={0}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="月租收入"
                      value={selectedAsset.monthlyRent}
                      prefix={<DollarOutlined />}
                      precision={0}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="年化收益率"
                      value={selectedAsset.yieldRate}
                      suffix="%"
                      precision={2}
                    />
                  </Col>
                </Row>
              </Card>
            )}
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Alert
              message="设置质押参数"
              description="请设置质押金额和锁定期限，系统将根据资产估值计算可铸造的代币数量"
              type="info"
              showIcon
            />

            <Form.Item
              name="stakeAmount"
              label="质押金额 (USD)"
              rules={[
                { required: true, message: '请输入质押金额' },
                { type: 'number', min: 1000, message: '最小质押金额为 $1,000' }
              ]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="请输入质押金额"
                size="large"
                type="number"
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0;
                  if (selectedAsset) {
                    const tokens = calculateTokens(amount);
                    form.setFieldsValue({ estimatedTokens: tokens });
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="lockPeriod"
              label="锁定期限 (月)"
              rules={[{ required: true, message: '请选择锁定期限' }]}
            >
              <Select placeholder="请选择锁定期限" size="large">
                <Option value={3}>3个月 (基础收益)</Option>
                <Option value={6}>6个月 (+10% 奖励)</Option>
                <Option value={12}>12个月 (+25% 奖励)</Option>
                <Option value={24}>24个月 (+50% 奖励)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="estimatedTokens"
              label="预计获得代币数量"
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="根据质押金额自动计算"
                size="large"
                disabled
              />
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Alert
              message="确认质押信息"
              description="请确认以下质押信息无误后进行铸造"
              type="warning"
              showIcon
            />

            {stakeData && selectedAsset && (
              <Card>
                <Title level={4}>质押详情</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="质押资产"
                        value={selectedAsset.name}
                        valueStyle={{ fontSize: '16px' }}
                      />
                      <Text className="text-gray-500">{selectedAsset.location}</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="质押金额"
                        value={stakeData.stakeAmount}
                        prefix={<DollarOutlined />}
                        precision={0}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="锁定期限"
                        value={stakeData.lockPeriod}
                        suffix="个月"
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="铸造代币"
                        value={stakeData.estimatedTokens}
                        prefix={<LockOutlined />}
                        precision={0}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card className="mt-4 bg-green-50 border-green-200">
                  <Title level={5}>预期收益</Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="预期总收益"
                        value={stakeData.expectedYield}
                        prefix={<DollarOutlined />}
                        precision={2}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="年化收益率"
                        value={selectedAsset.yieldRate}
                        suffix="%"
                        precision={2}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Card>
            )}
          </Space>
        );

      case 3:
        return (
          <div className="text-center">
            <Space direction="vertical" size="large" className="w-full">
              <CheckCircleOutlined className="text-6xl text-green-500" />
              <Title level={3} className="text-green-600">
                代币铸造成功！
              </Title>
              <Text className="text-gray-600">
                您已成功质押资产并铸造了 RWA 代币
              </Text>
              
              {stakeData && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="获得代币"
                        value={stakeData.estimatedTokens}
                        prefix={<LockOutlined />}
                        valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="质押金额"
                        value={stakeData.stakeAmount}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="锁定期限"
                        value={stakeData.lockPeriod}
                        suffix="个月"
                        valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              )}
            </Space>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card style={{ borderRadius: 16 }}>
        <div className="mb-6">
          <Title level={3} className="flex items-center">
            <LockOutlined className="mr-2" />
            RWA代币铸造
          </Title>
          <Paragraph className="text-gray-600 mb-0">
            通过质押房产资产，获得对应的RWA代币，享受稳定的收益分配
          </Paragraph>
        </div>

        <Steps current={currentStep} items={steps} className="mb-8" />

        <Form form={form} layout="vertical" className="mb-6">
          {renderStepContent()}
        </Form>

        <div className="flex justify-between">
          <Button
            size="large"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || currentStep === 3}
          >
            上一步
          </Button>

          <Space>
            {currentStep === 0 && selectedAsset && (
              <Button 
                type="primary" 
                size="large" 
                onClick={() => setCurrentStep(1)}
              >
                下一步
              </Button>
            )}
            {currentStep === 1 && (
              <Button 
                type="primary" 
                size="large" 
                onClick={handleStakeCalculation}
              >
                计算估值
              </Button>
            )}
            {currentStep === 2 && (
              <Button 
                type="primary" 
                size="large"
                loading={loading}
                onClick={handleMint}
              >
                确认铸造
              </Button>
            )}
            {currentStep === 3 && (
              <Button 
                type="primary" 
                size="large"
                onClick={() => window.location.href = '/dashboard'}
              >
                返回仪表板
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Modal
        title={<span><TrophyOutlined className="mr-2" />铸造成功</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="dashboard" type="primary" onClick={() => window.location.href = '/dashboard'}>
            查看仪表板
          </Button>,
          <Button key="swap" onClick={() => window.location.href = '/swap'}>
            去交易市场
          </Button>
        ]}
      >
        <div className="text-center py-4">
          <LockOutlined className="text-4xl text-yellow-500 mb-4" />
          <Title level={4}>恭喜！代币铸造成功</Title>
          <Text className="text-gray-600">
            您的RWA代币已添加到钱包中，可以在交易市场进行交易或继续持有获得收益
          </Text>
        </div>
      </Modal>
    </div>
  );
}
