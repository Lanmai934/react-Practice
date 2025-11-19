import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import BasicLayout from "../layouts/BasicLayout";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import FormRenderer from "../pages/FormRenderer";
import Graph from "../pages/Graph";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import UserManagement from "../pages/UserManagement";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <BasicLayout>
            <Dashboard />
          </BasicLayout>
        ),
      },
      {
        path: "dashboard",
        element: (
          <BasicLayout>
            <Dashboard />
          </BasicLayout>
        ),
      },
      {
        path: "user",
        element: (
          <BasicLayout>
            <UserManagement />
          </BasicLayout>
        ),
      },
      {
        path: "reports",
        element: (
          <BasicLayout>
            <Reports />
          </BasicLayout>
        ),
      },
      {
        path: "settings",
        element: (
          <BasicLayout>
            <Settings />
          </BasicLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <BasicLayout>
            <Profile />
          </BasicLayout>
        ),
      },
      {
        path: "Graph",
        element: (
          <BasicLayout>
            <Graph />
          </BasicLayout>
        ),
      },
      {
        path: "FormRenderer",
        element: (
          <BasicLayout>
            <FormRenderer />
          </BasicLayout>
        ),
      },
    ],
  },
]);
