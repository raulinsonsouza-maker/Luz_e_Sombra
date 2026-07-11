import { useLocation } from "wouter";
import { Bell } from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";
import { LP_PORTAL_NAME } from "@/lib/lpConfig";

type Props = {
  titulo?: string;
  subtitulo?: string;
  mostrarSino?: boolean;
};

export default function MobileTopBar({ titulo, subtitulo, mostrarSino = true }: Props) {
  const [, navigate] = useLocation();
  const { count: notiCount } = useNotificacoesCount();

  return (
    <header
      className="sticky top-0 z-40 md:hidden"
      style={{
        background: "linear-gradient(160deg, #1a1208 0%, #1e1812 60%, #2f251b 100%)",
        borderBottom: "1px solid rgba(200,165,107,0.12)",
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 min-w-0 text-left group shrink"
          >
            <div
              className="w-px h-6 shrink-0 transition-opacity group-hover:opacity-100 opacity-60"
              style={{ background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }}
            />
            <span className="font-tan-mon-cheri text-base tracking-wide truncate" style={{ color: "#f7f2ec" }}>
              {LP_PORTAL_NAME}
            </span>
          </button>
          {mostrarSino && (
            <button
              type="button"
              onClick={() => navigate("/notificacoes")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all"
              style={{
                background: "rgba(200,165,107,0.08)",
                border: "1px solid rgba(200,165,107,0.15)",
              }}
              title="Notificações"
            >
              <Bell className="w-4 h-4" style={{ color: "rgba(200,165,107,0.65)" }} />
              {notiCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-0.5"
                  style={{ background: "#c8a56b", color: "#130f09" }}
                >
                  {notiCount > 99 ? "99+" : notiCount}
                </span>
              )}
            </button>
          )}
        </div>
        {(titulo || subtitulo) && (
          <div className="mt-4 pl-1">
            {titulo && (
              <h2 className="font-tan-mon-cheri text-xl leading-tight mb-0.5" style={{ color: "#f7f2ec" }}>
                {titulo}
              </h2>
            )}
            {subtitulo && (
              <p className="text-xs leading-snug" style={{ color: "rgba(247,242,236,0.45)" }}>
                {subtitulo}
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
