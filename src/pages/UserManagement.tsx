import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Table } from "antd";
import type React from "react";
import { useTranslation } from "react-i18next";

interface User {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();

  // 示例数据
  const users: User[] = [
    {
      key: "1",
      name: "John Brown",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-03-20 10:00:00",
    },
    {
      key: "2",
      name: "Jim Green",
      email: "jim@example.com",
      role: "User",
      status: "Active",
      lastLogin: "2024-03-19 15:30:00",
    },
    {
      key: "3",
      name: "Joe Black",
      email: "joe@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2024-03-18 09:45:00",
    },
  ];

  const handleDelete = (record: User) => {
    // Implement the delete logic here
  };

  const columns = [
    {
      title: t("user.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("user.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("user.role"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("user.status"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t("user.lastLogin"),
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: t("common.action"),
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="link">{t("button.edit")}</Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            {t("button.delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="1">
          <Input
            placeholder={t("button.search")}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            {t("user.add")}
          </Button>
        </Col>
      </Row>
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
