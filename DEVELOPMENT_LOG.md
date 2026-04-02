# 开发日志 (Development Log)

本文档用于记录收纳小程序在开发过程中的每一次对话、文件改动及使用的组件。

---

## 2026-04-02 - 对话 1: 项目初始化

### **任务说明**
- 初始化 uni-app 项目基础结构，为收纳小程序奠定基础。

### **修改文件清单**
- `[manifest.json](file:///c:/Users/34719/Desktop/shouna/shouna/manifest.json)`：配置 AppID、应用名称、权限及多端编译设置。
- `[pages.json](file:///c:/Users/34719/Desktop/shouna/shouna/pages.json)`：定义页面路由及全局导航栏样式。
- `[App.vue](file:///c:/Users/34719/Desktop/shouna/shouna/App.vue)`：配置全局生命周期钩子及全局基础背景色。
- `[main.js](file:///c:/Users/34719/Desktop/shouna/shouna/main.js)`：初始化 Vue3 项目实例。
- `[uni.scss](file:///c:/Users/34719/Desktop/shouna/shouna/uni.scss)`：定义全局样式变量（主色、辅助色、文字大小、边距等）。
- `[pages/index/index.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/index/index.vue)`：创建首页基础布局，包含：
  - 搜索栏
  - 数据统计卡片
  - 空状态占位符
  - 开始收纳按钮

### **使用组件**
- **uni-app 原生组件**：`<view>`, `<text>`, `<image>`, `<icon>`, `<button>`。
- **样式方案**：使用 SCSS 进行组件化样式编写。

---

## 2026-04-02 - 对话 14: 实现消费统计页面

### **任务说明**
- 根据 `statistics.txt` 和设计图实现“消费统计”页面。
- 集成手绘风格的 SVG 图表（趋势图、环形图）。
- 实现多维度的消费概览与排行榜。

### **修改文件清单**
- `[pages.json](file:///c:/Users/34719/Desktop/shouna/shouna/pages.json)`：新增 `pages/statistics/statistics` 页面路由，配置自定义导航栏。
- `[pages/statistics/statistics.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/statistics/statistics.vue)`：创建消费统计页面，包含：
  - 自定义沉浸式导航栏。
  - 周期切换（周/月/年）功能。
  - Bento 风格的资产概览卡片。
  - SVG 手绘风趋势图与分类环形图。
  - “最贵物品 TOP 5”与“性价比排行”列表。
- `[components/tab-bar/tab-bar.vue](file:///c:/Users/34719/Desktop/shouna/shouna/components/tab-bar/tab-bar.vue)`：确保统计项的激活状态正确同步。

### **使用组件**
- **uni-app 原生组件**：`<view>`, `<text>`, `<image>`, `<scroll-view>`, `<svg>`。
- **uni-ui 扩展组件**：`<uni-icons>` (用于多种业务图标)。
- **自定义组件**：`<tab-bar>`。

### **待办事项**
- [x] 实现“消费统计”页面。
- [x] 实现“设置”页面。
- [x] 将物品页面布局修改为列表形式。
- [x] 引入 Pinia 全局状态管理并打通数据链路。
- [x] 完善首页“快捷操作”跳转与物品页参数化筛选。

---

## 2026-04-02 - 对话 18: 完善交互逻辑与参数化筛选

### **任务说明**
- 实现首页“快捷操作”四个按钮的点击跳转逻辑。
- 增强物品页面 (`items.vue`) 的筛选能力，支持从外部跳转并自动应用过滤（如按区域或标签）。
- 优化搜索框交互，增加清除按钮和活动筛选标记。

### **修改文件清单**
- `[pages/index/index.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/index/index.vue)`：
  - 完善 `handleAction` 方法，映射“标签筛选”、“区域查看”和“统计分析”到对应页面。
- `[pages/items/items.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/items/items.vue)`：
  - 在 `onLoad` 中解析 `area` 和 `tag` 参数。
  - 增加了 `active-filters` UI 组件，展示当前正在生效的外部过滤条件。
  - 优化搜索框，添加了 `close-filled` 图标以快速清除关键词。
  - 实现了 `clearFilter` 方法，重置所有筛选状态。

