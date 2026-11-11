import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SRC = "/motion/lp-hero.mp4";

type Props = {
  className?: string;
  /** Altura mínima visual do player */
  aspectClassName?: string;
};

/**
 * Vídeo da LP: sempre tocando em loop.
 * Sem play/pause — só liga/desliga áudio.
 * Ao ligar o áudio, reinicia do começo.
 */
export default function LpHeroVideo({
  className = "",
  aspectClassName = "aspect-[9/16] sm:aspect-video",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    const play = async () => {
      try {
        await video.play();
      } catch {
        video.muted = true;
        try {
          await video.play();
        } catch {
          /* autoplay bloqueado */
        }
      }
    };
    void play();
  }, []);

  function toggleAudio() {
    const video = videoRef.current;
    if (!video) return;
    if (muted) {
      video.currentTime = 0;
      video.muted = false;
      setMuted(false);
      void video.play().catch(() => {
        video.muted = true;
        setMuted(true);
      });
    } else {
      video.muted = true;
      setMuted(true);
    }
  }

  return (
    <div className={`relative overflow-hidden bg-black ${aspectClassName} ${className}`}>
      <video
        ref={videoRef}
        src={SRC}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
      />
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={muted ? "Ligar áudio" : "Desligar áudio"}
        className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-95"
        style={{
          background: "rgba(15,12,9,0.72)",
          border: "1px solid rgba(200,165,107,0.35)",
          color: "#f7f2ec",
          backdropFilter: "blur(8px)",
        }}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? "Áudio" : "Mudo"}
      </button>
    </div>
  );
}
