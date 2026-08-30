# pi-redraw

无需重启 pi，即可强制完整重绘 TUI 界面。适用于终端显示错位、残影或内容未正确刷新的情况。

> Force a full [Pi](https://github.com/badlogic/pi-mono) TUI redraw without restarting Pi. Fixes garbled screens, stale text and misaligned rendering — press `F5` or run `/redraw`, and the running agent is never interrupted.

## 功能

- 使用 `F5` 强制全量重绘 pi 界面
- 支持 `/redraw` 命令触发
- 在支持增强键盘协议的终端中支持 `Ctrl+Shift+R`
- 重绘成功后显示 `TUI redrawn` 通知
- 不会中断正在运行的 Agent
- 不会修改编辑器内容、会话数据或当前滚动状态
- 不会重新加载扩展、技能、主题或上下文文件

## 使用方法

在 pi 中按下：

```text
F5
```

也可以在编辑器中执行：

```text
/redraw
```

插件内部调用 `TUI.requestRender(true)`，重置 pi 的渲染状态并立即安排一次完整重绘。

> 大多数使用传统键盘协议的终端无法区分 `Ctrl+Shift+R` 和 `Ctrl+R`，因此 `F5` 是默认且兼容性更好的快捷键。

## 安装

使用 pi 从 GitHub 全局安装：

```bash
pi install git:github.com/zxbdzh/pi-redraw
```

在已有 pi 会话中执行 `/reload`，或者重新启动一个 pi 会话。

卸载：

```bash
pi remove git:github.com/zxbdzh/pi-redraw
```

## 本地试用

克隆仓库后，在项目目录运行：

```bash
pi -e ./src/index.ts
```

## 开发

```bash
npm install
npm test
npm run typecheck
```

## 工作原理

pi 的扩展 UI API 没有直接暴露全局重绘方法。插件注册一个不占用界面空间的零高度 widget，通过 widget factory 获取当前 `TUI` 实例，并在触发快捷键或命令时调用：

```typescript
tui.requestRender(true);
```

参数 `true` 会清除已有渲染状态，使下一帧执行完整重绘。插件会在会话关闭、切换或重新加载时清理旧的 TUI 引用，避免操作失效的会话实例。

## 兼容性

需要 pi `0.84.3` 或更高版本。

## 许可证

[MIT](./LICENSE)