### **交互逻辑**
- **交互逻辑**：从“区域”页面点击某个区域卡片，现在会跳转到物品页并自动过滤出该区域的物品。
- **标签快捷键**：首页点击“标签筛选”会跳转到物品页并聚焦搜索。
- **搜索优化**：在物品页输入搜索词时，实时反馈并支持一键清空。
- **快捷操作跳转**：完善了首页“快捷操作”区域四个按钮的跳转逻辑。使用 `switchTab` 确保 Tab 页面的流畅切换，并通过 Pinia 状态同步实现了从首页跳转到物品页时的特定业务逻辑（如搜索聚焦提示）。

---

## 2026-04-02 - 对话 19: 实现添加自定义标签与区域功能

### **任务说明**
- 在添加物品页面实现动态新增标签和区域的功能。
- 确保新增的标签和区域能够持久化保存，并即时应用到当前表单。

### **修改文件清单**
- `[stores/item.js](file:///c:/Users/34719/Desktop/shouna/shouna/stores/item.js)`：
  - 更新 `state`：将 `tags` 和 `areas` 改为从本地缓存读取，支持持久化。
  - 新增 `addTag` 和 `addArea` Actions，处理去重逻辑。
  - 完善 `saveToStorage`，同步保存标签和区域列表。
- `[pages/add/add.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/add/add.vue)`：
  - 为“添加标签”和“添加区域”按钮绑定点击事件。
  - 调用 `uni.showModal` 的 `editable` 模式获取用户输入。
  - 成功添加后自动选中新创建的标签或区域。

### **交互逻辑**
- **即时反馈**：点击“+”号唤起原生输入弹窗，确认后新标签立即出现在列表末尾并处于选中状态。
- **持久化**：用户自定义的标签和区域会永久保存在本地，下次添加物品时可直接选择。

---

## 2026-04-02 - 对话 20: 实现物品保质期管理与过期提醒

### **任务说明**
- 增加物品的“生产日期”和“保质期”字段。
- 实现临期/过期物品的自动计算与视觉特殊标记。

### **修改文件清单**
- `[stores/item.js](file:///c:/Users/34719/Desktop/shouna/shouna/stores/item.js)`：新增 `expiringItems` getter，自动筛选 30 天内过期的物品。
- `[pages/add/add.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/add/add.vue)`：增加生产日期选择器（Picker）和保质期天数输入框。
- `[pages/items/items.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/items/items.vue)`：在物品列表项中增加过期状态标签（`expiry-badge`），已过期显示红色，临期显示橙色。
- `[pages/detail/detail.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/detail/detail.vue)`：新增“保质期详情卡片”，包含进度条、具体过期日期和剩余天数提醒。

### **业务逻辑**
- **状态判定**：
  - 剩余天数 < 0：**已过期**（红色标记）。
  - 0 ≤ 剩余天数 ≤ 30：**临期**（橙色标记）。
- **进度可视化**：详情页通过进度条展示保质期消耗比例，颜色随状态自动切换。

---

## 2026-04-02 - 对话 21: 实现统计页面时间维度切换逻辑

### **任务说明**
- 实现统计页面（`statistics.vue`）中“周/月/年”切换的业务逻辑。
- 确保各项数据指标（总花费、日均支出、类目占比、排行榜）随时间维度动态更新。

### **修改文件清单**
- `[pages/statistics/statistics.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/statistics/statistics.vue)`：
  - 新增 `filteredItemsByTime` 计算属性，根据 `buyDate` 过滤出最近 7天/30天/365天 的物品。
  - 重构所有数据指标（`totalValueByTime`, `averageByTime`, `categoryData`, `topExpensiveItems`, `costPerformanceItems`）使其基于过滤后的数据集。
  - 更新 UI 文本显示，动态适配“周总花费”、“月总花费”等标签。
  - 模拟了周期性趋势对比逻辑（`trendValue`），支持增长/下降的视觉反馈。

