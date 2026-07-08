---
title: Postman 接口测试
date: 2026-07-07
tags: [Postman, 接口测试]
category: 工具类
---

# Postman 接口测试

## 基本概念

### Collection (集合)

一组相关请求的集合，便于管理和执行。

### Request (请求)

单个接口请求，包含 URL、方法、参数等。

### Environment (环境)

环境变量集合，用于在不同环境间切换。

### Variable (变量)

可复用的值，分为环境变量和全局变量。

## 请求结构

### 请求方法

| 方法 | 说明 |
|------|------|
| GET | 获取资源 |
| POST | 创建资源 |
| PUT | 更新资源 |
| DELETE | 删除资源 |
| PATCH | 部分更新 |

### 请求 URL

```
https://api.example.com/users
```

### 请求参数

#### Query Params

URL 中 `?` 后面的参数：

```
https://api.example.com/users?page=1&size=10
```

#### Path Params

URL 路径中的参数：

```
https://api.example.com/users/:id
```

#### Body

请求体，常用于 POST/PUT 请求：

- **form-data**：表单数据
- **x-www-form-urlencoded**：URL 编码的表单数据
- **raw**：原始数据（JSON、XML、文本等）
- **binary**：二进制文件

### 请求头

```
Content-Type: application/json
Authorization: Bearer token
```

## 响应处理

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 响应体

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "test"
  }
}
```

## 变量使用

### 环境变量

在不同环境（开发、测试、生产）间切换：

```
{{base_url}}/users
{{token}}
```

### 全局变量

跨集合和环境共享的变量：

```
{{global_token}}
```

### 变量设置

```javascript
// 在 Pre-request Script 中设置
pm.environment.set("token", "abc123");

// 在 Tests 中设置
pm.globals.set("userId", pm.response.json().data.id);
```

## 测试脚本

### Pre-request Script

请求发送前执行的脚本：

```javascript
// 设置时间戳
pm.environment.set("timestamp", Date.now());

// 生成签名
const apiKey = pm.environment.get("apiKey");
const timestamp = pm.environment.get("timestamp");
const sign = md5(apiKey + timestamp);
pm.environment.set("sign", sign);
```

### Tests

请求发送后执行的脚本，用于验证响应：

```javascript
// 验证状态码
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 验证响应时间
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

// 验证响应体
pm.test("Response body has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.code).to.eql(200);
    pm.expect(jsonData.message).to.eql("success");
    pm.expect(jsonData.data).to.have.property("id");
});

// 验证 JSON Schema
pm.test("Response matches schema", function () {
    pm.response.to.have.jsonSchema({
        type: "object",
        properties: {
            code: { type: "number" },
            message: { type: "string" },
            data: { type: "object" }
        }
    });
});
```

## 集合运行

### 手动运行

点击集合右侧的运行按钮。

### 命令行运行

使用 Newman 工具：

```bash
newman run collection.json -e environment.json
```

## Mock Server

### 创建 Mock

1. 选择集合
2. 创建 Mock Server
3. 设置响应规则
4. 获取 Mock URL

### 使用 Mock

将请求 URL 指向 Mock Server，用于前端开发或接口测试。

## 最佳实践

### 集合组织

按模块或业务功能组织集合：

```
用户模块
├── 登录
├── 注册
├── 获取用户列表
├── 获取用户详情
└── 更新用户信息
```

### 环境管理

创建不同环境的配置：

- 开发环境
- 测试环境
- 生产环境

### 文档生成

使用 Postman 自动生成接口文档，分享给团队。

### 自动化测试

结合 Newman 实现接口自动化测试，集成到 CI/CD 流程。