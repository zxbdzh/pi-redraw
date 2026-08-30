<div align="center">

# pi-redraw

[English](README.en.md)

**无需重启 pi，一键强制完整重绘 TUI 界面。**

<sub>// 终端花屏、残影、刷新错乱时的急救键 · 不打断正在运行的 Agent</sub>

<br />

![Pi](https://img.shields.io/badge/Pi-%E2%89%A50.84.3-00f5ff)
![Trigger](https://img.shields.io/badge/trigger-F5%20%7C%20%2Fredraw-ffa500)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 它解决什么

pi 跑长任务时终端偶尔花屏、残影、内容没刷新——以前只能退出重开，会话上下文全丢。pi-redraw 提供一次完整重绘，Agent 不中断，什么都不丢。

## 功能

- `F5` 强制全量重绘（默认，兼容性最好）
- `/redraw` 命令触发
- 支持增强键盘协议的终端中可用 `Ctrl+Shift+R`
- 重绘成功显示 `TUI redrawn` 通知
- ❌ 不会中断正在运行的 Agent
- ❌ 不会修改编辑器内容、会话数据或当前滚动状态
- ❌ 不会重新加载扩展、技能、主题或上下文文件

## 使用方法

```text
F5
```

或在编辑器中执行：

```text
/redraw
```

> 大多数使用传统键盘协议的终端无法区分 `Ctrl+Shift+R` 和 `Ctrl+R`，因此 `F5` 是默认快捷键。

## 安装

```bash
pi install git:github.com/zxbdzh/pi-redraw
```

在已有 pi 会话中执行 `/reload`，或者重新启动一个 pi 会话。

卸载：

```bash
pi remove git:github.com/zxbdzh/pi-redraw
```

### 本地试用

```bash
pi -e ./src/index.ts
```

## 工作原理

pi 的扩展 UI API 没有直接暴露全局重绘方法。插件注册一个不占用界面空间的零高度 widget，通过 widget factory 获取当前 `TUI` 实例，并在触发时调用：

```typescript
tui.requestRender(true);
```

参数 `true` 清除已有渲染状态，使下一帧执行完整重绘。插件会在会话关闭、切换或重新加载时清理旧的 TUI 引用，避免操作失效的会话实例。

## 兼容性

需要 pi `0.84.3` 或更高版本。

## 开发

```bash
npm install
npm test
npm run typecheck
```

## 许可证

[MIT](./LICENSE)
