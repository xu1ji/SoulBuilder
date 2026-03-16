# SoulBuilder 2.0

> **像黑客帝国一样，给你的 AI Agent 注入技能包。**

[![Version](https://img.shields.io/badge/version-2.0-00FF41?style=flat-square)]()
[![Code](https://img.shields.io/badge/code-Construct-000000?style=flat-square)]()

---

## 🎬 项目简介

SoulBuilder 2.0 是一个 Matrix 风格的 AI Agent 训练系统。用户可以通过对话式交互，在 5-10 分钟内让 Agent 从 60 分提升到 85 分。

### 核心理念
- **Matrix Construct** - 纯白训练空间
- **"I know Kung Fu"** - 瞬间技能注入
- **用户说 10%，AI 补 90%** - 开放教练模式

---

## 📦 项目结构

这是一个 **Monorepo** 项目，包含 5 个子项目：

```
SoulBuilder/
├── packages/
│   ├── shared/          # 🔷 共享类型定义
│   ├── assessment/      # 🟦 Agent 评估引擎
│   ├── training/        # 🟪 Construct 训练系统
│   ├── animation/       # 🟧 仪式感动画
│   └── app/             # 🟩 主应用集成
├── docs/                # 📄 文档
│   ├── 需求文档-SoulBuilder-2.0.md
│   ├── 创意调研-黑客帝国式Agent训练.md
│   └── 子项目拆分方案.md
└── README.md            # 本文件
```

---

## 🚀 快速开始

### 1. 先开发 shared（接口先行）

```bash
cd packages/shared
# 查看类型定义，所有子项目共用
cat types.ts
```

### 2. 并行开发其他子项目

每个子项目都是独立的，可以分给不同的开发者：

| 子项目 | 职责 | 预计工时 |
|--------|------|----------|
| `shared` | 接口定义 | 1 小时 |
| `assessment` | Agent 评估 | 2-3 天 |
| `training` | 训练对话 | 3-4 天 |
| `animation` | 训练动画 | 2-3 天 |
| `app` | 主应用整合 | 1-2 天 |

### 3. 最后整合

```bash
cd packages/app
npm install  # 安装所有子项目依赖
npm run dev  # 启动开发
```

---

## 📋 子项目说明

### shared - 共享类型定义
- **位置**: `packages/shared/`
- **职责**: 定义所有 TypeScript 接口和常量
- **独立性**: ⭐⭐⭐⭐⭐ （无依赖，最先完成）
- **README**: [packages/shared/README.md](packages/shared/README.md)

### assessment - 评估引擎
- **位置**: `packages/assessment/`
- **职责**: 评估 Agent 能力，生成雷达图
- **独立性**: ⭐⭐⭐⭐⭐ （只依赖 shared）
- **README**: [packages/assessment/README.md](packages/assessment/README.md)

### training - 训练对话
- **位置**: `packages/training/`
- **职责**: Construct 对话系统，SSE 流式交互
- **独立性**: ⭐⭐⭐⭐ （只依赖 shared）
- **README**: [packages/training/README.md](packages/training/README.md)

### animation - 仪式感动画
- **位置**: `packages/animation/`
- **职责**: Matrix 风格训练动画，像素小人
- **独立性**: ⭐⭐⭐⭐⭐ （纯前端，无依赖）
- **README**: [packages/animation/README.md](packages/animation/README.md)

### app - 主应用
- **位置**: `packages/app/`
- **职责**: 整合所有子项目，路由，状态管理
- **独立性**: ⭐⭐ （依赖所有其他子项目）
- **README**: [packages/app/README.md](packages/app/README.md)

---

## 🔗 依赖关系

```
                    ┌─────────────┐
                    │   shared    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ assessment  │ │   training  │ │  animation  │
    └─────────────┘ └─────────────┘ └─────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     app     │
                    └─────────────┘
```

---

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **状态**: Zustand
- **样式**: Tailwind CSS
- **后端**: Bun + Hono（复用 HelloIM）
- **AI**: 智谱 GLM-5

---

## 📖 核心文档

- [需求文档 v2.0](docs/需求文档-SoulBuilder-2.0.md) - 完整 PRD
- [创意调研](docs/创意调研-黑客帝国式Agent训练.md) - Matrix 设计参考
- [子项目拆分方案](docs/子项目拆分方案.md) - 开发分工说明

---

## 🎨 设计规范

### 颜色
| 用途 | 色值 |
|------|------|
| Matrix 绿 | `#00FF41` |
| Construct 白 | `#FFFFFF` |
| 深空黑 | `#0D0208` |
| 成功绿 | `#4ADE80` |
| 等级金 | `#FBBF24` |

### 动画
- 训练动画总时长：30 秒
- 5 个阶段：接入 → 传输 → 训练 → 觉醒 → 完成

---

## 🔧 OpenClaw 集成

SoulBuilder 与 OpenClaw 深度集成：

### 读取路径
```
~/.openclaw/
├── openclaw.json              # Agent 列表
└── workspace-{agent-id}/      # Agent 配置
    ├── IDENTITY.md
    ├── SOUL.md
    ├── HEARTBEAT.md
    └── ...
```

### 评估维度
对应 OpenClaw 7 层架构：
- IDENTITY (身份档案)
- SOUL (灵魂宪法)
- HEARTBEAT (心跳任务)
- USER (雇主索引)
- TOOLS (工具地图)
- AGENTS (协作关系)
- MEMORY (记忆管理)

---

## 📞 开发协作

### 开发顺序
1. **Phase 1**: shared（接口定义）
2. **Phase 2**: assessment / training / animation（并行）
3. **Phase 3**: app（整合）

### Git 分支
- `main` - 主分支
- `feature/assessment` - 评估引擎
- `feature/training` - 训练系统
- `feature/animation` - 动画
- `feature/app` - 主应用

### 合并流程
1. 各子项目开发完成后提 PR
2. Code Review
3. 合并到 main
4. 最后整合到 app

---

## 📄 License

MIT

---

*Construct Your Agent. I know Kung Fu.*
