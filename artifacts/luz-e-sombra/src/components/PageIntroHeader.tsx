/**
 * Cabeçalho padrão de página autenticada.
 * Eyebrow: text-xs tracking-[0.2em] uppercase | H1: font-tan-mon-cheri text-3xl md:text-4xl
 */
type Props = {
  eyebrow: string;
  titulo: string;
  subtitulo?: string;
  className?: string;
  size?: "default" | "compact";
  hiddenOnMobile?: boolean;
};

export default function PageIntroHeader({
  eyebrow,
  titulo,
  subtitulo,
  className,
  size = "default",
  hiddenOnMobile = false,
}: Props) {
  const titleSize = size === "compact" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
  const visibility = hiddenOnMobile ? "hidden md:block" : "";

  return (
    <div className={`${visibility} ${className ?? "mb-6"}`}>
      <p
        className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
        style={{ color: "rgba(200,165,107,0.5)" }}
      >
        {eyebrow}
      </p>
      <h1 className={`font-tan-mon-cheri ${titleSize} mb-1`} style={{ color: "#f7f2ec" }}>
        {titulo}
      </h1>
      {subtitulo && (
        <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>
          {subtitulo}
        </p>
      )}
    </div>
  );
}
