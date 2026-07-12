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

### checkout 高级用法

```bash
# 撤销工作区文件修改（恢复到暂存区状态）
git checkout -- <file-name>

# 从指定提交恢复文件
git checkout <commit-id> -- <file-name>

# 切换到指定提交（进入分离 HEAD 状态）
git checkout <commit-id>

# 创建新分支并切换到指定提交
git checkout -b <new-branch> <commit-id>

# 撤销所有未暂存的修改
git checkout .
```

### 相对引用

相对引用使用 `^`（caret）和 `~`（tilde）在提交历史中导航。

#### `~` 操作符

沿第一父提交链向上回溯，`~N` 表示向上 N 代。

```bash
# 当前提交的父提交（第一父提交）
git log HEAD~1

# 当前提交的祖父提交
git log HEAD~2

# 当前分支的第 N 个祖先提交
git log HEAD~N
```

#### `^` 操作符

用于选择合并提交的不同父提交，`^N` 表示第 N 个父提交。

```bash
# 当前提交的第一父提交（等同于 HEAD~1）
git log HEAD^
git log HEAD^1

# 当前提交的第二父提交（仅合并提交有多个父提交）
git log HEAD^2

# 当前提交的第三父提交
git log HEAD^3
```

#### 组合使用

`^` 和 `~` 可以组合使用。

```bash
# 第二父提交的父提交（即第二父提交的第一父提交）
git log HEAD^2~1

# 第二父提交的祖父提交
git log HEAD^2~2

# 第一父提交的第二父提交
git log HEAD^1^2
```

#### 示意图

```
        A---B---C  (main)
       /
  D---E---F---G  (feature)
       \
        H---I  (hotfix)

E 是合并提交，有两个父提交：D 和 A

E^1  或  E~1   → D（第一父提交，按提交顺序）
E^2            → A（第二父提交）
E~2            → D 的父提交
E^2~1          → A 的父提交
```

#### reflog 引用

```bash
# 查看引用日志（记录 HEAD 和分支的历史移动）
git reflog

# 当前位置
git log HEAD@{0}

# 上一个位置
git log HEAD@{1}

# 三天前的位置
git log HEAD@{3.days.ago}
```

#### 比较差异

```bash
# 比较当前提交与父提交的差异
git diff HEAD~1..HEAD

# 比较两个分支
git diff feature..main

# 比较两个提交之间的差异
git diff <commit-id1>..<commit-id2>
```

### 分离 HEAD (Detached HEAD)

当 HEAD 指向一个具体的提交而非分支时，处于分离 HEAD 状态。

```bash
# 进入分离 HEAD 状态
git checkout <commit-id>

# 在分离 HEAD 状态下创建提交
git commit -m "临时修改"

# 从分离 HEAD 创建新分支
git checkout -b <new-branch>

# 退出分离 HEAD 状态
git checkout <branch-name>
```

**注意**：分离 HEAD 状态下的提交在切换分支后可能丢失，需及时创建新分支保存。

### rebase（变基）

将一个分支的提交移动到另一个分支之上，使提交历史更线性。

```bash
# 将当前分支变基到目标分支
git rebase <target-branch>

# 在 feature 分支上执行
git checkout feature
git rebase main

# 交互式变基（修改最近 N 个提交）
git rebase -i HEAD~N

# 跳过冲突继续变基
git rebase --continue

# 中止变基
git rebase --abort

# 跳过当前提交
git rebase --skip
```

**注意**：不要对已推送到公共仓库的提交执行 rebase，会改变提交历史。

### reset（重置）

```bash
# 软重置：保留工作区和暂存区，仅重置 HEAD
git reset --soft <commit-id>

# 混合重置（默认）：保留工作区，重置暂存区和 HEAD
git reset <commit-id>
git reset HEAD <file-name>  # 撤销单个文件的暂存

# 硬重置：丢弃工作区和暂存区的所有修改
git reset --hard <commit-id>

# 重置到远程分支状态
git reset --hard origin/main
```

### revert（回滚）