### **交互逻辑**
- **动态更新**：点击顶部切换按钮时，下方所有卡片数据、环形图占比以及排行榜列表会立即响应并重新计算。
- **智能适配**：在“年”视图下，平均支出自动切换为“月均”，而在“周/月”视图下保持为“日均”，更符合财务统计习惯。

---

## 2026-04-02 - 对话 17: 引入 Pinia 全局状态管理

### **任务说明**
- 引入 Pinia 状态管理库，解决页面间数据孤立的问题。
- 实现数据的本地持久化存储，确保关闭小程序后数据不丢失。
- 重构首页、列表页、详情页和添加页，使其能够共享同一份数据源。

### **修改文件清单**
- `[main.js](file:///c:/Users/34719/Desktop/shouna/shouna/main.js)`：集成 Pinia 插件。
- `[stores/item.js](file:///c:/Users/34719/Desktop/shouna/shouna/stores/item.js)`：创建核心数据仓库，包含物品增删改查逻辑、持久化逻辑及统计计算（Getters）。
- `[pages/add/add.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/add/add.vue)`：重构为 `script setup` 模式，对接 Store 实现物品保存。
- `[pages/items/items.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/items/items.vue)`：重构为 `script setup` 模式，动态从 Store 获取并筛选物品列表。
- `[pages/index/index.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/index/index.vue)`：重构为 `script setup` 模式，实时展示总物品数、总价值等统计指标，并显示“最近收纳”列表。
- `[pages/detail/detail.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/detail/detail.vue)`：重构为 `script setup` 模式，根据 ID 动态渲染物品详情，并计算“日均成本”和“生命周期”进度。
- `[pages/area/area.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/area/area.vue)`：重构为 `script setup` 模式，动态统计各区域物品数量并实现点击跳转过滤。
- `[pages/statistics/statistics.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/statistics/statistics.vue)`：重构为 `script setup` 模式，基于真实数据动态生成消费排行榜和类目占比。

### **技术决策**
- **数据持久化**：使用 `uni.setStorageSync` 在 `itemStore` 的 actions 中同步数据到本地。
- **动态统计**：利用 Pinia 的 `getters` 实时计算资产总额和使用天数，确保 UI 数据的一致性。
- **代码规范**：全面转向 Vue 3 的 `script setup` 语法，代码更简洁且逻辑更聚合。

### **使用组件**
- **库**：`pinia`。
- **自定义组件**：`<tab-bar>`。

---

## 2026-04-02 - 对话 16: 物品页面布局重构

### **任务说明**
- 根据用户反馈，将“全部物品”页面的网格布局修改为垂直列表形式（一条条展示）。
- 提升列表项的信息密度，增加标签展示和价格预览。

### **修改文件清单**
- `[pages/items/items.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/items/items.vue)`：
  - 重构 `template`：由 `grid` 布局改为 `list` 布局，每个物品项改为横向排列。
  - 更新 `style`：
    - 使用了 `flex` 布局实现左图右文的结构。
    - 增加了物品标签（如“日常使用”）的视觉样式。
    - 添加了右侧箭头指引，增强可点击感。
    - 优化了点击态反馈。

### **使用组件**
- **uni-app 原生组件**：`<view>`, `<text>`, `<image>`, `<scroll-view>`。
- **uni-ui 扩展组件**：`<uni-icons>`。
- **自定义组件**：`<tab-bar>`。

---

## 2026-04-02 - 对话 17: 运行环境兼容性修复与布局优化

### **任务说明**
- 修复 HBuilderX 无法识别项目类型导致不能运行到微信开发者工具的问题。
- 修复样式变量未定义导致的编译错误。
- 优化页面总体宽度与 TabBar 图标显示。
- 解决 TabBar 切换时的白屏闪烁问题。

### **修改文件清单**
- `[manifest.json](file:///c:/Users/34719/Desktop/shouna/shouna/manifest.json)`：分析项目目录层级，明确需在内层 `shouna` 文件夹打开项目以符合识别要求。
- `[uni.scss](file:///c:/Users/34719/Desktop/shouna/shouna/uni.scss)`：
  - 新增缺失的全局变量 `$shouna-surface-container-highest`。
  - 将全局内边距 `$shouna-page-padding` 从 `64rpx` 调整为 `48rpx`，释放横向空间。
