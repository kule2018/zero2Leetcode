---
name: frontend-dev
description: Zero2Leetcode 前端开发技能 — 快速理解项目技术栈、架构、CSS/JS 模式，指导页面调整与功能添加。
---

# Zero2Leetcode 前端开发技能

你是 Zero2Leetcode 项目的前端开发助手。帮助开发者理解项目架构、调整页面、添加新功能。

除非用户明确指定别的做法，否则当涉及前端开发相关问题时默认按本技能执行。

## 适用场景

当用户出现以下需求时，使用本技能：

- "帮我理解这个项目的前端架构"
- "页面上要加一个新功能/新区块"
- "修改某个页面的样式"
- "添加一个新页面"
- "这个 JS 逻辑是怎么工作的"
- "我想改 playground 的布局"
- "首页要加一个新板块"
- "怎么给页面加交互"

## 技术栈概览

| 分类 | 技术 |
|------|------|
| **框架** | 纯 HTML/CSS/JavaScript（无框架） |
| **静态生成** | Jekyll（GitHub Pages） |
| **代码编辑器** | CodeMirror 5（CDN 引入） |
| **Python 运行时** | Pyodide v0.26.4（浏览器端 Python） |
| **Markdown 渲染** | Marked.js |
| **AI 集成** | OpenRouter API（SSE 流式） |
| **部署** | GitHub Pages + GitHub Actions |
| **样式方案** | 纯 CSS + CSS 自定义属性（无 Tailwind/预处理器） |
| **状态存储** | localStorage + 全局 window 变量 |
| **字体** | Google Fonts（Inter + Fira Code） |

## 项目目录结构

```
zero2Leetcode/
├── index.html                    # 首页（学习路线、知识模块、题目清单）
├── playground.html               # 在线练习场（三栏布局：题目|编辑器|AI）
├── _config.yml                   # Jekyll 配置
│
├── assets/
│   ├── css/
│   │   ├── style.css             # 全局样式 + CSS 变量（主题系统）
│   │   ├── playground.css        # 练习场专用样式
│   │   └── docs.css              # 文档页样式
│   ├── js/
│   │   ├── app.js                # 首页逻辑（导航、筛选、搜索、表格）
│   │   ├── playground.js         # 练习场核心（~2300 LOC）
│   │   ├── ai-assistant.js       # AI 助手 UI + API 调用
│   │   ├── problems-data.js      # 题目元数据总表
│   │   └── playground-extra/     # 批次扩展题目文件
│   │       └── batch-*.js
│   └── images/
│       └── logo.svg
│
├── _layouts/                     # Jekyll 模板
├── docs/                         # 文档与学习指南
├── 00_python_basics/             # 学习路径阶段 1
├── 01_data_structures/           # 学习路径阶段 2
├── 02_algorithms/                # 学习路径阶段 3
├── 03_leetcode_practice/         # 学习路径阶段 4
│
├── .github/workflows/deploy.yml  # CI/CD 部署
└── .agents/                      # Claude 技能仓库
```

## 页面架构

### index.html（首页）

- **加载的 CSS**：`style.css`
- **加载的 JS**：`problems-data.js` → `app.js`
- **页面结构**：
  - `nav.navbar` — 顶部导航栏
  - `header.hero` — 首页横幅（统计数据、CTA 按钮）
  - `section#roadmap` — 学习路线（4 阶段时间线）
  - `section#modules` — 知识模块卡片网格
  - `section#problems` — 题目清单表格（带筛选/搜索）
  - `footer.footer` — 页脚
- **JS 初始化入口**：`DOMContentLoaded` → `initNavbar()` / `initProblemsTable()` / `initFilters()` / `initSearch()` / `initModuleCards()`

### playground.html（在线练习场）

- **加载的 CSS**：`style.css` + `playground.css` + CodeMirror CSS（CDN）
- **加载的 JS**（按顺序）：
  1. `marked.min.js`（defer）
  2. CodeMirror 核心 + Python 模式 + 插件（CDN）
  3. `problems-data.js`
  4. `playground.js`
  5. `playground-extra/batch-*.js`
  6. `ai-assistant.js`
- **页面结构**：
  - `nav.navbar` — 顶部导航栏（与首页共享结构）
  - `.playground-toolbar` — 工具栏（题目选择、运行按钮、Pyodide 状态）
  - `.playground-layout` — 三栏布局：
    - `.panel-problem` — 左侧题目描述面板
    - `.panel-editor` — 中间代码编辑器 + 输出面板
    - `.panel-ai` — 右侧 AI 助手面板
