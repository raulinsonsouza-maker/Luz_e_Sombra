import { useLocation } from "wouter";
import { Bell, ChevronLeft } from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";
import LogoPortal from "@/components/LogoPortal";

type Props = {
  titulo?: string;
  /** Linha auxiliar abaixo do título (ex.: progresso do quiz). */
  subtitulo?: string;
  voltar?: string;
  mostrarSino?: boolean;
};

export default function MobileTopBar({
  titulo,
  subtitulo,
  voltar,
  mostrarSino = true,
}: Props) {
  const [, navigate] = useLocation();
  const { count: notiCount } = useNotificacoesCount();

  return (
    <header
      className="sticky top-0 z-40 md:hidden"
      style={{
        background: "linear-gradient(180deg, #1a1208 0%, #1f1710 100%)",
        borderBottom: "1px solid rgba(200,165,107,0.14)",
      }}
    >
      <div className="px-3 py-2.5 flex items-center gap-2 min-h-[56px]">
        {voltar ? (
          <button
            type="button"
            onClick={() => navigate(voltar)}
            aria-label="Voltar"
            className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full"
            style={{
              color: "#c8a56b",
              background: "rgba(200,165,107,0.08)",
              border: "1px solid rgba(200,165,107,0.16)",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Início"
            className="shrink-0 flex items-center"
          >
            <LogoPortal className="h-8 w-auto" />
          </button>
        )}

        {voltar && (
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Início"
            className="shrink-0 flex items-center"
          >
            <LogoPortal className="h-7 w-auto" />
          </button>
        )}

        {(titulo || subtitulo) && (
          <>
            <span
              className="w-px h-7 shrink-0 self-center"
              style={{ background: "rgba(200,165,107,0.28)" }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              {titulo && (
                <h2
                  className="font-tan-mon-cheri text-[1.15rem] leading-tight truncate"
                  style={{ color: "#f7f2ec" }}
                >
                  {titulo}
                </h2>
              )}
              {subtitulo && (
                <p
                  className="text-[10px] leading-tight truncate mt-0.5"
                  style={{ color: "rgba(200,165,107,0.65)" }}
                >
                  {subtitulo}
                </p>
              )}
            </div>
          </>
        )}

        {!titulo && !subtitulo && <span className="flex-1" />}

        {mostrarSino && (
          <button
            type="button"
            onClick={() => navigate("/notificacoes")}
            className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 ml-auto"
            style={{
              background: "rgba(200,165,107,0.08)",
              border: "1px solid rgba(200,165,107,0.15)",
            }}
            title="Notificações"
          >
            <Bell className="w-4 h-4" style={{ color: "rgba(200,165,107,0.75)" }} />
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
    </header>
  );
}
