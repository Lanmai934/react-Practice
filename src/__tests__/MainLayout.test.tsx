import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import MainLayout from '../layouts/MainLayout';

// Mock window resize
const resizeWindow = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

// Mock components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/dashboard' }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>
}));

describe('MainLayout', () => {
  beforeEach(() => {
    // Reset window size before each test
    resizeWindow(1024);
  });

  const renderMainLayout = () => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <MainLayout />
        </I18nextProvider>
      </BrowserRouter>
    );
  };

  test('renders sidebar with menu items', () => {
    renderMainLayout();
    expect(screen.getByText('React Admin')).toBeInTheDocument();
    expect(screen.getByText('仪表盘')).toBeInTheDocument();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
    expect(screen.getByText('数据报表')).toBeInTheDocument();
    expect(screen.getByText('系统设置')).toBeInTheDocument();
  });

  test('collapses sidebar when toggle button is clicked', () => {
    renderMainLayout();
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(screen.getByText('RA')).toBeInTheDocument();
  });

  test('automatically collapses on mobile view', () => {
    renderMainLayout();
    resizeWindow(375); // Mobile width
    expect(screen.queryByText('React Admin')).not.toBeInTheDocument();
  });

  test('shows user dropdown menu when clicked', () => {
    renderMainLayout();
    const userMenu = screen.getByText('Admin');
    fireEvent.click(userMenu);
    expect(screen.getByText('个人中心')).toBeInTheDocument();
    expect(screen.getByText('退出登录')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    renderMainLayout();
    const userMenu = screen.getByText('Admin');
    fireEvent.click(userMenu);
    const logoutButton = screen.getByText('退出登录');
    fireEvent.click(logoutButton);
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });

  test('navigates to correct route when menu item is clicked', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    
    renderMainLayout();
    const userManagement = screen.getByText('用户管理');
    fireEvent.click(userManagement);
    expect(navigate).toHaveBeenCalledWith('/user');
  });

  test('handles window resize correctly', () => {
    renderMainLayout();
    
    // Desktop view
    resizeWindow(1024);
    expect(screen.getByText('React Admin')).toBeInTheDocument();
    
    // Tablet view
    resizeWindow(768);
    expect(screen.queryByText('React Admin')).not.toBeInTheDocument();
    
    // Mobile view
    resizeWindow(375);
    expect(screen.queryByText('React Admin')).not.toBeInTheDocument();
  });

  test('menu items are visible after expanding collapsed sidebar', () => {
    renderMainLayout();
    const toggleButton = screen.getByRole('button');
    
    // Collapse sidebar
    fireEvent.click(toggleButton);
    expect(screen.queryByText('React Admin')).not.toBeInTheDocument();
    
    // Expand sidebar
    fireEvent.click(toggleButton);
    expect(screen.getByText('React Admin')).toBeInTheDocument();
    expect(screen.getByText('仪表盘')).toBeInTheDocument();
  });

  test('sidebar transition styles are applied', () => {
    renderMainLayout();
    const sider = document.querySelector('.ant-layout-sider');
    expect(sider).toHaveStyle('transition: all 0.2s');
  });

  test('content margin adjusts with sidebar state', () => {
    renderMainLayout();
    const content = screen.getByTestId('outlet').parentElement;
    
    // Initial state (expanded)
    expect(content?.parentElement).toHaveStyle('margin-left: 200px');
    
    // Collapsed state
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(content?.parentElement).toHaveStyle('margin-left: 80px');
  });
}); 