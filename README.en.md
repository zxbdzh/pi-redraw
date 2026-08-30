# pi-redraw

Force a full [Pi](https://github.com/badlogic/pi-mono) TUI redraw without restarting Pi. Useful when the terminal display gets garbled, leaves artifacts, or fails to refresh.

[中文](README.md)

## Features

- Press `F5` to force a full redraw of the Pi UI
- Also available as the `/redraw` command
- `Ctrl+Shift+R` works in terminals that support the enhanced keyboard protocol
- Shows a `TUI redrawn` notification on success
- Never interrupts the running agent
- Never touches editor content, session data, or scroll position
- Never reloads extensions, skills, themes, or context files

## Usage

Press in Pi:

```text
F5
```

Or run in the editor:

```text
/redraw
```

Internally the extension calls `TUI.requestRender(true)`, resetting Pi's render state and scheduling one full redraw immediately.

> Most terminals using the legacy keyboard protocol cannot distinguish `Ctrl+Shift+R` from `Ctrl+R`, which is why `F5` is the default and more compatible shortcut.

## Install

Install globally from GitHub inside Pi:

```bash
pi install git:github.com/zxbdzh/pi-redraw
```

Then run `/reload` in an open Pi session, or start a new one.

Uninstall:

```bash
pi remove git:github.com/zxbdzh/pi-redraw
```

## Try locally

Clone the repo and run from the project directory:

```bash
pi -e ./src/index.ts
```

## Development

```bash
npm install
npm test
npm run typecheck
```

## How it works

Pi's extension UI API does not expose a global redraw method directly. The extension registers a zero-height widget that takes no screen space, obtains the current `TUI` instance through the widget factory, and calls this when the hotkey or command fires:

```typescript
tui.requestRender(true);
```

The `true` argument clears the existing render state so the next frame performs a full redraw. The extension cleans up stale TUI references on session close, switch, or reload to avoid touching invalidated session instances.

## Compatibility

Requires Pi `0.84.3` or newer.

## License

[MIT](./LICENSE)
