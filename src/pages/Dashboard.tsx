import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // 示例数据
  const recentOrders = [
    {
      key: '1',
      orderNo: 'ORD001',
      customer: '张三',
      amount: '¥1,200',
      status: '已完成',
    },
    {
      key: '2',
      orderNo: 'ORD002',
      customer: '李四',
      amount: '¥800',
      status: '处理中',
    },
    {
      key: '3',
      orderNo: 'ORD003',
      customer: '王五',
      amount: '¥2,400',
      status: '已完成',
    },
  ];

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="总用户数" value={1128} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="订单总数"
              value={93}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="文章数量"
              value={26}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="总收入"
              value={28960}
              prefix={<DollarOutlined style={{ color: '#ff4d4f' }} />}
              precision={2}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="最近订单" extra={<a href="#">查看全部</a>}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="待办事项">
            <ul style={{ paddingLeft: '20px' }}>
              <li>审核新用户注册申请 (12)</li>
              <li>处理退款请求 (3)</li>
              <li>回复用户反馈 (8)</li>
              <li>系统更新维护</li>
            </ul>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统公告">
            <ul style={{ paddingLeft: '20px' }}>
              <li>系统将于本周日凌晨2点进行例行维护</li>
              <li>新版本功能更新说明</li>
              <li>重要：安全更新提醒</li>
              <li>五一假期值班安排</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Card>
            {/* echarts 图表组件 */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;