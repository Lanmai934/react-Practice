import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';

const { Option } = Select;

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      <Option value="zh-CN">中文</Option>
      <Option value="en-US">English</Option>
    </Select>
  );
};

export default LanguageSwitch; 