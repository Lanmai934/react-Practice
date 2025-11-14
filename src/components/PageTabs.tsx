import React, { useEffect, useState } from 'react';
import { Tabs, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

type TabItem = { key: string; label: string; closable: boolean };

const normalizePath = (p: string) => (p === '/' ? '/dashboard' : p);

const PageTabs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const [tabs, setTabs] = useState<TabItem[]>([
    { key: '/dashboard', label: t('menu.dashboard'), closable: false },
  ]);
  const [activeKey, setActiveKey] = useState<string>(normalizePath(location.pathname));

  const getLabelByPath = (path: string) => {
    const seg = path.replace(/^\/+/, '').split('/')[0] || 'dashboard';
    const defaultLabel = seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : 'Dashboard';
    return t(`menu.${seg}` as any, { defaultValue: defaultLabel });
  };

  // 语言变化时，更新标签文案
  useEffect(() => {
    setTabs(prev => prev.map(tab => ({ ...tab, label: getLabelByPath(tab.key) })));
  }, [i18n.language]);

  // 路由变化时，追加/激活标签
  useEffect(() => {
    const current = normalizePath(location.pathname);
    setActiveKey(current);
    setTabs(prev => {
      if (prev.find(p => p.key === current)) return prev;
      const closable = current !== '/dashboard';
      return [...prev, { key: current, label: getLabelByPath(current), closable }];
    });
  }, [location.pathname]);

  const onTabChange = (key: string) => {
    setActiveKey(key);
    navigate(key);
  };

  const removeTab = (targetKey: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(p => p.key === targetKey);
      if (idx === -1) return prev;
      const newTabs = prev.filter(p => p.key !== targetKey);
      if (activeKey === targetKey) {
        const next = newTabs[idx - 1] || newTabs[0] || { key: '/dashboard' };
        setActiveKey(next.key);
        navigate(next.key);
      }
      return newTabs.length ? newTabs : [{ key: '/dashboard', label: t('menu.dashboard'), closable: false }];
    });
  };

  const onTabEdit = (
    targetKey: string | React.MouseEvent | React.KeyboardEvent,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      if (targetKey === '/dashboard') return;
      removeTab(targetKey);
    }
  };

  return (
    <div
      style={{
        margin: 0,
        background: 'transparent',
        padding: '0 8px',
        overflowX: 'hidden',
      }}
    >
      <Tabs
        type="editable-card"
        hideAdd
        items={tabs.map(tab => ({ key: tab.key, label: tab.label, closable: tab.closable }))}
        activeKey={activeKey}
        onChange={onTabChange}
        onEdit={onTabEdit}
        tabBarStyle={{ margin: 0 }}
      />
    </div>
  );
};

export default PageTabs;