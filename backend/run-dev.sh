#!/bin/bash

# 开发环境运行脚本

echo "🚀 启动开发环境..."

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建开发环境配置文件..."
    cp env.dev .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
fi

# 检查 Redis 连接
echo "🔍 检查 Redis 连接..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "⚠️  警告: 无法连接到 Redis，请确保 Redis 服务正在运行"
    echo "   启动 Redis: redis-server"
    echo "   或修改 .env 文件中的 REDIS_HOST 配置"
fi

# 编译并运行
echo "🔨 编译项目..."
go build -o simple-captcha .

if [ $? -eq 0 ]; then
    echo "✅ 编译成功"
    echo "🌟 启动服务..."
    ./simple-captcha
else
    echo "❌ 编译失败"
    exit 1
fi