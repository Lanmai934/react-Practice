import { Card, Col, DatePicker, Radio, Row, Space } from "antd";
import * as echarts from "echarts";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // 用户增长趋势图表
    const userChart = echarts.init(document.getElementById("userGrowthChart"));
    userChart.setOption({
      title: {
        text: t("reports.userGrowth"),
      },
      tooltip: {
        trigger: "axis",
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
        },
      ],
    });

    // 访问量统计图表
    const visitChart = echarts.init(document.getElementById("visitChart"));
    visitChart.setOption({
      title: {
        text: t("reports.visitStats"),
      },
      tooltip: {
        trigger: "axis",
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
  }, [t]);

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="1">
          <Space>
            <Radio.Group defaultValue="week">
              <Radio.Button value="day">{t("reports.today")}</Radio.Button>
              <Radio.Button value="week">{t("reports.week")}</Radio.Button>
              <Radio.Button value="month">{t("reports.month")}</Radio.Button>
            </Radio.Group>
            <RangePicker />
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24} lg={12}>
          <Card>
            <div id="userGrowthChart" style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card>
            <div id="visitChart" style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
