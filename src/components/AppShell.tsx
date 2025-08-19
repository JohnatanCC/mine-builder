// UPDATE: src/ui/shell/AppShell.tsx
import { UI } from "@/core/constants";
import * as React from "react";


type Props = { topBar?: React.ReactNode; left?: React.ReactNode; right?: React.ReactNode; bottom?: React.ReactNode; children: React.ReactNode; };

export const AppShell: React.FC<Props> = ({ topBar, left, right, bottom, children }) => {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Topbar */}
            <div className="flex items-center border-b bg-card/60 backdrop-blur-sm" style={{ height: UI.shell.topHeight }}>
                <div className="px-2 w-full">{topBar}</div>
            </div>

            {/* Main grid */}
            <div
                className="grid"
                style={{
                    height: `calc(100vh - ${UI.shell.topHeight + UI.shell.bottomHeight}px)`,
                    gridTemplateColumns: `${UI.shell.leftWidth}px 1fr ${UI.shell.rightWidth}px`,
                }}
            >
                <aside className="border-r bg-card">
                    {/* rolamento da toolbar não é necessário, mas mantém scroll se necessário */}
                    <div className="h-full overflow-y-auto">{left}</div>
                </aside>
                <main className="relative">{children}</main>
                <aside className="border-l bg-card">
                    <div className="h-full overflow-y-auto">{right}</div>
                </aside>
            </div>

            {/* Bottom */}
            <div className="border-t bg-card" style={{ height: UI.shell.bottomHeight }}>
                <div className="h-full w-full">{bottom}</div>
            </div>
        </div>
    );
};
