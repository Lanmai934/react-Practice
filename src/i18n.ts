import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US";
import zhCN from "./locales/zh-CN";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "en-US": enUS,
      "zh-CN": zhCN,
    },
    fallbackLng: "zh-CN",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