- **关键全局变量**：
  - `window.currentProblem` — 当前选中的题目对象
  - `window.editor` — CodeMirror 实例
  - `window.PROBLEMS` — 题目元数据数组（来自 problems-data.js）
  - `window.PLAYGROUND_EXTRA_PROBLEMS` — 扩展题目数组

## CSS 架构与规范

### 主题系统

所有颜色、间距、圆角、阴影、字体都通过 CSS 自定义属性定义在 `:root` 中。修改视觉风格时优先调整变量，而不是硬编码值。

```css
/* 关键变量分组 */
--primary / --primary-dark / --primary-light / --primary-glow  /* 主色调（紫色系 hue=250） */
--accent / --accent-dark                                        /* 强调色（青色系 hue=170） */
--easy / --medium / --hard                                      /* 难度颜色 */
--bg-primary / --bg-secondary / --bg-tertiary / --bg-card       /* 背景层级（深色主题） */
--text-primary / --text-secondary / --text-muted                /* 文字层级 */
--border-color / --border-hover                                 /* 边框 */
--spacing-xs ~ --spacing-3xl                                    /* 间距梯度 */
--radius-sm ~ --radius-xl                                       /* 圆角梯度 */
--shadow-sm ~ --shadow-glow                                     /* 阴影梯度 */
--transition-fast / --transition-base / --transition-slow        /* 过渡速度 */
--font-sans / --font-mono                                       /* 字体族 */
```

### 样式编写规范

1. **深色主题**：背景色为 `#0a0a0f`（--bg-primary），所有 UI 都基于深色设计
2. **卡片样式**：统一使用 `--bg-card` + `--border-color` + `--radius-md`，hover 时用 `--bg-card-hover`
3. **按钮系统**：`.btn` 基础类 + `.btn-primary` / `.btn-secondary` / `.btn-run` / `.btn-reset` 变体
4. **响应式**：移动端优先，三栏布局在小屏下折叠为单栏
5. **过渡动画**：所有交互元素使用 `var(--transition-base)`，微交互用 `var(--transition-fast)`
6. **渐变文字**：使用 `.gradient-text` 类实现渐变效果
7. **命名约定**：BEM 风格命名（如 `.panel-header`、`.nav-link-active`、`.hero-stats`）

### 添加新样式的位置

- 全局通用样式 → `assets/css/style.css`
- 练习场专用样式 → `assets/css/playground.css`
- 文档页样式 → `assets/css/docs.css`
- 如果新增独立页面，可新建对应 CSS 文件并在 HTML 中引入

## JavaScript 模式

### 代码组织

项目使用函数式组织方式，无模块打包器。每个 JS 文件通过 `<script>` 标签加载，通过 `window` 全局变量通信。

```
problems-data.js  →  window.PROBLEMS（题目元数据数组）
playground.js     →  window.editor, window.currentProblem, DETAILED_PROBLEMS 等
batch-*.js        →  window.PLAYGROUND_EXTRA_PROBLEMS（扩展题目）
ai-assistant.js   →  读取 window.currentProblem 获取当前题目上下文
app.js            →  读取 window.PROBLEMS 构建首页表格
```

### 关键 JS 模式

1. **DOM 操作**：直接使用 `document.querySelector` / `document.getElementById`，无 jQuery
2. **事件绑定**：`addEventListener` 绑定在 `DOMContentLoaded` 之后
3. **模板渲染**：使用字符串模板字面量（backtick）生成 HTML，赋值给 `innerHTML`
4. **数据存取**：`localStorage.getItem/setItem` + JSON 序列化
5. **异步模式**：`async/await` 用于 Pyodide 加载和 AI API 调用
6. **AI 流式响应**：使用 `fetch` + `ReadableStream` 读取 SSE 事件流

### 添加新功能的入口

| 功能类型 | 修改文件 | 入口函数 |
|---------|---------|---------|
| 首页新板块 | `index.html` + `style.css` + `app.js` | 在 `DOMContentLoaded` 回调中添加 `initXxx()` |
| 练习场新面板 | `playground.html` + `playground.css` + `playground.js` | 在页面初始化流程中添加 |
| AI 助手功能 | `ai-assistant.js` + `playground.css` | 修改 AI 面板逻辑 |
| 新独立页面 | 新建 `xxx.html` + 对应 CSS/JS | 复制导航栏结构，引入 `style.css` |

