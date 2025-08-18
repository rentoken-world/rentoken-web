'use client';

import { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Upload, 
  Steps, 
  Typography, 
  Space, 
  Alert, 
  Divider,
  Tag,
  Progress,
  message
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  IdcardOutlined,
  WalletOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface KYCFormData {
  phone: string;
  email: string;
  idNumber: string;
  walletAddress: string;
  documents: any[];
}

export default function KYCPage() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'submitted' | 'approved' | 'rejected'>('pending');
  const [formData, setFormData] = useState<Partial<KYCFormData>>({});

  const steps = [
    {
      title: '基本信息',
      description: '填写个人基本信息',
      icon: <UserOutlined />,
    },
    {
      title: '身份验证',
      description: '上传身份证明文件',
      icon: <IdcardOutlined />,
    },
    {
      title: '钱包绑定',
      description: '关联钱包地址',
      icon: <WalletOutlined />,
    },
    {
      title: '提交审核',
      description: '等待审核结果',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 模拟提交KYC申请
      await new Promise(resolve => setTimeout(resolve, 2000));
      setKycStatus('submitted');
      message.success('KYC申请已提交，请等待审核');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        form.setFieldsValue({ walletAddress: accounts[0] });
        message.success('钱包连接成功');
      }
    } catch (error) {
      message.error('钱包连接失败');
    }
  };

  const getKYCStatusTag = () => {
    const statusMap = {
      pending: { color: 'default', text: '未开始', icon: <ClockCircleOutlined /> },
      submitted: { color: 'processing', text: '审核中', icon: <ClockCircleOutlined /> },
      approved: { color: 'success', text: '已通过', icon: <CheckCircleOutlined /> },
      rejected: { color: 'error', text: '已拒绝', icon: <ClockCircleOutlined /> },
    };
    return statusMap[kycStatus];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Form.Item
              name="phone"
              label="手机号码"
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="请输入手机号码" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="请输入邮箱地址" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="idNumber"
              label="身份证号码"
              rules={[
                { required: true, message: '请输入身份证号码' },
                { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入有效的身份证号码' }
              ]}
            >
              <Input 
                prefix={<IdcardOutlined />} 
                placeholder="请输入身份证号码" 
                size="large"
              />
            </Form.Item>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Alert
              message="身份证明文件上传"
              description="请上传清晰的身份证正反面照片，文件格式支持JPG、PNG，单个文件不超过5MB"
              type="info"
              showIcon
            />

            <Form.Item
              name="idCardFront"
              label="身份证正面"
              rules={[{ required: true, message: '请上传身份证正面' }]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传正面</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="idCardBack"
              label="身份证反面"
              rules={[{ required: true, message: '请上传身份证反面' }]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传反面</div>
                </div>
              </Upload>
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <Alert
              message="钱包地址绑定"
              description="您的KYC信息将与此钱包地址永久绑定，请确保钱包地址正确"
              type="warning"
              showIcon
            />

            <Form.Item
              name="walletAddress"
              label="钱包地址"
              rules={[
                { required: true, message: '请连接钱包地址' },
                { pattern: /^0x[a-fA-F0-9]{40}$/, message: '请输入有效的以太坊地址' }
              ]}
            >
              <Input 
                prefix={<WalletOutlined />} 
                placeholder="请连接您的钱包地址" 
                size="large"
                disabled
              />
            </Form.Item>

            <Button 
              type="primary" 
              size="large" 
              icon={<WalletOutlined />}
              onClick={connectWallet}
              className="w-full"
            >
              连接 MetaMask 钱包
            </Button>
          </Space>
        );

      case 3:
        return (
          <Space direction="vertical" size="large" className="w-full">
            <div className="text-center">
              <CheckCircleOutlined className="text-5xl text-green-500 mb-4" />
              <Title level={4}>确认提交KYC申请</Title>
              <Text className="text-gray-600">
                请确认以下信息无误后提交审核申请
              </Text>
            </div>

            <Card>
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex justify-between">
                  <span>手机号码:</span>
                  <span>{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>邮箱地址:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>身份证号:</span>
                  <span>{formData.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>钱包地址:</span>
                  <span className="text-xs">{formData.walletAddress}</span>
                </div>
              </Space>
            </Card>
          </Space>
        );

      default:
        return null;
    }
  };

  if (kycStatus === 'submitted') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center" style={{ borderRadius: 16 }}>
          <Space direction="vertical" size="large" className="w-full">
            <ClockCircleOutlined className="text-6xl text-blue-500" />
            <Title level={3}>KYC申请已提交</Title>
            <Text className="text-gray-600">
              您的KYC申请正在审核中，通常需要1-3个工作日
            </Text>
            <Progress percent={66} strokeColor="#1890ff" />
            <Text className="text-sm text-gray-500">
              我们将通过邮箱和短信通知您审核结果
            </Text>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card style={{ borderRadius: 16 }}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={3} className="!mb-0">
              KYC身份认证
            </Title>
            <Tag {...getKYCStatusTag()}>
              {getKYCStatusTag().icon} {getKYCStatusTag().text}
            </Tag>
          </div>
          <Text className="text-gray-600">
            为了确保平台安全和合规运营，请完成身份认证流程
          </Text>
        </div>

        <Steps current={currentStep} items={steps} className="mb-8" />

        <Form form={form} layout="vertical" className="mb-6">
          {renderStepContent()}
        </Form>

        <Divider />

        <div className="flex justify-between">
          <Button
            size="large"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            上一步
          </Button>

          <Space>
            {currentStep < steps.length - 1 && (
              <Button type="primary" size="large" onClick={handleNext}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                size="large" 
                loading={loading}
                onClick={handleSubmit}
              >
                提交审核
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}
