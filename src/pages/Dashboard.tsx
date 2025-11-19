import {
  LineChartOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import * as echarts from "echarts";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // 用户增长趋势图表
    const userChart = echarts.init(document.getElementById("userGrowthChart"));
    userChart.setOption({
      tooltip: {
        trigger: "axis",
      },
      grid: {
        top: 10,
        right: 30,
        bottom: 20,
        left: 30,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147],
          type: "line",
          smooth: true,
          areaStyle: {},
        },
      ],
    });

    // 访问量统计图表
    const visitChart = echarts.init(document.getElementById("visitChart"));
    visitChart.setOption({
      tooltip: {
        trigger: "axis",
      },
      grid: {
        top: 10,
        right: 30,
        bottom: 20,
        left: 30,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "bar",
        },
      ],
    });

    // 清理函数
    return () => {
      userChart.dispose();
      visitChart.dispose();
    };
  }, []);

  const stats = [
    {
      title: t("dashboard.totalUsers"),
      value: 112893,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: t("dashboard.activeUsers"),
      value: 11234,
      icon: <TeamOutlined />,
      color: "#52c41a",
    },
    {
      title: t("dashboard.todayVisits"),
      value: 1234,
      icon: <LineChartOutlined />,
      color: "#faad14",
    },
    {
      title: t("dashboard.totalOrders"),
      value: 9234,
      icon: <ShoppingCartOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card bodyStyle={{ padding: "20px 24px" }}>
              <Statistic
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        backgroundColor: stat.color + "15",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "inline-flex",
                      }}
                    >
                      {React.cloneElement(stat.icon as React.ReactElement, {
                        style: { fontSize: "20px", color: stat.color },
                      })}
                    </span>
                    <span>{stat.title}</span>
                  </div>
                }
                value={stat.value}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24} md={12}>
          <Card>
            <div id="userGrowthChart" style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card>
            <div id="visitChart" style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
