import { useEffect, useState } from "react";
import { LP01_TIMER_MINUTES, LP01_TIMER_STORAGE_KEY } from "@/lib/lp01Config";
import { safeSessionStorage } from "@/lib/safeStorage";

function readDeadline(): number {
  try {
    const raw = safeSessionStorage().getItem(LP01_TIMER_STORAGE_KEY);
    const n = raw ? Number.parseInt(raw, 10) : NaN;
    if (Number.isFinite(n) && n > Date.now()) return n;
  } catch {
    /* ignore */
  }
  const deadline = Date.now() + LP01_TIMER_MINUTES * 60 * 1000;
  try {
    safeSessionStorage().setItem(LP01_TIMER_STORAGE_KEY, String(deadline));
  } catch {
    /* ignore */
  }
  return deadline;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Lp01ScarcityTimer({ label }: { label: string }) {
  const [deadline] = useState(readDeadline);
  const [left, setLeft] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft(Math.max(0, deadline - Date.now()));
    }, 250);
    return () => window.clearInterval(id);
  }, [deadline]);

  const totalSec = Math.floor(left / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  const expired = left <= 0;

  return (
    <div
      className="rounded-2xl px-5 py-4 text-center"
      style={{
        background: "rgba(200,165,107,0.08)",
        border: "1px solid rgba(200,165,107,0.28)",
      }}
    >
      <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "rgba(200,165,107,0.75)" }}>
        {expired ? "Condição especial — finalize agora" : label}
      </p>
      <p
        className="font-tan-mon-cheri tabular-nums"
        style={{ fontSize: "clamp(2rem, 6vw, 2.75rem)", color: "#f7f2ec", letterSpacing: "0.06em" }}
        aria-live="polite"
      >
        {expired ? "00:00" : `${pad(mm)}:${pad(ss)}`}
      </p>
    </div>
  );
}
