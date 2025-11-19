import { Button } from "antd";
import type React from "react";
import { useTranslation } from "react-i18next";

const Example: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <Button type="primary">{t("button.submit")}</Button>
    </div>
  );
};

export default Example;
