import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const WIDGET_ID = "pi-redraw:capture";
const REDRAW_SHORTCUTS = ["f5", "ctrl+shift+r"] as const;

interface RedrawableTui {
  requestRender(force?: boolean): void;
}

export default function piRedraw(pi: ExtensionAPI): void {
  let activeTui: RedrawableTui | undefined;

  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    ctx.ui.setWidget(WIDGET_ID, (tui) => {
      const capturedTui = tui;
      activeTui = capturedTui;

      return {
        render: () => [],
        invalidate: () => {},
        dispose: () => {
          if (activeTui === capturedTui) activeTui = undefined;
        },
      };
    });
  });

  pi.on("session_shutdown", () => {
    activeTui = undefined;
  });

  const redraw = (ctx: ExtensionContext): void => {
    if (ctx.mode !== "tui") return;

    if (!activeTui) {
      ctx.ui.notify("Redraw unavailable: TUI is not ready", "warning");
      return;
    }

    activeTui.requestRender(true);
    ctx.ui.notify("TUI redrawn", "info");
  };

  pi.registerCommand("redraw", {
    description: "Force a full TUI redraw",
    handler: async (_args, ctx) => redraw(ctx),
  });

  for (const shortcut of REDRAW_SHORTCUTS) {
    pi.registerShortcut(shortcut, {
      description: "Force a full TUI redraw",
      handler: redraw,
    });
  }
}
