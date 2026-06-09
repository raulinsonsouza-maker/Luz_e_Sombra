import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";

type Props = {
  to: string;
  label: string;
  className?: string;
  variant?: "default" | "compact";
};

export default function NavBackButton({ to, label, className, variant = "default" }: Props) {
  const [, navigate] = useLocation();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => navigate(to)}
        aria-label={label}
        className={
          className ??
          "w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        }
        style={{ background: "rgba(200,165,107,0.08)", color: "#c8a56b" }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={
        className ??
        "flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-100 opacity-90"
      }
      style={{ color: "rgba(200,165,107,0.65)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#c8a56b";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.65)";
      }}
    >
      <ChevronLeft className="w-4 h-4 shrink-0" />
      {label}
    </button>
  );
}
