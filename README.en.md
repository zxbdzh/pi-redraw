<div align="center">

# pi-redraw

[中文](README.md)

**Force a full Pi TUI redraw without restarting Pi.**

<sub>// The rescue key for garbled screens, artifacts and stale rendering — never interrupts the running agent</sub>

<br />

![Pi](https://img.shields.io/badge/Pi-%E2%89%A50.84.3-00f5ff)
![Trigger](https://img.shields.io/badge/trigger-F5%20%7C%20%2Fredraw-ffa500)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## The problem

While pi runs long tasks, the terminal occasionally garbles, leaves artifacts, or fails to refresh — previously the only option was quitting and reopening, losing the whole session. pi-redraw gives you one full redraw: the agent keeps running, nothing is lost.

## Features

- `F5` forces a full redraw (default, best compatibility)
- `/redraw` command
- `Ctrl+Shift+R` in terminals with the enhanced keyboard protocol
- Shows a `TUI redrawn` notification on success
- ❌ Never interrupts the running agent
- ❌ Never touches editor content, session data, or scroll position
- ❌ Never reloads extensions, skills, themes, or context files

## Usage

```text
F5
```

Or run in the editor:

```text
/redraw
```

> Most terminals using the legacy keyboard protocol cannot distinguish `Ctrl+Shift+R` from `Ctrl+R`, which is why `F5` is the default.

## Install

```bash
pi install git:github.com/zxbdzh/pi-redraw
```

Then `/reload` in an open session, or start a new one.

Uninstall:

```bash
pi remove git:github.com/zxbdzh/pi-redraw
```

### Try locally

```bash
pi -e ./src/index.ts
```

## How it works

Pi's extension UI API does not expose a global redraw method directly. The extension registers a zero-height widget that takes no screen space, obtains the current `TUI` instance through the widget factory, and calls:

```typescript
tui.requestRender(true);
```

The `true` argument clears the existing render state so the next frame performs a full redraw. Stale TUI references are cleaned up on session close, switch, or reload.

## Compatibility

Requires Pi `0.84.3` or newer.

## Development

```bash
npm install
npm test
npm run typecheck
```

## License

[MIT](./LICENSE)
