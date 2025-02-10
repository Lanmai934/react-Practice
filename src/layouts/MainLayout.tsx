import React from 'react';
import { Layout, Menu, Dropdown, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    message.success('退出登录成功');
    navigate('/login');
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人设置',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 侧边栏菜单项
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: '数据报表',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Layout className="site-layout">
      <Sider width={200} className="site-sider" theme="light">
        <div className="logo">React Admin</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: 'calc(100% - 64px)' }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="site-header">
          <div className="header-content">
            <div style={{ flex: 1, color: 'rgba(0, 0, 0, 0.85)', fontSize: '16px' }}>
              {menuItems.find(item => item.key === selectedKey)?.label || ''}
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-menu">
                <UserOutlined />
                <span style={{ marginLeft: 8 }}>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;