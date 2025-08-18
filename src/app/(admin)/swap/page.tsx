'use client';

import { useState, useEffect } from 'react';
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
  Tabs,
  Modal,
  Form,
  message,
  Tag,
  Progress
} from 'antd';
import { 
  SwapOutlined,
  PlusOutlined,
  MinusOutlined,
  DollarOutlined,
  LockOutlined,
  FireOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: string;
  change24h: number;
}

interface LiquidityPool {
  id: string;
  token0: Token;
  token1: Token;
  liquidity: number;
  volume24h: number;
  fees24h: number;
  apr: number;
  myLiquidity: number;
}

interface TradeData {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: number;
  toAmount: number;
  slippage: number;
  priceImpact: number;
}

export default function SwapPage() {
  const [activeTab, setActiveTab] = useState('swap');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [tradeData, setTradeData] = useState<TradeData>({
    fromToken: null,
    toToken: null,
    fromAmount: 0,
    toAmount: 0,
    slippage: 0.5,
    priceImpact: 0
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'remove'>('add');

  // 初始化代币数据
  useEffect(() => {
    const mockTokens: Token[] = [
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 5.2341,
        price: 2340.50,
        icon: '🔷',
        change24h: 2.45
      },
      {
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 12450.00,
        price: 1.00,
        icon: '💵',
        change24h: 0.01
      },
      {
        id: 'rwa-nyc',
        symbol: 'NYC-RWA',
        name: '纽约房产代币',
        balance: 850.30,
        price: 125.80,
        icon: '🏢',
        change24h: 5.67
      },
      {
        id: 'rwa-london',
        symbol: 'LON-RWA',
        name: '伦敦房产代币',
        balance: 420.15,
        price: 89.25,
        icon: '🏛️',
        change24h: -1.23
      },
      {
        id: 'rwa-tokyo',
        symbol: 'TKY-RWA',
        name: '东京房产代币',
        balance: 1250.75,
        price: 67.40,
        icon: '🏯',
        change24h: 3.89
      }
    ];

    const mockPools: LiquidityPool[] = [
      {
        id: '1',
        token0: mockTokens[0], // ETH
        token1: mockTokens[1], // USDC
        liquidity: 1250000,
        volume24h: 89000,
        fees24h: 267,
        apr: 15.6,
        myLiquidity: 5430
      },
      {
        id: '2',
        token0: mockTokens[2], // NYC-RWA
        token1: mockTokens[1], // USDC
        liquidity: 850000,
        volume24h: 34000,
        fees24h: 102,
        apr: 22.3,
        myLiquidity: 2150
      },
      {
        id: '3',
        token0: mockTokens[3], // LON-RWA
        token1: mockTokens[0], // ETH
        liquidity: 420000,
        volume24h: 18000,
        fees24h: 54,
        apr: 18.9,
        myLiquidity: 0
      }
    ];

    setTokens(mockTokens);
    setPools(mockPools);
  }, []);

  const calculateSwap = (fromAmount: number, fromToken: Token, toToken: Token) => {
    if (!fromAmount || !fromToken || !toToken) return 0;
    
    // 简化的兑换计算（实际应该根据流动性池计算）
    const rate = fromToken.price / toToken.price;
    const fee = 0.003; // 0.3% 手续费
    const toAmount = fromAmount * rate * (1 - fee);
    
    return toAmount;
  };

  const handleSwap = async () => {
    if (!tradeData.fromToken || !tradeData.toToken || !tradeData.fromAmount) {
      message.error('请完善交易信息');
      return;
    }

    setLoading(true);
    try {
      // 模拟交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('交易成功！');
      
      // 重置表单
      setTradeData({
        ...tradeData,
        fromAmount: 0,
        toAmount: 0
      });
    } catch (error) {
      message.error('交易失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSelect = (tokenId: string, type: 'from' | 'to') => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    if (type === 'from') {
      setTradeData({ ...tradeData, fromToken: token });
    } else {
      setTradeData({ ...tradeData, toToken: token });
    }
  };

  const handleAmountChange = (amount: number, type: 'from' | 'to') => {
    if (type === 'from') {
      const toAmount = tradeData.toToken ? 
        calculateSwap(amount, tradeData.fromToken!, tradeData.toToken) : 0;
      
      setTradeData({
        ...tradeData,
        fromAmount: amount,
        toAmount,
        priceImpact: amount > 10000 ? 0.5 : 0.1 // 简化的价格影响计算
      });
    }
  };

  const swapTokens = () => {
    setTradeData({
      ...tradeData,
      fromToken: tradeData.toToken,
      toToken: tradeData.fromToken,
      fromAmount: tradeData.toAmount,
      toAmount: tradeData.fromAmount
    });
  };

  const poolColumns = [
    {
      title: '交易对',
      key: 'pair',
      render: (_: any, pool: LiquidityPool) => (
        <Space>
          <span>{pool.token0.icon}</span>
          <span className="font-medium">
            {pool.token0.symbol}/{pool.token1.symbol}
          </span>
        </Space>
      )
    },
    {
      title: '流动性',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: '24h交易量',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: '24h手续费',
      dataIndex: 'fees24h',
      key: 'fees24h',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: 'APR',
      dataIndex: 'apr',
      key: 'apr',
      render: (value: number) => (
        <Tag color={value > 20 ? 'red' : value > 15 ? 'orange' : 'green'}>
          {value.toFixed(1)}%
        </Tag>
      )
    },
    {
      title: '我的流动性',
      dataIndex: 'myLiquidity',
      key: 'myLiquidity',
      render: (value: number) => value > 0 ? `$${value.toLocaleString()}` : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, pool: LiquidityPool) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => {
              setModalType('add');
              setModalVisible(true);
            }}
          >
            添加
          </Button>
          {pool.myLiquidity > 0 && (
            <Button 
              size="small" 
              icon={<MinusOutlined />}
              onClick={() => {
                setModalType('remove');
                setModalVisible(true);
              }}
            >
              移除
            </Button>
          )}
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'swap',
      label: (
        <span>
          <SwapOutlined />
          代币交易
        </span>
      ),
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="代币兑换" style={{ borderRadius: 16 }}>
              <Space direction="vertical" size="large" className="w-full">
                {/* From Token */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>支付</Text>
                    <Text className="text-gray-500">
                      余额: {tradeData.fromToken?.balance.toFixed(4) || 0}
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      size="large"
                      placeholder="0.0"
                      value={tradeData.fromAmount || ''}
                      onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0, 'from')}
                      className="flex-1"
                    />
                    <Select
                      size="large"
                      placeholder="选择代币"
                      className="w-40"
                      value={tradeData.fromToken?.id}
                      onChange={(value) => handleTokenSelect(value, 'from')}
                    >
                      {tokens.map(token => (
                        <Option key={token.id} value={token.id}>
                          <Space>
                            <span>{token.icon}</span>
                            <span>{token.symbol}</span>
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Swap Icon */}
                <div className="text-center">
                  <Button 
                    type="text" 
                    icon={<LockOutlined />} 
                    onClick={swapTokens}
                    className="text-2xl h-auto"
                  />
                </div>

                {/* To Token */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>获得</Text>
                    <Text className="text-gray-500">
                      余额: {tradeData.toToken?.balance.toFixed(4) || 0}
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      size="large"
                      placeholder="0.0"
                      value={tradeData.toAmount.toFixed(6)}
                      disabled
                      className="flex-1"
                    />
                    <Select
                      size="large"
                      placeholder="选择代币"
                      className="w-40"
                      value={tradeData.toToken?.id}
                      onChange={(value) => handleTokenSelect(value, 'to')}
                    >
                      {tokens.map(token => (
                        <Option key={token.id} value={token.id}>
                          <Space>
                            <span>{token.icon}</span>
                            <span>{token.symbol}</span>
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Trade Info */}
                {tradeData.fromToken && tradeData.toToken && tradeData.fromAmount > 0 && (
                  <Alert
                    message={
                      <Space direction="vertical" size="small">
                        <div className="flex justify-between">
                          <span>汇率:</span>
                          <span>
                            1 {tradeData.fromToken.symbol} = {' '}
                            {(tradeData.fromToken.price / tradeData.toToken.price).toFixed(6)} {' '}
                            {tradeData.toToken.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>手续费:</span>
                          <span>0.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>价格影响:</span>
                          <span className={tradeData.priceImpact > 0.3 ? 'text-red-500' : 'text-green-500'}>
                            {tradeData.priceImpact.toFixed(2)}%
                          </span>
                        </div>
                      </Space>
                    }
                    type="info"
                  />
                )}

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  disabled={!tradeData.fromToken || !tradeData.toToken || tradeData.fromAmount <= 0}
                  onClick={handleSwap}
                >
                  {!tradeData.fromToken || !tradeData.toToken 
                    ? '请选择代币' 
                    : tradeData.fromAmount <= 0 
                    ? '请输入金额' 
                    : '确认兑换'
                  }
                </Button>
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="市场信息" style={{ borderRadius: 16 }}>
              <Space direction="vertical" size="middle" className="w-full">
                {tokens.slice(0, 4).map(token => (
                  <div key={token.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <Space>
                      <span className="text-2xl">{token.icon}</span>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-500">{token.name}</div>
                      </div>
                    </Space>
                    <div className="text-right">
                      <div className="font-medium">${token.price.toFixed(2)}</div>
                      <div className={`text-xs ${token.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'liquidity',
      label: (
        <span>
          <LockOutlined />
          流动性池
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总流动性"
                  value={2520000}
                  prefix={<DollarOutlined />}
                  precision={0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="24h交易量"
                  value={141000}
                  prefix={<DollarOutlined />}
                  precision={0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="24h手续费"
                  value={423}
                  prefix={<DollarOutlined />}
                  precision={0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="我的流动性"
                  value={7580}
                  prefix={<DollarOutlined />}
                  precision={0}
                />
              </Card>
            </Col>
          </Row>

          <Card 
            title="流动性池列表"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalType('add');
                  setModalVisible(true);
                }}
              >
                创建新池
              </Button>
            }
          >
            <Table
              columns={poolColumns}
              dataSource={pools}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Space>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Title level={3} className="flex items-center">
          <SwapOutlined className="mr-2" />
          去中心化交易所
        </Title>
        <Text className="text-gray-600">
          安全、透明的RWA代币交易平台，支持即时兑换和流动性挖矿
        </Text>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
        size="large"
      />

      {/* 流动性操作Modal */}
      <Modal
        title={modalType === 'add' ? '添加流动性' : '移除流动性'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Alert
            message={modalType === 'add' ? '添加流动性说明' : '移除流动性说明'}
            description={
              modalType === 'add' 
                ? '添加流动性可以获得手续费分成和流动性挖矿奖励'
                : '移除流动性将停止获得收益，代币将返回到您的钱包'
            }
            type="info"
            className="mb-4"
          />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="代币A">
                <Select placeholder="选择代币" size="large">
                  {tokens.map(token => (
                    <Option key={token.id} value={token.id}>
                      {token.icon} {token.symbol}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="代币B">
                <Select placeholder="选择代币" size="large">
                  {tokens.map(token => (
                    <Option key={token.id} value={token.id}>
                      {token.icon} {token.symbol}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="数量A">
                <Input placeholder="0.0" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="数量B">
                <Input placeholder="0.0" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Space className="w-full" direction="vertical">
            <Button type="primary" size="large" block>
              {modalType === 'add' ? '添加流动性' : '移除流动性'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
