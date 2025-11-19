import { Breadcrumb, Layout } from "antd";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // 根据路径生成面包屑
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    return pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        key: url,
        title: t(`menu.${pathSnippets[index]}`),
      };
    });
  };

  return (
    <Layout>
      <Content
        style={{ padding: "0 20px", background: "#fff", overflow: "hidden" }}
      >
        <div style={{ padding: 24, height: 820, background: "#fff" }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default BasicLayout;
