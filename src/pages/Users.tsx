import React from 'react';
import { Table, Card, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';

interface UserType {
  key: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Users: React.FC = () => {
  // 示例数据
  const data: UserType[] = [
    {
      key: '1',
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: '正常',
    },
    {
      key: '2',
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: '用户',
      status: '正常',
    },
  ];

  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    message.info('点击了添加用户');
    // 这里添加新增用户的逻辑
  };

  const handleEdit = (record: UserType) => {
    message.info(`编辑用户: ${record.name}`);
    // 这里添加编辑用户的逻辑
  };

  const handleDelete = (record: UserType) => {
    message.info(`删除用户: ${record.name}`);
    // 这里添加删除用户的逻辑
  };

  return (
    <Card
      title="用户管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增用户
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  );
};

export default Users;
