# pi-redraw

Force a complete pi TUI redraw without restarting pi or reloading the current
session. This is useful when terminal output is visually corrupted or leaves
stale content behind.

## Usage

Press `F5` in pi. On terminals with enhanced keyboard protocol support,
`Ctrl+Shift+R` is also available. You can also run `/redraw` from the editor.
The extension calls `TUI.requestRender(true)`, which resets pi's render state
and schedules an immediate full redraw. A `TUI redrawn` notification confirms
that the handler ran.

> Most legacy terminals cannot distinguish `Ctrl+Shift+R` from `Ctrl+R`, so
> `F5` is the portable default.

The redraw does not interrupt a running agent, change editor text, reload
extensions, or modify the session.

## Try locally

From this repository:

```bash
pi -e ./src/index.ts
```

## Install globally

Install the public Git package with pi:

```bash
pi install git:github.com/zxbdzh/pi-redraw
```

Run `/reload` in an existing pi session, or start a new session. To uninstall:

```bash
pi remove git:github.com/zxbdzh/pi-redraw
```

## Development

```bash
npm install
npm test
npm run typecheck
```

## Compatibility

Requires pi `0.84.3` or newer.
