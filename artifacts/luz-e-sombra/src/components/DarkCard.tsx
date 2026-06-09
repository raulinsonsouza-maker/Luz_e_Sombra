import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DarkCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{
        background: "rgba(30,24,18,0.6)",
        border: "1px solid rgba(200,165,107,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      {children}
    </div>
  );
}
