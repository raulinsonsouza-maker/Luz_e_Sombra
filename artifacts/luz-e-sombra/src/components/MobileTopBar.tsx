import { useLocation } from "wouter";
import { Bell, ChevronLeft } from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";

type Props = {
  titulo?: string;
  /** Não é mais exibido. O cabeçalho fica só com o nome da tela. */
  subtitulo?: string;
  voltar?: string;
  mostrarSino?: boolean;
};

export default function MobileTopBar({ titulo, voltar, mostrarSino = true }: Props) {
  const [, navigate] = useLocation();
  const { count: notiCount } = useNotificacoesCount();

  return (
    <header
      className="sticky top-0 z-40 md:hidden"
      style={{
        background: "#1f1710",
        borderBottom: "1px solid rgba(200,165,107,0.12)",
      }}
    >
      <div className="px-3 py-3 flex items-center gap-1 min-h-[52px]">
        {voltar && (
          <button
            type="button"
            onClick={() => navigate(voltar)}
            aria-label="Voltar"
            className="w-9 h-9 flex items-center justify-center shrink-0"
            style={{ color: "#c8a56b" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {titulo && (
          <h2 className="font-tan-mon-cheri text-xl leading-tight truncate" style={{ color: "#f7f2ec" }}>
            {titulo}
          </h2>
        )}
        <span className="flex-1" />
        {mostrarSino && (
          <button
            type="button"
            onClick={() => navigate("/notificacoes")}
            className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0"
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
    </header>
  );
}
