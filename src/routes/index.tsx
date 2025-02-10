import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Reports from '../pages/Reports';
import PrivateRoute from '../components/PrivateRoute';
import BasicLayout from '../layouts/BasicLayout';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: (
          <BasicLayout>
            <Dashboard />
          </BasicLayout>
        )
      },
      {
        path: 'dashboard',
        element: (
          <BasicLayout>
            <Dashboard />
          </BasicLayout>
        )
      },
      {
        path: 'user',
        element: (
          <BasicLayout>
            <UserManagement />
          </BasicLayout>
        )
      },
      {
        path: 'reports',
        element: (
          <BasicLayout>
            <Reports />
          </BasicLayout>
        )
      },
      {
        path: 'settings',
        element: (
          <BasicLayout>
            <Settings />
          </BasicLayout>
        )
      },
      {
        path: 'profile',
        element: (
          <BasicLayout>
            <Profile />
          </BasicLayout>
        )
      }
    ]
  }
]);