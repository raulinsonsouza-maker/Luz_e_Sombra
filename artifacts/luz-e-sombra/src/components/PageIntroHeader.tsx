type Props = {
  eyebrow: string;
  titulo: string;
  subtitulo?: string;
  className?: string;
};

export default function PageIntroHeader({ eyebrow, titulo, subtitulo, className }: Props) {
  return (
    <div className={className ?? "mb-6"}>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
        {eyebrow}
      </p>
      <h1 className="font-tan-mon-cheri text-3xl mb-1" style={{ color: "#f7f2ec" }}>
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