创建新提交来撤销指定提交的修改，不改变历史记录。

```bash
# 撤销指定提交
git revert <commit-id>

# 撤销最近一次提交
git revert HEAD

# 撤销多个提交
git revert <commit-id1> <commit-id2>

# 以新提交的方式撤销合并提交
git revert -m 1 <merge-commit-id>
```

**reset vs revert**：
- `reset`：删除提交，改变历史，适用于本地未推送的提交
- `revert`：创建新提交，不改变历史，适用于已推送的提交

### cherry-pick（拣选）

将指定提交应用到当前分支。

```bash
# 拣选单个提交
git cherry-pick <commit-id>

# 拣选多个提交
git cherry-pick <commit-id1> <commit-id2>

# 拣选连续的提交范围（左开右闭）
git cherry-pick <start-commit>..<end-commit>

# 拣选时不创建新提交，只应用修改到工作区
git cherry-pick --no-commit <commit-id>

# 遇到冲突后继续
git cherry-pick --continue

# 放弃拣选
git cherry-pick --abort
```

### 交互式 rebase

用于修改、删除、合并提交历史。

```bash
# 修改最近 N 个提交
git rebase -i HEAD~N

# 修改从指定提交到当前的所有提交
git rebase -i <commit-id>
```

进入编辑界面后，每行开头可以选择操作：

```bash
pick 3f7a2b1 添加登录功能
pick 8c9d3e4 修复登录bug
pick 2a5f8c0 更新文档

# 可用命令：
# p, pick = 使用提交
# r, reword = 使用提交，但修改提交信息
# e, edit = 使用提交，暂停以便修改
# s, squash = 使用提交，但合并到前一个提交
# f, fixup = 类似 squash，但丢弃提交信息
# d, drop = 删除提交
```

### tag（标签）

用于标记重要的版本点，如发布版本。

```bash
# 创建轻量标签
git tag <tag-name>

# 创建带注释的标签
git tag -a <tag-name> -m "标签注释"

# 为指定提交创建标签
git tag -a <tag-name> <commit-id> -m "标签注释"

# 查看所有标签
git tag
git tag -l "v1.*"

# 查看标签详情
git show <tag-name>

# 删除标签
git tag -d <tag-name>

# 推送标签到远程
git push origin <tag-name>
git push origin --tags  # 推送所有标签

# 删除远程标签
git push origin :refs/tags/<tag-name>

# 检出标签（进入分离 HEAD 状态）
git checkout <tag-name>

# 基于标签创建分支
git checkout -b <branch-name> <tag-name>
```

### describe（描述）

显示最近的标签和提交信息，常用于版本标识。

```bash
# 显示最近的标签
git describe

# 显示最近的带注释标签
git describe --tags

# 显示完整哈希
git describe --always

# 显示距离标签的提交数
git describe --long

# 示例输出
# v1.0.0-5-g3f7a2b1
# 标签名-提交数-g+简短哈希
```

### 远程操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <url>

# 重命名远程仓库
git remote rename old-name new-name

# 删除远程仓库
git remote remove <name>

# 查看远程仓库详细信息
git remote show origin
```

### 远程分支与远程跟踪分支

#### 远程分支命名规范

远程分支采用 `<remote-name>/<branch-name>` 的格式命名：

```bash
# 查看所有远程分支
git branch -r
# origin/main
# origin/develop
# origin/feature/login

# 查看本地和远程所有分支
git branch -a
```

#### 本地分支与远程分支的区别

| 类型 | 示例 | 存储位置 | 更新方式 |
|------|------|----------|----------|
| 本地分支 | `main` | 本地 `.git/refs/heads/` | 本地提交 |
| 远程跟踪分支 | `origin/main` | 本地 `.git/refs/remotes/origin/` | `git fetch` 更新 |

**关系**：远程跟踪分支是远程仓库分支的本地副本，用于记录上次与远程同步时的状态。

#### 远程跟踪分支

当本地分支与远程分支建立跟踪关系后，可以使用简化的 `pull` 和 `push` 命令。

```bash
# 查看分支跟踪关系
git branch -vv

