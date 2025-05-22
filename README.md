# 小猪储钱罐

一个为孩子设计的储蓄管理应用，帮助孩子学习理财知识。简易的电子储钱罐项目。

## 功能特性

- 卡通风格的储钱罐界面
- 投币动画效果
- 储蓄目标管理
- 家长管理后台（密码保护）
- 交易记录查看
- 响应式设计，支持移动设备
- **多用户账号系统**（每个用户拥有独立数据）

## 技术栈

- 前端：Svelte + Vite
- 后端：JSON-Server (RESTful API)
- 存储：JSON文件 + localStorage备份
- 认证：简易令牌认证

## 快速开始

### 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

### 开发模式

启动前端和API服务器：

```bash
# 同时启动前端和API服务器
npm run dev:all

# 或单独启动前端
npm run dev

# 单独启动API服务器
npm run server
```

前端服务将在 http://localhost:5173 运行
API服务将在 http://localhost:5174 运行

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 启动生产服务器（同时提供前端和API）
npm run start
```

生产服务器将在 http://localhost:8080 运行

## 用户账号系统

应用现在支持多用户，每个用户拥有独立的储钱罐数据。

### 默认测试账号

- 用户名：demo
- 密码：demo123

### 注册新账号

任何人都可以注册新账号，注册后自动创建新的储钱罐数据。

## API 数据结构

每个用户的数据存储在 `db_[username].json` 文件中，结构如下：

```json
{
  "piggyBank": {
    "balance": 0,
    "transactions": [
      {
        "id": 1234567890,
        "amount": 50,
        "description": "压岁钱",
        "date": "2023-06-15T08:30:00Z",
        "deposited": true
      }
    ],
    "goals": [
      {
        "id": 9876543210,
        "name": "新玩具",
        "amount": 100,
        "currentAmount": 0,
        "completed": false
      }
    ]
  }
}
```

用户信息存储在 `users.json` 文件中，结构如下：

```json
{
  "users": [
    {
      "username": "demo",
      "password": "demo123",
      "displayName": "演示账号",
      "createdAt": "2023-05-01T00:00:00Z"
    }
  ]
}
```

## 部署指南

### 使用 Vercel 部署

1. 在 Vercel 中创建新项目
2. 添加环境变量 `VERCEL_ENV=production`
3. 部署项目

### 使用自己的服务器部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录和 `server.js`, `users.json`, `db_*.json` 文件上传到服务器
3. 安装依赖：`npm install json-server`
4. 启动服务：`node server.js`

## 更新数据备份

应用使用 `localStorage` 作为数据备份，如果API服务器不可用，数据将自动从本地存储加载和保存。每个用户的数据分别存储。

## 关于项目

该项目基于Svelte + Vite构建。Svelte是一个高性能的前端框架，而Vite提供了快速的开发体验。

## 许可证

MIT