## 常见开发任务指南

### 1. 添加首页新板块

```
步骤：
1. 在 index.html 中合适位置添加 <section> 结构
2. 在 style.css 中添加板块样式（使用 CSS 变量）
3. 如果需要交互，在 app.js 中添加初始化函数并在 DOMContentLoaded 中调用
```

### 2. 修改练习场布局

```
步骤：
1. 阅读 playground.html 理解三栏结构
2. 修改 playground.css 中的 .playground-layout grid 定义
3. 如果添加新面板，需要同时更新 HTML 结构和 CSS grid 模板
4. 注意保持响应式：检查 @media 查询的移动端适配
```

### 3. 添加新的交互组件

```
步骤：
1. HTML：在目标页面添加 DOM 结构
2. CSS：使用项目 CSS 变量保持视觉一致性
   - 卡片：var(--bg-card), var(--border-color), var(--radius-md)
   - 按钮：复用 .btn 基础类
   - 文字：var(--text-primary) / var(--text-secondary)
3. JS：在对应 JS 文件中添加逻辑
   - 使用 querySelector 获取 DOM
   - 使用 addEventListener 绑定事件
   - 数据持久化用 localStorage
```

### 4. 创建新独立页面

```
步骤：
1. 复制 index.html 的 <head> 和 <nav> 部分作为基础
2. 引入 style.css（全局样式）
3. 如需独立样式，新建 assets/css/xxx.css
4. 如需逻辑，新建 assets/js/xxx.js
5. 更新导航栏链接（所有页面的 nav-menu 都需同步修改）
6. 在 _config.yml 中添加 include（如果 Jekyll 需要处理该文件）
```

### 5. 修改题目数据

```
- 题目元数据（标题、难度、链接）→ assets/js/problems-data.js
- 题目详情（描述、模板、测试用例）→ assets/js/playground.js 或 playground-extra/batch-*.js
- 修改后需验证：
  - 首页表格是否正常显示
  - playground 下拉列表是否包含该题
  - playground.html?id=<id> 是否能正确路由
```

## 脚本加载顺序（重要）

### index.html

```html
<script src="assets/js/problems-data.js"></script>   <!-- 题目数据 -->
<script src="assets/js/app.js"></script>              <!-- 首页逻辑 -->
```

### playground.html

```html
<!-- 1. 第三方库 -->
<script src="marked.min.js" defer></script>
<script src="codemirror/codemirror.min.js"></script>
<script src="codemirror/python.min.js"></script>
<script src="codemirror/addon/*.js"></script>

<!-- 2. 数据层 -->
<script src="assets/js/problems-data.js"></script>

<!-- 3. 核心逻辑（定义 LINKED_LIST_SETUP、BINARY_TREE_SETUP 等） -->
<script src="assets/js/playground.js"></script>

<!-- 4. 扩展题目（依赖 playground.js 中的 setup 常量） -->
<script src="assets/js/playground-extra/batch-1.js"></script>
<script src="assets/js/playground-extra/batch-2.js"></script>
<!-- ... -->

<!-- 5. AI 助手（依赖 window.currentProblem） -->
<script src="assets/js/ai-assistant.js"></script>
```

**新增脚本时必须注意加载顺序**：数据层 → 核心逻辑 → 扩展数据 → 附加功能。

## 调试与验证

### 本地运行

```bash
# 方式 1：Jekyll 本地服务
bundle exec jekyll serve

# 方式 2：简单 HTTP 服务（不需要 Jekyll 编译时）
python -m http.server 8000
# 或
npx serve .
```

### 检查清单

- [ ] 页面在 Chrome/Safari/Firefox 中正常显示
- [ ] 移动端响应式布局正确折叠
- [ ] 新增的 CSS 使用了项目 CSS 变量而非硬编码颜色
- [ ] 新增的 JS 不与现有全局变量冲突
- [ ] 脚本加载顺序正确（依赖项在前）
- [ ] localStorage 的 key 使用有意义的前缀避免冲突
- [ ] 导航栏链接在所有页面间保持一致

## 执行策略

- 修改前先阅读相关文件，理解现有结构
- 优先使用 CSS 变量保持视觉一致性
- 新增交互时遵循项目现有的 JS 模式（函数式、无框架、全局变量通信）
- 修改 HTML 结构后检查响应式表现
- 若发现已有未提交改动，理解并兼容，不要回滚用户的修改
- 不要引入新的构建工具或框架依赖（保持纯静态站点的简洁性）