- `[pages/index/index.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/index/index.vue)`：
  - 增加 `overflow-x: hidden` 防止溢出。
  - 重构 `scroll-view` 布局，提升不同平台渲染稳定性。
- `[components/tab-bar/tab-bar.vue](file:///c:/Users/34719/Desktop/shouna/shouna/components/tab-bar/tab-bar.vue)`：
  - 修复 `tabs` 定义中缺失/错误的图标名称（`category-filled` -> `list`, `layers-filled` -> `location-filled`）。
  - 将页面切换逻辑从 `uni.reLaunch` 修改为 `uni.switchTab`，解决切换白屏问题。
- `[pages.json](file:///c:/Users/34719/Desktop/shouna/shouna/pages.json)`：
  - 正式配置原生 `tabBar` 路由，支持 `switchTab` 机制，提升切换性能。
- **跨页面状态同步**：在所有 Tab 页面（首页、物品、区域、统计、设置）的 `onShow` 生命周期中调用 `uni.hideTabBar()`，隐藏原生 TabBar，并通过 Pinia 状态同步实现了跨页面的业务逻辑联动（如从首页快捷跳转到物品页并自动聚焦搜索）。
- **区域管理功能重构 (参考 UI 风格)**：
  - 重构了 `itemStore` 的区域存储结构，从单一字符串数组升级为包含 `name`、`icon`、`color` 的对象数组。
  - 在“我的区域”页面实现了全新的“新建区域”弹窗，包含名称输入、标识色选择（7种预设色）和关联图标选择（8种常用图标），完全匹配用户提供的 UI 参考图风格。
  - 实现了区域的编辑与删除功能。点击区域卡片右上角的“编辑”图标可打开编辑弹窗，支持修改所有属性，并同步更新该区域下的所有物品关联。
  - 适配了物品添加页面的区域选择逻辑，确保数据链路的连贯性。
- **全局布局一致性优化**：
  - 统一所有 Tab 页面的结构，引入 `.content-wrapper` 容器管理页面内边距。
  - 在所有主页面容器上增加 `overflow-x: hidden`，彻底解决横向溢出导致的视觉错误。
  - 修复添加物品页面（[add.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/add/add.vue)）的错位与宽度溢出问题，统一导航栏适配与内容边距。
  - 修复统计页面与设置页面的 `scroll-view` 布局，解决滚动条位置偏移问题，确保在不同机型下的滚动体验一致。
- **导航栏样式统一**：统一了所有页面的顶部导航栏样式，将 `header-nav` 统一为 `nav-bar`，统一使用 `var(--status-bar-height)` 处理状态栏适配，解决了统计页面搜索图标被微信胶囊按钮遮挡的问题。

### **使用组件**
- **uni-app 原生组件**：`<view>`, `<text>`, `<scroll-view>`, `<tabBar>` 配置。
- **uni-ui 扩展组件**：`<uni-icons>`。
- **自定义组件**：`<tab-bar>`。

### **任务说明**
- 根据 `setting.txt` 和设计图实现“设置”页面。
- 构建用户个人资料卡片、系统功能列表及个性化 Bento 布局。
- 添加数据清理的安全确认弹窗。

### **修改文件清单**
- `[pages.json](file:///c:/Users/34719/Desktop/shouna/shouna/pages.json)`：新增 `pages/setting/setting` 页面路由，配置自定义导航栏。
- `[pages/setting/setting.vue](file:///c:/Users/34719/Desktop/shouna/shouna/pages/setting/setting.vue)`：创建设置页面，包含：
  - 用户头像与微信号展示。
  - “账号与数据”功能组（备份、导出、恢复、清空）。
  - “个性化”Bento 风格设置（主题、布局、预算）。
  - “其他”常规信息列表（隐私、关于、反馈）。
  - 底部品牌 Slogan：ORGANIZE WITH INTENTION。

### **使用组件**
- **uni-app 原生组件**：`<view>`, `<text>`, `<image>`, `<scroll-view>`。
- **uni-ui 扩展组件**：`<uni-icons>`。
- **自定义组件**：`<tab-bar>`。
