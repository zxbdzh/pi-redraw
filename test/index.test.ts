import assert from "node:assert/strict";
import test from "node:test";

import piRedraw from "../src/index.ts";

type Handler = (...args: any[]) => unknown;

function setup() {
  const events = new Map<string, Handler>();
  const shortcuts = new Map<string, { handler: Handler; description?: string }>();
  let command: { handler: Handler; description?: string } | undefined;

  const pi = {
    on(event: string, handler: Handler) {
      events.set(event, handler);
    },
    registerShortcut(key: string, options: { handler: Handler; description?: string }) {
      shortcuts.set(key, options);
    },
    registerCommand(_name: string, options: { handler: Handler; description?: string }) {
      command = options;
    },
  };

  piRedraw(pi as never);

  return {
    events,
    shortcuts,
    getCommand: () => command,
  };
}

function createContext(mode: "tui" | "print" = "tui") {
  const notifications: Array<[string, string]> = [];
  let widgetFactory: ((tui: { requestRender(force?: boolean): void }) => unknown) | undefined;

  return {
    context: {
      mode,
      ui: {
        setWidget(_id: string, factory: typeof widgetFactory) {
          widgetFactory = factory;
        },
        notify(message: string, level: string) {
          notifications.push([message, level]);
        },
      },
    },
    notifications,
    getWidgetFactory: () => widgetFactory,
  };
}

test("registers F5 and Ctrl+Shift+R and confirms a full redraw", () => {
  const { events, shortcuts } = setup();
  const { context, notifications, getWidgetFactory } = createContext();
  const calls: boolean[] = [];

  events.get("session_start")?.({}, context);
  getWidgetFactory()?.({ requestRender: (force) => calls.push(force ?? false) });
  shortcuts.get("f5")?.handler(context);

  assert.deepEqual([...shortcuts.keys()], ["f5", "ctrl+shift+r"]);
  assert.deepEqual(calls, [true]);
  assert.deepEqual(notifications, [["TUI redrawn", "info"]]);
});

test("exposes the same redraw behavior through /redraw", () => {
  const { events, getCommand } = setup();
  const { context, notifications, getWidgetFactory } = createContext();
  const calls: boolean[] = [];

  events.get("session_start")?.({}, context);
  getWidgetFactory()?.({ requestRender: (force) => calls.push(force ?? false) });
  getCommand()?.handler("", context);

  assert.deepEqual(calls, [true]);
  assert.deepEqual(notifications, [["TUI redrawn", "info"]]);
});

test("warns when the TUI has not been captured", () => {
  const { shortcuts } = setup();
  const { context, notifications } = createContext();

  shortcuts.get("f5")?.handler(context);

  assert.deepEqual(notifications, [["Redraw unavailable: TUI is not ready", "warning"]]);
});

test("drops the previous TUI reference on session shutdown", () => {
  const { events, shortcuts } = setup();
  const { context, notifications, getWidgetFactory } = createContext();
  let redraws = 0;

  events.get("session_start")?.({}, context);
  getWidgetFactory()?.({ requestRender: () => redraws++ });
  events.get("session_shutdown")?.({}, context);
  shortcuts.get("f5")?.handler(context);

  assert.equal(redraws, 0);
  assert.equal(notifications.length, 1);
});

test("does not install UI state outside TUI mode", () => {
  const { events, shortcuts } = setup();
  const { context, notifications, getWidgetFactory } = createContext("print");

  events.get("session_start")?.({}, context);
  shortcuts.get("f5")?.handler(context);

  assert.equal(getWidgetFactory(), undefined);
  assert.deepEqual(notifications, []);
});
