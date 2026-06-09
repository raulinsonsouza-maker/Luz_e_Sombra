import type { ReactNode } from "react";

export type AppPageWidth = "default" | "2xl" | "wide" | "xl";

const WIDTH_CLASS: Record<AppPageWidth, string> = {
  default: "max-w-lg",
  "2xl": "max-w-2xl",
  wide: "max-w-4xl",
  xl: "max-w-5xl",
};

type Props = {
  children: ReactNode;
  width?: AppPageWidth;
  forest?: boolean;
  warm?: boolean;
  className?: string;
  contentClassName?: string;
  withBottomNavPad?: boolean;
};

export default function AppPageShell({
  children,
  width = "default",
  forest = false,
  warm = false,
  className = "",
  contentClassName = "",
  withBottomNavPad = true,
}: Props) {
  const shellClass = forest
    ? "journey-forest-bg"
    : warm
      ? "app-dark-shell-warm"
      : "app-dark-shell";

  return (
    <div className={`min-h-screen ${withBottomNavPad ? "pb-28" : ""} ${shellClass} ${className}`}>
      <div className={`${WIDTH_CLASS[width]} mx-auto px-4 pt-6 ${contentClassName}`}>{children}</div>
    </div>
  );
}
