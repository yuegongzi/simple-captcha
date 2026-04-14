# 部署说明

## 🎯 部署策略

本项目采用**环境分离**的部署策略：

- **开发环境** - 使用 `.env` 文件配置，方便调试
- **生产环境** - 使用 Docker 容器化部署

## 🛠️ 开发环境

### 快速开始

```bash
# 1. 启动开发环境（自动创建配置文件）
./run-dev.sh
```

### 手动配置

```bash
# 1. 复制开发环境配置模板
cp env.dev .env

# 2. 根据需要修改配置（主要是Redis连接信息）
vim .env

# 3. 启动本地Redis（如果使用本地Redis）
redis-server

# 4. 运行项目
go run main.go
# 或
go build -o simple-captcha . && ./simple-captcha
```

### 开发环境配置说明

开发环境使用宽松的配置，便于调试：

- `GIN_MODE=debug` - 详细的调试信息
- `LOG_LEVEL=debug` - 详细日志
- `LOG_FORMAT=text` - 易读的文本格式日志
- `ENABLE_RATE_LIMIT=false` - 关闭限流便于测试
- `CAPTCHA_EXPIRE_TIME=10m` - 更长的过期时间

## 🐳 生产环境

### 部署步骤

```bash
# 1. 编辑 Docker Compose 配置
vim docker-compose.yml

# 2. 修改 Redis 连接信息（只需要修改这4行）
- REDIS_HOST=your-production-redis-host.com
- REDIS_PORT=6379
- REDIS_PASSWORD=your-redis-password
- REDIS_DB=0

# 3. 构建并启动
docker-compose up -d --build
```

### 验证部署

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f simple-captcha

# 健康检查
curl http://localhost:8080/health

# 测试验证码接口
curl "http://localhost:8080/cgi/captcha/click-text?mode=light"
```

### 生产环境管理

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新服务
git pull
docker-compose up -d --build

# 查看指标
curl http://localhost:8080/metrics

# 查看统计信息
curl http://localhost:8080/stats
```

## ⚙️ 配置说明

### 必须配置的环境变量

| 变量名           | 开发环境默认值 | 生产环境 | 说明             |
| ---------------- | -------------- | -------- | ---------------- |
| `REDIS_HOST`     | `localhost`    | 需要配置 | Redis 主机地址   |
| `REDIS_PORT`     | `6379`         | `6379`   | Redis 端口       |
| `REDIS_PASSWORD` | 空             | 需要配置 | Redis 密码       |
| `REDIS_DB`       | `1`            | `0`      | Redis 数据库编号 |

### 环境差异配置

| 配置项                | 开发环境 | 生产环境  | 说明             |
| --------------------- | -------- | --------- | ---------------- |
| `GIN_MODE`            | `debug`  | `release` | Gin 运行模式     |
| `LOG_LEVEL`           | `debug`  | `info`    | 日志级别         |
| `LOG_FORMAT`          | `text`   | `json`    | 日志格式         |
| `ENABLE_RATE_LIMIT`   | `false`  | `true`    | 是否启用限流     |
| `CAPTCHA_EXPIRE_TIME` | `10m`    | `5m`      | 验证码过期时间   |
| `REDIS_POOL_SIZE`     | `5`      | `20`      | Redis 连接池大小 |

## 🔒 安全配置

### 生产环境安全检查清单

- [ ] 使用强密码的 Redis 密码
- [ ] 启用速率限制 (`ENABLE_RATE_LIMIT=true`)
- [ ] 配置可信代理 (`TRUSTED_PROXIES`)
- [ ] 使用生产模式 (`GIN_MODE=release`)
- [ ] 设置合理的资源限制

### 敏感信息管理

- **开发环境** - 敏感信息可以放在 `.env` 文件中（已在 `.gitignore` 中忽略）
- **生产环境** - 敏感信息直接配置在 `docker-compose.yml` 中，或使用 Docker Secrets

## 🚨 故障排除

### 开发环境常见问题

**Redis 连接失败**

```bash
# 检查 Redis 是否运行
redis-cli ping

# 启动 Redis
redis-server

# 或修改 .env 文件中的 REDIS_HOST
```

**端口被占用**

```bash
# 查看端口占用
lsof -i :8080

# 修改 .env 文件中的 PORT 配置
```

### 生产环境常见问题

**容器启动失败**

```bash
# 查看详细日志
docker-compose logs simple-captcha

# 检查配置是否正确
docker-compose config
```

**Redis 连接问题**

```bash
# 检查网络连接
docker-compose exec simple-captcha ping redis-host

# 验证 Redis 认证
redis-cli -h your-redis-host -a your-password ping
```

## 📊 监控和维护

### 健康检查

```bash
# 基础健康检查
curl http://localhost:8080/health

# 详细指标数据
curl http://localhost:8080/metrics

# 服务统计信息
curl http://localhost:8080/stats
```

### 日志管理

```bash
# 开发环境 - 查看实时日志
tail -f logs/app.log

# 生产环境 - 查看容器日志
docker-compose logs -f simple-captcha
```

## 🎉 总结

这种部署策略的优势：

1. **开发友好** - 使用 `.env` 文件，配置灵活，调试方便
2. **生产简单** - Docker 容器化，配置固化，部署可靠
3. **环境隔离** - 开发和生产环境完全分离，避免配置混乱
4. **维护简单** - 每个环境都有最适合的配置和工具
