import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // 根据路径生成面包屑
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    return pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        key: url,
        title: t(`menu.${pathSnippets[index]}`)
      };
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={getBreadcrumbItems()} />
        <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default BasicLayout; 