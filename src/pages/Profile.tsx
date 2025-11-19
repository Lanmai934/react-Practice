import {
  LoadingOutlined,
  LockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Tabs,
  Upload,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  // 头像上传前的校验
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片！");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB！");
      return false;
    }
    return true;
  };

  // 处理头像上传
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      // 这里应该使用后端返回的URL
      setImageUrl(
        info.file.response.url ||
          URL.createObjectURL(info.file.originFileObj as Blob),
      );
      setUploading(false);
    }
  };

  // 密码校验规则
  const passwordRules = {
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: "密码必须包含大小写字母、数字和特殊字符，且长度不少于8位",
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
      if (values.oldPassword === "admin") {
        message.success("密码修改成功");
      } else {
        message.error("原密码错误");
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
      message.success("个人信息修改成功");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values: any) => {
    console.log("Profile values:", values);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={16}>
        <Card>
          <Tabs defaultActiveKey="basic">
            <TabPane tab={t("profile.basic")} key="basic">
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar size={80} src={imageUrl} icon={<UserOutlined />} />
                <Upload
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  style={{ marginTop: 16, display: "block" }}
                  onChange={handleChange}
                >
                  <Button icon={<UploadOutlined />}>
                    {uploading
                      ? t("profile.uploading")
                      : t("profile.changeAvatar")}
                  </Button>
                </Upload>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  name: "Admin",
                  email: "admin@example.com",
                  phone: "1234567890",
                }}
              >
                <Form.Item
                  label={t("user.name")}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: t("validation.required", {
                        field: t("user.name"),
                      }),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={t("user.email")}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t("validation.required", {
                        field: t("user.email"),
                      }),
                    },
                    { type: "email", message: t("validation.email") },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={t("user.phone")}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: t("validation.required", {
                        field: t("user.phone"),
                      }),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {t("button.save")}
                    </Button>
                    <Button>{t("button.cancel")}</Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab={t("profile.security")} key="security">
              {/* Security settings content */}
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
