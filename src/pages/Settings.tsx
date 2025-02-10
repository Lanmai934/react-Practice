import React from 'react';
import { Card, Form, Switch, Select, Button, Space, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Settings values:', values);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={12}>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              notifications: true,
              language: 'zh-CN',
              theme: 'light'
            }}
          >
            <Form.Item
              label={t('settings.notification')}
              name="notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={t('settings.language')}
              name="language"
            >
              <Select>
                <Select.Option value="zh-CN">中文</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t('settings.theme')}
              name="theme"
            >
              <Select>
                <Select.Option value="light">{t('settings.theme.light')}</Select.Option>
                <Select.Option value="dark">{t('settings.theme.dark')}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('button.save')}
                </Button>
                <Button>{t('button.cancel')}</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Settings;