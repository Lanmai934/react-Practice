import React from 'react';
import { Table, Button, Space, Card, Input, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { components } from '../api/types';
type User = components['schemas']['User'];

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = React.useState<User[]>([
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
  ]);
  const [loading] = React.useState(false);

  const handleDelete = (record: User) => {
    // Implement the delete logic here
  };

  const columns = [
    {
      title: t('user.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('user.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('user.status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="link">{t('button.edit')}</Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            {t('button.delete')}
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
            placeholder={t('button.search')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            {t('user.add')}
          </Button>
        </Col>
      </Row>
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{
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