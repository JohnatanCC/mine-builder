import type { ReactNode } from "react";


export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {children}
      </div>
    </div>
  );
}
