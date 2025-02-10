# React + TypeScript + Vite

这个模板提供了一个最小化的设置，用于在 Vite 中运行 React，包含了热模块替换（HMR）功能和一些 ESLint 规则。

目前有两个官方插件可用：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) 使用 [Babel](https://babeljs.io/) 实现快速刷新
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) 使用 [SWC](https://swc.rs/) 实现快速刷新

## 扩展 ESLint 配置

如果您正在开发生产环境的应用，我们建议更新配置以启用类型感知的 lint 规则：

- 像这样配置顶层的 `parserOptions` 属性：

```js
export default tseslint.config({
  languageOptions: {
    // 其他选项...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- 将 `tseslint.configs.recommended` 替换为 `tseslint.configs.recommendedTypeChecked` 或 `tseslint.configs.strictTypeChecked`
- 可选择添加 `...tseslint.configs.stylisticTypeChecked`
- 安装 [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) 并更新配置：

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // 设置 react 版本
  settings: { react: { version: '18.3' } },
  plugins: {
    // 添加 react 插件
    react,
  },
  rules: {
    // 其他规则...
    // 启用推荐的规则
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
