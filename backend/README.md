# Simple Captcha

一个基于 Go 语言和 Gin 框架的高性能验证码服务，支持多种验证码类型。

## ✨ 特性

- 🎯 **多种验证码类型** - 点击文字、点击形状、旋转、滑动等
- 🚀 **高性能** - 基于 Go 语言，支持高并发
- 🔒 **安全可靠** - 内置风险控制和速率限制
- 📊 **监控完善** - 健康检查、指标收集、日志记录
- 🐳 **容器化** - 支持 Docker 部署
- ⚙️ **配置灵活** - 环境变量配置，开箱即用

## 🚀 快速开始

### 开发环境

```bash
# 1. 克隆项目
git clone <repository-url>
cd simple-captcha

# 2. 启动开发环境
./run-dev.sh
```

### 生产环境

```bash
# 1. 编辑 Docker 配置
vim docker-compose.yml

# 2. 修改 Redis 连接信息
- REDIS_HOST=your-redis-host.com
- REDIS_PASSWORD=your-redis-password

# 3. 部署
docker-compose up -d --build
```

## 📋 API 接口

### 生成验证码

```bash
GET /cgi/captcha/{type}?mode={mode}
```

### 验证验证码

```bash
POST /cgi/captcha/{type}/{key}
```

### 查询验证状态

```bash
GET /cgi/captcha/second/{key}/state
```

### 监控接口

```bash
GET /health    # 健康检查
GET /metrics   # 指标数据
GET /stats     # 统计信息
```

## 🛠️ 支持的验证码类型

- `click-text` - 点击文字验证码
- `click-shape` - 点击形状验证码（开发中）
- `rotate` - 旋转验证码（开发中）
- `slide-text` - 滑动文字验证码（开发中）
- `slide-region` - 滑动区域验证码（开发中）

## ⚙️ 配置说明

### 必须配置

- `REDIS_HOST` - Redis 主机地址
- `REDIS_PORT` - Redis 端口
- `REDIS_PASSWORD` - Redis 密码
- `REDIS_DB` - Redis 数据库编号

### 可选配置

所有其他配置都有合理的默认值，详见 [部署文档](DEPLOYMENT.md)。

## 📚 文档

- [部署文档](DEPLOYMENT.md) - 详细的部署和配置说明
- [API 文档](docs/api.md) - API 接口详细说明（如果有）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)
