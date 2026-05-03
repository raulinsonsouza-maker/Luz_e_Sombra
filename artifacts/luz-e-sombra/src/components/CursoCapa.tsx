import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { BookOpen } from "lucide-react";

type Props = {
  cursoId: number;
  imagemUrl: string | null;
  titulo: string;
  /** altura da área da capa (Tailwind), ex: h-36 sm:h-44 */
  heightClass?: string;
  /** cantos arredondados no topo do card */
  roundedTop?: boolean;
};

export function CursoCapa({
  cursoId,
  imagemUrl,
  titulo,
  heightClass = "h-36 sm:h-44",
  roundedTop = true,
}: Props) {
  const round = roundedTop ? "rounded-t-2xl" : "rounded-2xl";
  const src = imagemUrl?.trim();

  if (!src) {
    return (
      <div
        className={`relative w-full ${heightClass} ${round} overflow-hidden flex items-center justify-center`}
        style={{
          background: "linear-gradient(145deg, rgba(200,165,107,0.22) 0%, rgba(30,24,18,0.95) 45%, #130f09 100%)",
          borderBottom: "1px solid rgba(200,165,107,0.12)",
        }}
      >
        <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 opacity-35" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  const isHttp = /^https?:\/\//i.test(src);

  return (
    <div className={`relative w-full ${heightClass} ${round} overflow-hidden shrink-0`}>
      {isHttp ? (
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0">
          <AuthenticatedImage
            apiPath={`/cursos/${cursoId}/capa`}
            alt={`Capa: ${titulo}`}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        </div>
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(19,15,9,0.92) 0%, rgba(19,15,9,0.25) 45%, transparent 100%)",
        }}
      />
    </div>
  );
}
