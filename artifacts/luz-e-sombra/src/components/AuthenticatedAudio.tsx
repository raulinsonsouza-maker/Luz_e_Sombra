import { useEffect, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { Loader2, MicOff } from "lucide-react";

type Props = {
  apiPath: string;
  className?: string;
};

export function AuthenticatedAudio({ apiPath, className = "" }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      setLoading(true);
      setFailed(false);
      setBlobUrl((prev) => {
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

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[48px] ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin opacity-50" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (failed || !blobUrl) {
    return (
      <div className={`flex items-center justify-center gap-2 min-h-[48px] text-xs ${className}`} style={{ color: "rgba(247,242,236,0.4)" }}>
        <MicOff className="w-4 h-4" style={{ color: "#c8a56b" }} />
        Áudio indisponível
      </div>
    );
  }

  return (
    <audio controls preload="metadata" src={blobUrl} className={className} style={{ width: "100%" }}>
      Seu navegador não reproduz áudio.
    </audio>
  );
}
