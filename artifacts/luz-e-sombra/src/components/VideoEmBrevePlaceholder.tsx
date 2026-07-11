import { PlayCircle } from "lucide-react";

interface Props {
  titulo?: string;
  descricao?: string;
  compact?: boolean;
}

export function VideoEmBrevePlaceholder({
  titulo = "Vídeo em breve",
  descricao = "Estamos preparando o conteúdo em vídeo. Em breve ele estará disponível aqui.",
  compact = false,
}: Props) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-3 text-center px-6 ${
        compact ? "py-8 rounded-xl" : "aspect-video rounded-xl"
      }`}
      style={{
        background: "rgba(200,165,107,0.05)",
        border: "1px solid rgba(200,165,107,0.12)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.18)" }}
      >
        <PlayCircle className="w-6 h-6" style={{ color: "rgba(200,165,107,0.55)" }} />
      </div>
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: "rgba(247,242,236,0.65)" }}>
          {titulo}
        </p>
        <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(247,242,236,0.38)" }}>
          {descricao}
        </p>
      </div>
    </div>
  );
}
