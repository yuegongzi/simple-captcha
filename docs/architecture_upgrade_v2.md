# Simple-Captcha V2 架构升级与重构方案

## 1. 升级背景与痛点分析

在最初的项目结构中，行为验证码服务作为一个附加模块运行，其设计具有较深的历史局限性和业务耦合。随着 `simple-captcha` 逐渐向一个通用化、抽象化、独立部署的验证码基础设施（Monorepo 架构）演进，原有的代码暴露出以下核心痛点：

1. **废弃的非标准 API 响应**
   * **现状**：无论后端处理成功还是报错，通常都返回 `HTTP 200`，并在 Body 中包裹自定义结构（如 `{ "errcode": 0, "errmsg": "ok", "success": true, "data": {...} }`）。
   * **痛点**：这增加了前端集成的成本，前端必须读取解析响应体才能知道真正的业务状态，无法利用现代前端请求库（如 axios）基于 HTTP 状态码触发统一的拦截和错误捕获。

2. **前端 SDK 的硬编码束缚**
   * **现状**：前端 SDK (`pc-captcha-sdk`) 硬编码了请求路径缀，例如强制向 `/cgi/captcha/...` 发出请求。
   * **痛点**：这剥夺了业务系统在网关层的路由转发自由度。业务接入方不得不受限于这个死板的路径规范进行 Nginx 代理配置。

3. **CORS 跨域部署屏障**
   * **现状**：验证码常常以“独立验证码中心” (`captcha.company.com`) 的形式存在，被公司内部多个域名的前端 (`a.company.com`, `b.company.com`) 跨域调用。由于缺乏灵活的 CORS 解决方案，跨域直连报错频发。
   * **痛点**：降低了验证码平台在内网多业务系统的快速部署和复用能力。

4. **S2S (Server-to-Server) 缺乏防御与鉴权**
   * **现状**：二次校验（业务服务端拿着 `secondKey` 去验证码服务端确认是否人机通过）路由仅仅做简单的缓存状态匹配，对外裸奔。
   * **痛点**：如果恶意攻击者探测到了校验路径与参数格式，能够直接模拟业务服务器套取验证码通过状态，存在被刷的风险。

---

## 2. 总体设计方案 (V2 架构)

为了将其打造为企业级、安全的验证码底座组件，本次破坏性重构遵循以下四大设计方向：

### 2.1 纯净 RESTful API 演进
全面废弃“全局 200 + 业务状态码”的旧俗，拥抱 RESTful 设计规范：
- **状态码表达语义**：以确切的 HTTP 状态码表示请求结果（如：200 成功；400 校验未通过；429 被限流；500 内部服务异常）。
- **Data Payload 扁平化**：如果是成功的请求，直出渲染必须的核心数据本身，拔除外部包裹对象；错误时只返回标准的错误信息块。
- **重定义路由规范**：
  - 生成阶段：`GET /api/v1/captchas/{type}`
  - 交互验证：`POST /api/v1/captchas/{key}/verify`
  - 二次认证：`POST /api/v1/captchas/{key}/validate`

### 2.2 前端 SDK 路由配置反转 (Inversion of Control)
取消一切内嵌在 `use-captcha-request.ts` 中的固化路径：
- 提供在 SDK `<ConfigProvider>` 或者实例化阶段的完整自定义权。
- 允许开发者传入自定义的完整 URL 模板或直接注入全量覆盖的 fetcher 函数，例如 `api.getCaptchaData(type)`，使得 SDK 纯粹化为“无状态的渲染宿主”。

### 2.3 CORS 跨域策略重制
建立系统级的 CORS 信任体系：
- 引入专业的跨域处理中间件。
- **轻量级管控**：允许灵活配置 Origin 列表策略，当环境为开发或全放通模式时，根据请求实时的 `Origin` 请求头做动态放行（即动态回应 `Access-Control-Allow-Origin: <Origin>`）。从而在避免写死 `*` 带来安全隐患的同时，无缝兼容多业务系统的跨域前端调用。

### 2.4 基于 API Key 的 Server-to-Server 鉴权
建立验证服务的壁垒，确保只有权威的后端业务调用能通行二次校验：
- **配置文件注入**：在验证码后端的环境配置或 `config.yml` 中新增 `API_KEY`（等同于 AppSecret）。
- **硬性拦截**：所有指向 `/api/v1/captchas/{key}/validate` 的二次认证请求，必须在请求头（`Authorization: Bearer <API_KEY>` 或 `X-Api-Key`）中合法出示凭证。
- **效果**：完成鉴权闭环，即使攻击者截获了前台通过的点选验证 `secondKey`，只要业务后端的私有 API Key 没泄露，攻击依然无效。

---

## 3. 升级实施拆解计划

为了保证能够平稳过渡执行，整个重构将依据依赖链路先后执行：

- [ ] **Phase 1: Backend 接口和核心结构改造 (Go)**
  - 调整 Gin `routes/router.go` 以符合新的 `/api/v1/...` 规范。
  - 删除 `helper/response.go` 中非标包装响应，改为标准 JSON 响应输出。
  - 增加并装配 `CORS Middleware` 实现跨域。
  - 增加 API_KEY 鉴权机制并在全局配置模型 `Config` 中加入此声明。
  
- [ ] **Phase 2: SDK 请求模块和通信适配 (React)**
  - 重写 `sdk/src/hooks/use-captcha-request.ts` 移除路径拼接。
  - 修改 `ConfigProvider.types.ts` 新增对 RESTful API 路径配置的拓展项支持。
  - 适配前端新的标准 HTTP Code 异常捕获策略（抛出 `message` 并终端交互等）。

- [ ] **Phase 3: 文档更新与回归**
  - 使用 dumi 重新编写文档中的接入示例代码。
  - 同步调整 `AGENTS.md` 对相关 REST 流程进行存档约束。
