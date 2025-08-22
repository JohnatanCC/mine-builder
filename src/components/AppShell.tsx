import * as React from "react";
import { UI_SHELL } from "@/core/constants";

type Props = {
  topBar?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  children: React.ReactNode;
  toolsOverlay?: React.ReactNode;
};

export const AppShell: React.FC<Props> = ({
  topBar,
  left,
  right,
  // bottom,
  children,
  toolsOverlay,
}) => {
  const topH = UI_SHELL.topHeight;
  // const bottomH = UI_SHELL.bottomHeight;
  const leftW = UI_SHELL.leftWidth;
  const rightW = UI_SHELL.rightWidth;
  return (
    <div className="h-screen w-screen overflow-hidden text-foreground">
      <div
        className="flex  items-center bg-background"
        style={{ height: topH }}
      >
        <div className="w-full px-2">{topBar}</div>
      </div>
      <div
        className="grid"
        style={{
          height: `100vh`,
          gridTemplateColumns: `${leftW}px 1fr ${rightW}px`,
        }}
      >
        <aside className="border-r bg-card">
          <div className="h-full overflow-y-auto">{left}</div>
        </aside>
        <main className="app-center-bg-transparent relative h-full w-full">
          {children}
          {toolsOverlay && (
            <div
              className="absolute left-3 top-3 z-30"

            >
              {toolsOverlay}
            </div>
          )}
        </main>
        <aside className="border-l bg-card">
          <div className="h-full overflow-y-auto">{right}</div>
        </aside>
      </div>
    </div>
  );
};
