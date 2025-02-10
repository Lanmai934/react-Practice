import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Tabs, QRCode, Spin } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// 二维码状态
enum QRCodeStatus {
  NEW = 'NEW',           // 新生成的二维码
  SCANNED = 'SCANNED',   // 已扫描
  CONFIRMED = 'CONFIRMED', // 已确认
  EXPIRED = 'EXPIRED',   // 已过期
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeStatus, setQrCodeStatus] = useState<QRCodeStatus>(QRCodeStatus.NEW);
  const [activeKey, setActiveKey] = useState('account');

  // 生成二维码
  const generateQRCode = async () => {
    try {
      // 这里应该调用后端接口获取二维码信息
      // 示例：
      const fakeQrCode = `https://example.com/login?code=${Date.now()}`;
      setQrCodeUrl(fakeQrCode);
      setQrCodeStatus(QRCodeStatus.NEW);
    } catch (error) {
      message.error('获取二维码失败，请重试');
    }
  };

  // 轮询检查二维码状态
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (activeKey === 'qrcode' && qrCodeStatus !== QRCodeStatus.CONFIRMED) {
      timer = setInterval(async () => {
        // 这里应该调用后端接口检查状态
        // 示例：
        const random = Math.random();
        if (random < 0.3) {
          setQrCodeStatus(QRCodeStatus.SCANNED);
        } else if (random < 0.4) {
          setQrCodeStatus(QRCodeStatus.CONFIRMED);
          localStorage.setItem('isLoggedIn', 'true');
          message.success('登录成功');
          navigate('/dashboard');
        } else if (random < 0.5) {
          setQrCodeStatus(QRCodeStatus.EXPIRED);
        }
      }, 2000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [activeKey, qrCodeStatus, navigate]);

  // 切换登录方式时重置状态
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'qrcode') {
      generateQRCode();
    }
  };

  // 账号密码登录
  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      if (values.username === 'admin' && values.password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误');
      }
    } finally {
      setLoading(false);
    }
  };

  // 渲染二维码内容
  const renderQRCode = () => {
    let statusContent = null;
    
    switch (qrCodeStatus) {
      case QRCodeStatus.SCANNED:
        statusContent = (
          <div className="qrcode-mask">
            <WechatOutlined style={{ fontSize: 32, color: '#52c41a' }} />
            <p>已扫描，请在手机上确认</p>
          </div>
        );
        break;
      case QRCodeStatus.EXPIRED:
        statusContent = (
          <div className="qrcode-mask">
            <p>二维码已过期</p>
            <Button type="link" onClick={generateQRCode}>点击刷新</Button>
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div className="qrcode-container">
        <QRCode
          value={qrCodeUrl || '-'}
          status={!qrCodeUrl ? 'loading' : 'active'}
          style={{ marginBottom: 24 }}
        />
        {statusContent}
        <div className="qrcode-tips">
          <WechatOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          使用微信扫一扫登录
        </div>
      </div>
    );
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <div className="login-container">
        <Card
          style={{
            width: 400,
            padding: '24px',
            borderRadius: '8px',
          }}
          title="系统登录"
          headStyle={{
            textAlign: 'center',
            fontSize: '24px',
          }}
        >
          <Tabs activeKey={activeKey} onChange={handleTabChange} centered>
            <TabPane 
              tab="账号密码登录" 
              key="account"
            >
              <Form
                name="login"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane 
              tab="微信扫码登录" 
              key="qrcode"
            >
              {renderQRCode()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login; 