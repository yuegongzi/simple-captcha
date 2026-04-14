
## 1. 项目概述

**pc-captcha-sdk** 是一个基于 React 19 和 TypeScript 编写的验证码前端 SDK，主要用于对接 `go-captcha` 后端服务。

项目经历了从依赖第三方包 (`go-captcha-react`) 到源码内化的重构，去除了对老旧 React 版本的第三方依赖，并对代码结构和样式进行了全盘优化。

## 2. 技术栈

*   **核心框架**: React 19, DOM API (`react-dom`)
*   **开发语言**: TypeScript
*   **样式方案**: 原生 CSS-in-JS / 内联样式 (React.CSSProperties)
*   **构建工具**: Umi/Father (dumi 用于文档展示)
*   **网络请求**: 原生 fetch / Axios 兼容

## 3. 目录与架构规范

项目的 `src` 目录采用了 **“公开 API” 与 “内部引擎” 严格隔离** 的架构。

```text
src/
├── index.tsx                    # 唯一公共导出入口
├── Captcha.tsx                  # 暴露给用户的核心组件
├── Captcha.types.ts             # 公共类型定义
├── Popup.tsx                    # 内部 UI 组件（弹层）
│
├── _internal/                   # 内部核心引擎（对外不可见）
│   ├── click/                   # 点选验证核心逻辑
│   ├── slide/                   # 滑块验证核心逻辑
│   ├── rotate/                  # 旋转验证核心逻辑
│   ├── slide-region/            # 区域滑块验证核心逻辑
│   ├── button/                  # 辅助组件
│   ├── icons/                   # 内置 SVG 图标
│   ├── helpers.ts               # DOM 操作帮助函数
│   └── index.ts                 # 内部模块导出（供 Captcha.tsx 使用）
│
├── hooks/                       # 供用户使用的公共 Hooks
│   ├── use-captcha.tsx          # 命令式调用 Hook
│   └── use-captcha-request.ts   # 请求逻辑 Hook
│
└── utils/                       # 内部公共工具
    ├── index.ts
    └── misc.ts
```

### 架构准则 (Agent 必读)
1. **隔离性原则**: 任何位于 `src/_internal/` 下的组件、Hook 或类型，**绝对禁止**被导出到 `src/index.tsx` 或对外暴露给 SDK 的使用者。它们仅为 `Captcha.tsx` 提供底层支持。
2. **就近原则**: 每个验证模式（如 `click`）在自己的目录下闭环，包含组件 (`Click.tsx`)、类型 (`click.types.ts`) 和逻辑 Hook (`use-click-handler.ts`)。
3. **样式管理**: 不再使用传统 LESS，全面转向轻量级 CSS-in-JS (如内联的 React.CSSProperties)，允许直接由外部配置下发 theme token 实现覆盖。

## 4. 编码规范

### 4.1 React 19 适配规范

在编写或重构组件时，注意以下针对 React 18/19 的现代规范：

*   **导入方式**: 
    *   ❌ 移除 `import * as React from "react"`。
    *   ✅ 使用解构导入 `import { useState, useCallback, memo } from 'react'`。
    *   对于类型，使用 `import type { ReactNode } from 'react'`。
*   **事件处理**: 
    *   处理事件冒泡时，**禁止用**传统的 `e.cancelBubble = true` 结合 `return false`。
    *   ✅ **必须使用**现代 DOM API：`e.stopPropagation()` 和 `e.preventDefault()`。
*   **类型定义**: 为所有的 Props 定义接口，避免使用 `any`，尤其是在 Hooks 中进行事件类型(如 `MouseEvent`, `TouchEvent`) 推导时。

## 5. 开发流程任务池

当您（Agent）接到新需求时，请按顺序思考：
1. 它属于外部 API 变动（`Captcha.tsx` 或 `hooks/`），还是内部核心渲染逻辑变动（`_internal/`）？
2. 如果增加新组件或元素，注意通过内联 CSS-in-JS 处理好 theme token 的对接。
3. `package.json` 中的 `pnpm.onlyBuiltDependencies` 不要随意移除，因为内部组件库的编译依赖 esbuild / swc。

> 注：本地启动开发服务器验证，请使用 `pnpm start` 命令。
