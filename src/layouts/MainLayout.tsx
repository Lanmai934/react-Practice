import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Space, message, Button, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import LanguageSwitch from '../components/LanguageSwitch';
import Logo from '../components/Logo';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { token } = theme.useToken();

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    message.success(t('logout.success'));
    navigate('/login');
  };

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('menu.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout.button'),
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    { 
      key: 'dashboard', 
      icon: <DashboardOutlined />,
      label: t('menu.dashboard') 
    },
    { 
      key: 'user', 
      icon: <UserOutlined />,
      label: t('menu.user') 
    },
    { 
      key: 'reports', 
      icon: <BarChartOutlined />,
      label: t('menu.reports') 
    },
    { 
      key: 'settings', 
      icon: <SettingOutlined />,
      label: t('menu.settings') 
    },
     { 
      key: 'Graph', 
      icon: <SettingOutlined />,
      label: t('menu.Graph') 
    },
    { 
      key: 'FormRenderer', 
      icon: <SettingOutlined />,
      label: t('menu.FormRenderer') 
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Layout style={{ height: '100vh', background: token.colorBgContainer, }}>
      <Sider 
        width={220} 
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          zIndex: 1001,
        }}
      >
        <Logo collapsed={collapsed} />
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            border: 'none',
            padding: '8px',
          }}
        />
      </Sider>
      <Layout style={{ 
        marginLeft: collapsed ? (isMobile ? 0 : 80) : 220, 
        transition: 'all 0.2s',
        background: token.colorBgLayout,
      }}>
        <Header style={{ 
          padding: '0 24px', 
          background: token.colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? (isMobile ? 0 : 80) : 220,
          height: 64,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          transition: 'all 0.2s',
          zIndex: 1000,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 48,
              height: 48,
              marginLeft: -12,
            }}
          />
          <Space size={16}>
            <LanguageSwitch />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <UserOutlined />
                <span style={{ 
                  display: isMobile ? 'none' : 'inline',
                  color: token.colorTextSecondary,
                }}>
                  Admin
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: '88px 24px 24px',
          minHeight: 280,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          padding: 24,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;