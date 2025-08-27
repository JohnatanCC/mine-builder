import * as React from "react";
import { UI_SHELL } from "@/core/constants";

type Props = {
  topBar?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  children: React.ReactNode;
};

export const AppShell: React.FC<Props> = ({
  topBar,
  left,
  right,
  // bottom,
  children,
}) => {
  const topH = UI_SHELL.topHeight;
  // const bottomH = UI_SHELL.bottomHeight;
  const leftW = UI_SHELL.leftWidth;
  const rightW = UI_SHELL.rightWidth;
  return (
    <div className="h-screen w-screen overflow-hidden text-foreground bg-background">
      <div
        className="flex items-center bg-background border-b"
        style={{ height: topH }}
      >
        <div className="w-full">{topBar}</div>
      </div>
      <div
        className="grid"
        style={{
          height: `calc(100vh - ${topH}px)`,
          gridTemplateColumns: `${leftW}px 1fr ${rightW}px`,
        }}
      >
        <aside className="border-r bg-card">
          <div className="h-full overflow-y-auto">{left}</div>
        </aside>
        <main className="relative h-full w-full">
          {children}
        </main>
        <aside className="border-l bg-card">
          <div className="h-full overflow-y-auto">{right}</div>
        </aside>
      </div>
    </div>
  );
};
