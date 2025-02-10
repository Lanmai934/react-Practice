import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { router } from './routes';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  const getAntdLocale = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  };

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;