# 示例输出
# main    abc1234 [origin/main] 最新提交信息
# feature def5678 [origin/feature: ahead 2] 领先远程2个提交
```

### fetch / pull / push 详解

#### fetch

从远程仓库获取提交，但**不合并**到本地分支。

```bash
# 获取所有远程分支的更新
git fetch origin

# 获取指定远程分支的更新
git fetch origin main

# 获取所有远程仓库的更新
git fetch --all

# 获取时删除已不存在的远程分支
git fetch -p
git fetch --prune

# source 为空时（删除远程分支）
git push origin :<branch-name>
```

#### pull

从远程仓库获取提交并**合并**到当前分支（`fetch + merge`）。

```bash
# 获取并合并到当前分支
git pull

# 指定远程仓库和分支
git pull origin main

# 使用 rebase 方式合并（推荐）
git pull --rebase

# 使用 rebase 并保持 merge commit
git pull --rebase=preserve

# source 为空时（无效，pull 必须指定 source）
# git pull origin  # 会报错
```

#### push

将本地提交推送到远程仓库。

```bash
# 推送当前分支到远程（需先建立跟踪关系）
git push

# 推送指定分支到远程
git push origin main

# 推送并建立跟踪关系
git push -u origin main

# 强制推送（谨慎使用，会覆盖远程历史）
git push -f
git push --force

# 删除远程分支（source 为空）
git push origin :<branch-name>

# 推送所有分支
git push --all

# source 为空时的其他用法
git push origin HEAD:main  # 将当前分支推送到远程 main
git push origin feature:release  # 将 feature 分支推送到远程 release
```

#### 对比表

| 命令 | 操作 | 是否改变工作区 | 是否合并 |
|------|------|----------------|----------|
| `git fetch` | 获取远程提交 | 否 | 否 |
| `git pull` | fetch + merge | 是 | 是 |
| `git pull --rebase` | fetch + rebase | 是 | 是（变基） |
| `git push` | 推送本地提交 | 否 | 否 |

### 远程服务器拒绝（Remote Rejected）

#### 常见原因

1. **权限不足**
   - 没有写入远程仓库的权限
   - 解决方案：联系仓库管理员添加权限，或使用正确的账号

2. **非快进推送（Non-fast-forward）**
   - 远程分支包含本地没有的提交
   - 错误信息：`! [rejected] main -> main (non-fast-forward)`
   - 解决方案：先 `git pull` 获取远程更新，解决冲突后再推送

3. **分支保护规则**
   - 远程仓库设置了分支保护（如 main 分支禁止直接推送）
   - 解决方案：通过 Pull Request 合并，或联系管理员调整规则

4. **强制推送被阻止**
   - 远程仓库禁止强制推送
   - 错误信息：`! [remote rejected] main -> main (pre-receive hook declined)`
   - 解决方案：使用常规推送，或联系管理员

5. **提交历史被改写**
   - 对已推送的提交执行了 rebase 或 reset
   - 解决方案：使用 `git push -f`（谨慎），或与团队沟通

6. **远程分支已删除**
   - 推送的目标分支在远程已不存在
   - 解决方案：重新创建远程分支，或推送至其他分支

#### 通用解决流程

```bash
# 1. 获取最新的远程信息
git fetch origin

# 2. 查看本地与远程的差异
git log --oneline main..origin/main

# 3. 合并远程更新
git pull origin main

# 4. 解决冲突（如有）
# 编辑冲突文件后
git add <conflict-files>
git commit

# 5. 再次推送
git push origin main
```

### 新建分支跟踪远程分支

```bash
# 方式一：从远程分支创建本地分支并自动跟踪
git checkout -b main origin/main

# 方式二：简写形式（Git 2.23+）
git switch -c main origin/main

# 方式三：先创建分支，再设置跟踪关系
git branch main
git branch --set-upstream-to=origin/main main

# 方式四：推送本地分支并建立跟踪关系
git push -u origin main

# 查看跟踪关系
git branch -vv
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