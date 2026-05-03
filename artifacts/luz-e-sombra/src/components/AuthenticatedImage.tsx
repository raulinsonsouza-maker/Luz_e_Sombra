import { useEffect, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { Loader2, ImageOff } from "lucide-react";

type Props = {
  /** Caminho após /api, ex: /comunidade/3/imagem */
  apiPath: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

/**
 * Carrega imagem protegida por JWT (o &lt;img src&gt; não envia Authorization).
 */
export function AuthenticatedImage({ apiPath, alt, className = "", imgClassName = "w-full h-full object-cover" }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      setLoading(true);
      setFailed(false);
      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      try {
        const res = await apiFetchGet(apiPath);
        if (!res.ok) throw new Error("not ok");
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [apiPath]);

  const wrapStyle = "flex items-center justify-center bg-black/20 min-h-[120px]";

  if (loading) {
    return (
      <div className={`${wrapStyle} ${className}`}>
        <Loader2 className="w-7 h-7 animate-spin opacity-50" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (failed || !blobUrl) {
    return (
      <div className={`${wrapStyle} ${className}`}>
        <ImageOff className="w-8 h-8 opacity-35" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  return (
    <div className={className}>
      <img src={blobUrl} alt={alt} className={imgClassName} />
    </div>
  );
}
