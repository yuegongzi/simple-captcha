#!/bin/bash

# 设置错误时退出
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_message() {
    echo -e "${2}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 检查参数
if [ $# -eq 0 ]; then
    print_message "使用方法: $0 <version> [registry]" $RED
    print_message "示例: $0 v1.0.0" $YELLOW
    print_message "示例: $0 v1.0.0 registry.cn-shenzhen.aliyuncs.com/olympians" $YELLOW
    exit 1
fi

VERSION=$1
REGISTRY=${2:-"registry.cn-shenzhen.aliyuncs.com/olympians"}
IMAGE_NAME="simple-captcha"
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"

print_message "开始构建 ${IMAGE_NAME}:${VERSION}" $BLUE

# 1. 清理旧的构建产物
print_message "清理旧的构建产物..." $YELLOW
docker system prune -f --filter "label=project=simple-captcha" 2>/dev/null || true

# 2. 构建镜像
print_message "构建 Docker 镜像..." $YELLOW
docker build -f Dockerfile -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

# 3. 标记镜像
print_message "标记镜像..." $YELLOW
docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE_NAME}:${VERSION}
docker tag ${IMAGE_NAME}:latest ${FULL_IMAGE_NAME}:latest

# 4. 显示镜像信息
print_message "镜像构建完成！" $GREEN
docker images | grep ${IMAGE_NAME}

# 5. 运行安全扫描（如果有 trivy）
if command -v trivy &> /dev/null; then
    print_message "运行安全扫描..." $YELLOW
    trivy image --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${VERSION}
fi

# 6. 询问是否推送
read -p "是否推送镜像到仓库? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "推送镜像到仓库..." $YELLOW
    docker push ${FULL_IMAGE_NAME}:${VERSION}
    docker push ${FULL_IMAGE_NAME}:latest
    print_message "镜像推送完成！" $GREEN
    print_message "镜像地址: ${FULL_IMAGE_NAME}:${VERSION}" $BLUE
else
    print_message "跳过推送步骤" $YELLOW
fi

# 7. 显示运行命令
print_message "本地运行命令:" $BLUE
echo "docker run -d -p 8080:8080 --name simple-captcha ${IMAGE_NAME}:${VERSION}"
echo ""
print_message "使用 docker-compose 运行:" $BLUE
echo "docker-compose up -d"

print_message "构建流程完成！" $GREEN