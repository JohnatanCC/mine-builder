import * as React from "react";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveLayoutProps {
  topBar: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  mobileBottomSheet?: React.ReactNode;
}

export function ResponsiveLayout({
  topBar,
  leftContent,
  rightContent,
  children,
  mobileBottomSheet,
}: ResponsiveLayoutProps) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-background">
        {/* TopBar fixo */}
        <div className="flex-none border-b border-border">
          {topBar}
        </div>

        {/* Canvas 3D */}
        <div className="relative flex-1 overflow-hidden">
          {children}
        </div>

        {/* BottomSheet Mobile */}
        {mobileBottomSheet && (
          <div className="flex-none">
            {mobileBottomSheet}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* TopBar */}
      <div className="flex-none border-b border-border">
        {topBar}
      </div>

      {/* Main Layout Desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        {leftContent && (
          <div className="flex-none border-r border-border bg-card">
            {leftContent}
          </div>
        )}

        {/* Canvas Central */}
        <div className="relative flex-1 overflow-hidden">
          {children}
        </div>

        {/* Right Panel */}
        {rightContent && (
          <div className="flex-none border-l border-border bg-card">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
