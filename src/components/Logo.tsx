import React from 'react';
import { theme } from 'antd';

interface LogoProps {
  collapsed: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  const { token } = theme.useToken();

  return (
    <div style={{
      height: 64,
      padding: '16px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    }}>
      <div style={{
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorPrimary,
        fontSize: collapsed ? 20 : 22,
        fontWeight: 'bold',
        letterSpacing: collapsed ? 0 : 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}>
        {collapsed ? 'R' : 'React Admin'}
      </div>
    </div>
  );
};

export default Logo; 