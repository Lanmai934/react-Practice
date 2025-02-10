import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Upload, Avatar } from 'antd';
import { UserOutlined, LockOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  // 头像上传前的校验
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }
    return true;
  };

  // 处理头像上传
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 这里应该使用后端返回的URL
      setImageUrl(info.file.response.url || URL.createObjectURL(info.file.originFileObj as Blob));
      setUploading(false);
    }
  };

  // 密码校验规则
  const passwordRules = {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: '密码必须包含大小写字母、数字和特殊字符，且长度不少于8位'
  };

  // 修改密码
  const handlePasswordChange = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      // 这里添加修改密码的API调用
      if (values.oldPassword === 'admin') {
        message.success('密码修改成功');
      } else {
        message.error('原密码错误');
      }
    } finally {
      setLoading(false);
    }
  };

  // 修改个人信息
  const handleProfileChange = async (values: {
    username: string;
    email: string;
    phone: string;
  }) => {
    setLoading(true);
    try {
      // 这里添加修改个人信息的API调用
      message.success('个人信息修改成功');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="个人设置">
      <Tabs defaultActiveKey="profile">
        <TabPane tab="基本信息" key="profile">
          <Form
            name="profile"
            onFinish={handleProfileChange}
            layout="vertical"
            initialValues={{
              username: '管理员',
              email: 'admin@example.com',
              phone: '13800138000',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={100}
                src={imageUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 12 }}
              />
              <div>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/api/upload" // 替换为实际的上传接口
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}>
                    {uploading ? '上传中' : '更换头像'}
                  </Button>
                </Upload>
                <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
                  支持 JPG、PNG 格式，文件小于 2MB
                </div>
              </div>
            </div>

            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                placeholder="请输入邮箱"
              />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input 
                placeholder="请输入手机号"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="修改密码" key="password">
          <Form
            name="passwordChange"
            onFinish={handlePasswordChange}
            layout="vertical"
          >
            <Form.Item
              label="原密码"
              name="oldPassword"
              rules={[{ required: true, message: '请输入原密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请输入原密码"
              />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                passwordRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value === getFieldValue('oldPassword')) {
                      return Promise.reject(new Error('新密码不能与原密码相同'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              extra={
                <ul style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12, marginTop: 4 }}>
                  <li>密码长度不少于8位</li>
                  <li>必须包含大写字母、小写字母、数字和特殊字符</li>
                  <li>不能与原密码相同</li>
                </ul>
              }
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
              />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请确认新密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Profile; 