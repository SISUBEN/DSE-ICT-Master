#!/bin/bash

set -e

echo "======================================="
echo "     Docker 一键安装脚本 (Linux)        "
echo "======================================="

# 检查 root 权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请用 root 权限运行: sudo ./install-docker.sh"
    exit 1
fi

# 检测系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo "无法检测系统版本，安装失败"
    exit 1
fi

echo "检测到系统: $OS $VER"


# 安装 Docker
case "$OS" in
#########################################################
#              Ubuntu / Debian 系
#########################################################
ubuntu|debian)
    echo "➡️ 更新 APT..."
    apt-get update

    echo "➡️ 安装依赖..."
    apt-get install -y ca-certificates curl gnupg lsb-release

    echo "➡️ 添加 Docker GPG 密钥..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    chmod a+r /etc/apt/keyrings/docker.gpg

    echo "➡️ 添加 Docker 官方软件源..."
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/$OS \
      $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list

    echo "➡️ 安装 Docker..."
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ;;
#########################################################
#              CentOS / RHEL 系
#########################################################
centos|rhel)
    echo "➡️ 安装依赖..."
    yum install -y yum-utils

    echo "➡️ 添加 Docker 源..."
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

    echo "➡️ 安装 Docker..."
    yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "➡️ 启动 Docker..."
    systemctl enable docker
    systemctl start docker
    ;;
#########################################################
#              Fedora 系
#########################################################
fedora)
    echo "➡️ 安装依赖..."
    dnf -y install dnf-plugins-core

    echo "➡️ 添加 Docker 源..."
    dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

    echo "➡️ 安装 Docker..."
    dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    echo "➡️ 启动 Docker..."
    systemctl enable docker
    systemctl start docker
    ;;
#########################################################
*)
    echo "❌ 不支持的系统: $OS"
    exit 1
    ;;
esac

# 测试 Docker
echo "➡️ 运行 hello-world 测试镜像..."
docker run --rm hello-world

echo "======================================="
echo "   🎉 Docker 安装完成！输入命令查看：   "
echo "     docker --version"
echo "     docker compose version"
echo "======================================="
