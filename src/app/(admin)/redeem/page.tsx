'use client';

import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Typography, 
  Space, 
  Alert, 
  Statistic,
  Table,
  Modal,
  Form,
  Progress,
  Tag,
  Steps,
  message
} from 'antd';
import { 
  DollarOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface RedeemableAsset {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  balance: number;
  lockedAmount: number;
  availableAmount: number;
  underlyingAsset: string;
  redemptionRatio: number; // 1 token = X USD of underlying asset
  lockEndDate: Date;
  penaltyRate: number; // Early withdrawal penalty
  isLocked: boolean;
}

interface RedemptionRequest {
  id: string;
  tokenAmount: number;
  underlyingValue: number;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletion: Date;
  transactionHash?: string;
}

export default function RedeemPage() {
  const [selectedAsset, setSelectedAsset] = useState<RedeemableAsset | null>(null);
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [redeemType, setRedeemType] = useState<'normal' | 'early'>('normal');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // 模拟用户的可赎回资产
  const redeemableAssets: RedeemableAsset[] = [
    {
      id: '1',
      tokenSymbol: 'NYC-RWA',
      tokenName: '纽约房产代币',
      balance: 850.30,
      lockedAmount: 500.00,
      availableAmount: 350.30,
      underlyingAsset: '曼哈顿豪华公寓A座',
      redemptionRatio: 125.80, // 1 token = $125.80
      lockEndDate: new Date('2024-12-31'),
      penaltyRate: 0.15, // 15% penalty for early withdrawal
      isLocked: true
    },
    {
      id: '2',
      tokenSymbol: 'LON-RWA',
      tokenName: '伦敦房产代币',
      balance: 420.15,
      lockedAmount: 0,
      availableAmount: 420.15,
      underlyingAsset: '伦敦市中心办公楼',
      redemptionRatio: 89.25,
      lockEndDate: new Date('2024-06-15'),
      penaltyRate: 0,
      isLocked: false
    },
    {
      id: '3',
      tokenSymbol: 'TKY-RWA',
      tokenName: '东京房产代币',
      balance: 1250.75,
      lockedAmount: 800.00,
      availableAmount: 450.75,
      underlyingAsset: '东京涩谷商业综合体',
      redemptionRatio: 67.40,
      lockEndDate: new Date('2025-03-20'),
      penaltyRate: 0.12,
      isLocked: true
    }
  ];

  // 模拟历史赎回记录
  const redemptionHistory: RedemptionRequest[] = [
    {
      id: '1',
      tokenAmount: 100,
      underlyingValue: 8925,
      requestDate: new Date('2024-01-15'),
      status: 'completed',
      estimatedCompletion: new Date('2024-01-17'),
      transactionHash: '0x1234...5678'
    },
    {
      id: '2',
      tokenAmount: 50,
      underlyingValue: 6370,
      requestDate: new Date('2024-01-20'),
      status: 'processing',
      estimatedCompletion: new Date('2024-01-22')
    }
  ];

  const steps = [
    {
      title: '选择资产',
      description: '选择要赎回的代币',
      icon: <LockOutlined />
    },
    {
      title: '设置数量',
      description: '输入赎回数量',
      icon: <DollarOutlined />
    },
    {
      title: '确认赎回',
      description: '确认赎回信息',
      icon: <CheckCircleOutlined />
    },
    {
      title: '处理中',
      description: '等待处理完成',
      icon: <ClockCircleOutlined />
    }
  ];

  const calculateRedemptionValue = (amount: number, asset: RedeemableAsset, isEarly: boolean) => {
    if (!amount || !asset) return 0;
    
    let value = amount * asset.redemptionRatio;
    
    if (isEarly && asset.isLocked) {
      value = value * (1 - asset.penaltyRate);
    }
    
    return value;
  };

  const handleAssetSelect = (assetId: string) => {
    const asset = redeemableAssets.find(a => a.id === assetId);
    setSelectedAsset(asset || null);
    setRedeemAmount(0);
    setRedeemType('normal');
  };

  const handleRedeemTypeChange = (type: 'normal' | 'early') => {
    setRedeemType(type);
  };

  const handleConfirmRedeem = () => {
    setConfirmModalVisible(true);
  };

  const handleSubmitRedemption = async () => {
    setLoading(true);
    try {
      // 模拟提交赎回请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('赎回请求已提交');
      setCurrentStep(3);
      setConfirmModalVisible(false);
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'default', text: '待处理' },
      processing: { color: 'processing', text: '处理中' },
      completed: { color: 'success', text: '已完成' },
      failed: { color: 'error', text: '失败' }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const assetColumns = [
    {
      title: '代币',
      key: 'token',
      render: (_: any, asset: RedeemableAsset) => (
        <Space>
          <LockOutlined />
          <div>
            <div className="font-medium">{asset.tokenSymbol}</div>
            <div className="text-xs text-gray-500">{asset.tokenName}</div>
          </div>
        </Space>
      )
    },
    {
      title: '总余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (value: number) => value.toFixed(2)
    },
    {
      title: '可赎回',
      dataIndex: 'availableAmount',
      key: 'availableAmount',
      render: (value: number) => (
        <span className="text-green-600 font-medium">{value.toFixed(2)}</span>
      )
    },
    {
      title: '锁定中',
      dataIndex: 'lockedAmount',
      key: 'lockedAmount',
      render: (value: number, record: RedeemableAsset) => (
        <Space>
          <span>{value.toFixed(2)}</span>
          {record.isLocked && (
            <Tag icon={<LockOutlined />} color="orange">
              {record.lockEndDate.toLocaleDateString()}
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: '赎回比例',
      dataIndex: 'redemptionRatio',
      key: 'redemptionRatio',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, asset: RedeemableAsset) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            disabled={asset.availableAmount <= 0}
            onClick={() => handleAssetSelect(asset.id)}
          >
            赎回
          </Button>
        </Space>
      )
    }
  ];

  const historyColumns = [
    {
      title: '代币数量',
      dataIndex: 'tokenAmount',
      key: 'tokenAmount'
    },
    {
      title: '赎回价值',
      dataIndex: 'underlyingValue',
      key: 'underlyingValue',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: '申请时间',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: Date) => date.toLocaleDateString()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusInfo = getStatusTag(status);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '预计完成',
      dataIndex: 'estimatedCompletion',
      key: 'estimatedCompletion',
      render: (date: Date) => date.toLocaleDateString()
    }
  ];

  const renderRedeemForm = () => {
    if (!selectedAsset) return null;

    const maxRedeemable = redeemType === 'normal' ? selectedAsset.availableAmount : selectedAsset.balance;
    const redemptionValue = calculateRedemptionValue(redeemAmount, selectedAsset, redeemType === 'early');
    const penalty = redeemType === 'early' && selectedAsset.isLocked ? 
      (redeemAmount * selectedAsset.redemptionRatio * selectedAsset.penaltyRate) : 0;

    return (
      <Card title="赎回操作" style={{ borderRadius: 16 }}>
        <Steps current={currentStep} items={steps} size="small" className="mb-6" />
        
        <Space direction="vertical" size="large" className="w-full">
          {/* 选择赎回类型 */}
          <div>
            <Text strong>赎回类型</Text>
            <div className="mt-2">
              <Space>
                <Button 
                  type={redeemType === 'normal' ? 'primary' : 'default'}
                  onClick={() => handleRedeemTypeChange('normal')}
                  disabled={selectedAsset.availableAmount <= 0}
                >
                  <UnlockOutlined />
                  正常赎回
                </Button>
                <Button 
                  type={redeemType === 'early' ? 'primary' : 'default'}
                  onClick={() => handleRedeemTypeChange('early')}
                  disabled={!selectedAsset.isLocked || selectedAsset.lockedAmount <= 0}
                >
                  <LockOutlined />
                  提前赎回
                </Button>
              </Space>
            </div>
            
            {redeemType === 'early' && selectedAsset.isLocked && (
              <Alert
                message="提前赎回说明"
                description={`提前赎回将收取 ${(selectedAsset.penaltyRate * 100).toFixed(1)}% 的手续费。锁定期将于 ${selectedAsset.lockEndDate.toLocaleDateString()} 结束。`}
                type="warning"
                showIcon
                className="mt-2"
              />
            )}
          </div>

          {/* 赎回数量 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Text strong>赎回数量</Text>
              <Text className="text-gray-500">
                可赎回: {maxRedeemable.toFixed(2)} {selectedAsset.tokenSymbol}
              </Text>
            </div>
            <Input
              size="large"
              placeholder="请输入赎回数量"
              value={redeemAmount || ''}
              onChange={(e) => setRedeemAmount(parseFloat(e.target.value) || 0)}
              suffix={
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => setRedeemAmount(maxRedeemable)}
                >
                  最大
                </Button>
              }
            />
            <Progress 
              percent={(redeemAmount / maxRedeemable) * 100} 
              showInfo={false} 
              className="mt-2"
            />
          </div>

          {/* 赎回详情 */}
          {redeemAmount > 0 && (
            <Card className="bg-gray-50">
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between">
                  <span>赎回代币:</span>
                  <span className="font-medium">{redeemAmount} {selectedAsset.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span>赎回比例:</span>
                  <span>1 {selectedAsset.tokenSymbol} = ${selectedAsset.redemptionRatio}</span>
                </div>
                {penalty > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>提前赎回手续费:</span>
                    <span>-${penalty.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>实际获得:</span>
                  <span className="text-green-600">${redemptionValue.toFixed(2)}</span>
                </div>
              </Space>
            </Card>
          )}

          <Button
            type="primary"
            size="large"
            block
            disabled={redeemAmount <= 0 || redeemAmount > maxRedeemable}
            onClick={handleConfirmRedeem}
          >
            确认赎回
          </Button>
        </Space>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Title level={3} className="flex items-center">
          <LockOutlined className="mr-2" />
          代币赎回
        </Title>
        <Paragraph className="text-gray-600 mb-0">
          将RWA代币赎回为底层资产或等价值的其他代币
        </Paragraph>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Space direction="vertical" size="large" className="w-full">
            {/* 资产概览 */}
            <Card title="我的RWA资产" style={{ borderRadius: 16 }}>
              <Table
                columns={assetColumns}
                dataSource={redeemableAssets}
                rowKey="id"
                pagination={false}
              />
            </Card>

            {/* 赎回表单 */}
            {selectedAsset && renderRedeemForm()}

            {/* 历史记录 */}
            <Card title="赎回历史" style={{ borderRadius: 16 }}>
              <Table
                columns={historyColumns}
                dataSource={redemptionHistory}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Space>
        </Col>

        <Col span={8}>
          <Space direction="vertical" size="large" className="w-full">
            {/* 统计信息 */}
            <Card title="赎回统计" style={{ borderRadius: 16 }}>
              <Space direction="vertical" size="middle" className="w-full">
                <Statistic
                  title="总持有价值"
                  value={redeemableAssets.reduce((sum, asset) => sum + (asset.balance * asset.redemptionRatio), 0)}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
                <Statistic
                  title="可赎回价值"
                  value={redeemableAssets.reduce((sum, asset) => sum + (asset.availableAmount * asset.redemptionRatio), 0)}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Statistic
                  title="锁定价值"
                  value={redeemableAssets.reduce((sum, asset) => sum + (asset.lockedAmount * asset.redemptionRatio), 0)}
                  prefix={<LockOutlined />}
                  precision={2}
                  valueStyle={{ color: '#faad14' }}
                />
              </Space>
            </Card>

            {/* 赎回说明 */}
            <Card title="赎回说明" style={{ borderRadius: 16 }}>
              <Space direction="vertical" size="small">
                <div className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-green-500 mt-1" />
                  <span className="text-sm">正常赎回无手续费，1-3个工作日到账</span>
                </div>
                <div className="flex items-start gap-2">
                  <WarningOutlined className="text-orange-500 mt-1" />
                  <span className="text-sm">提前赎回需支付手续费，立即到账</span>
                </div>
                <div className="flex items-start gap-2">
                  <ClockCircleOutlined className="text-blue-500 mt-1" />
                  <span className="text-sm">赎回申请提交后不可撤销</span>
                </div>
                <div className="flex items-start gap-2">
                  <HomeOutlined className="text-purple-500 mt-1" />
                  <span className="text-sm">赎回价值基于最新资产估值</span>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* 确认Modal */}
      <Modal
        title="确认赎回"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            loading={loading}
            onClick={handleSubmitRedemption}
          >
            确认赎回
          </Button>
        ]}
      >
        {selectedAsset && (
          <Space direction="vertical" size="middle" className="w-full">
            <Alert
              message="请仔细确认赎回信息"
              description="赎回操作不可撤销，请确保信息正确"
              type="warning"
              showIcon
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between">
                  <span>赎回代币:</span>
                  <span className="font-medium">{redeemAmount} {selectedAsset.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span>赎回类型:</span>
                  <Tag color={redeemType === 'normal' ? 'green' : 'orange'}>
                    {redeemType === 'normal' ? '正常赎回' : '提前赎回'}
                  </Tag>
                </div>
                <div className="flex justify-between">
                  <span>预计到账:</span>
                  <span>{redeemType === 'normal' ? '1-3个工作日' : '立即到账'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>实际获得:</span>
                  <span className="text-green-600">
                    ${calculateRedemptionValue(redeemAmount, selectedAsset, redeemType === 'early').toFixed(2)}
                  </span>
                </div>
              </Space>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
