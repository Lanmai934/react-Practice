import React from 'react';
import { Form, Input, Button, Card, Switch } from 'antd';

const Settings: React.FC = () => {
  return (
    <Card title="系统设置">
      <Form layout="vertical">
        <Form.Item label="系统名称" name="siteName">
          <Input placeholder="请输入系统名称" />
        </Form.Item>
        <Form.Item label="系统描述" name="description">
          <Input.TextArea placeholder="请输入系统描述" />
        </Form.Item>
        <Form.Item label="维护模式" name="maintenance" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary">保存设置</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;