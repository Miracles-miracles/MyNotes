---
title: Git 版本管理
date: 2026-07-07
tags: [Git, 版本控制]
category: 工具类
---

# Git 版本管理

## 基础概念

### 工作区 (Workspace)

本地目录中看到的文件。

### 暂存区 (Staging Area)

准备提交的文件集合，通过 `git add` 添加。

### 仓库 (Repository)

存储提交历史的地方，分为本地仓库和远程仓库。

## 常用命令

### 初始化与克隆

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone <repository-url>
```

### 日常操作

```bash
# 查看状态
git status

# 添加文件到暂存区
git add <file-name>
git add .

# 提交更改
git commit -m "commit message"

# 查看提交历史
git log
git log --oneline
git log --graph

# 查看差异
git diff
git diff --cached
```

### 分支管理

```bash
# 查看分支
git branch
git branch -a

# 创建分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>
git switch <branch-name>

# 创建并切换分支
git checkout -b <branch-name>
git switch -c <branch-name>

# 合并分支
git merge <branch-name>

# 删除分支
git branch -d <branch-name>
git branch -D <branch-name>  # 强制删除
```

### 远程操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <url>

# 拉取更新
git pull

# 推送代码
git push
git push -u origin <branch-name>

# 推送到指定分支
git push origin <branch-name>
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file-name>

# 撤销暂存区修改
git reset HEAD <file-name>

# 撤销提交（创建新提交）
git revert <commit-id>

# 回退到指定提交（谨慎使用）
git reset --hard <commit-id>
```

## 工作流程

### Git Flow

```
main (生产分支)
├── develop (开发分支)
│   ├── feature/* (功能分支)
│   └── release/* (发布分支)
└── hotfix/* (紧急修复分支)
```

### GitHub Flow

```
main (主分支)
└── feature/* (功能分支)
    └── PR 合并到 main
```

## 协作规范

### Commit Message 规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- feat：新功能
- fix：修复 bug
- docs：文档更新
- style：代码格式
- refactor：重构
- test：测试
- chore：构建/工具

#### 示例

```
feat(login): 添加微信登录功能

- 集成微信 OAuth2.0
- 添加登录状态管理
- 更新用户信息获取接口

Closes #123
```

### Pull Request 规范

1. 描述清楚变更内容
2. 关联相关 issue
3. 包含测试结果
4. 请求代码审查