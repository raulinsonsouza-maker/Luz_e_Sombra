import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Save, User } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { CARD, C, INPUT_ST, type ShowMsg } from "./shared";

export function PerfilAdminTab({ showMsg }: { showMsg: ShowMsg }) {
  const { user, updateUser, refreshUser } = useAuth();
  const [nome, setNome] = useState(user?.nome ?? "");
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [fotoKey, setFotoKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNome(user?.nome ?? "");
  }, [user?.nome]);

  async function salvarNome(e: React.FormEvent) {
    e.preventDefault();
    const n = nome.trim();
    if (!n) {
      showMsg("erro", "Informe o nome que aparece nas publicações.");
      return;
    }
    setSalvando(true);
    try {
      const res = await apiFetch("/usuarios/me", {
        method: "PUT",
        body: JSON.stringify({ nome: n }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMsg("erro", (data as { error?: string }).error || "Não foi possível salvar.");
      } else {
        updateUser({ nome: n });
        showMsg("sucesso", "Nome atualizado. Novas publicações usam este nome.");
        await refreshUser();
      }
    } catch {
      showMsg("erro", "Não foi possível salvar.");
    }
    setSalvando(false);
  }

  async function enviarFoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMsg("erro", "Envie uma imagem (JPG, PNG ou WebP).");
      return;
    }
    setEnviandoFoto(true);
    try {
      const urlRes = await apiFetch("/usuarios/me/foto-perfil/upload-url", { method: "POST" });
      if (!urlRes.ok) throw new Error("url");
      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
      const up = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/jpeg" },
      });
      if (!up.ok) throw new Error("put");
      const save = await apiFetch("/usuarios/me/foto-perfil", {
        method: "PUT",
        body: JSON.stringify({ objectPath }),
      });
      if (!save.ok) throw new Error("save");
      updateUser({ fotoPerfil: objectPath });
      setFotoKey((k) => k + 1);
      showMsg("sucesso", "Foto atualizada.");
      await refreshUser();
    } catch {
      showMsg("erro", "Falha ao enviar a foto.");
    }
    if (fileRef.current) fileRef.current.value = "";
    setEnviandoFoto(false);
  }

  const temFoto = Boolean(user?.fotoPerfil);

  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-2xl p-5 space-y-5" style={CARD}>
        <div>
          <p className="text-sm font-semibold" style={{ color: C.text }}>Perfil na comunidade</p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>
            Nome e foto que aparecem nas suas publicações.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
            style={{ border: "1.5px solid rgba(200,165,107,0.35)", background: "rgba(200,165,107,0.08)" }}
          >
            {temFoto ? (
              <AuthenticatedImage
                key={fotoKey}
                apiPath="/usuarios/me/foto-perfil/view"
                alt="Foto de perfil"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8" style={{ color: C.gold }} />
            )}
          </div>
          <div className="space-y-2">
            <label
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold, opacity: enviandoFoto ? 0.6 : 1 }}
            >
              {enviandoFoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              {temFoto ? "Trocar foto" : "Enviar foto"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={enviandoFoto}
                onChange={(e) => void enviarFoto(e.target.files?.[0] || null)}
              />
            </label>
            <p className="text-[10px]" style={{ color: C.dim }}>JPG, PNG ou WebP</p>
          </div>
        </div>

        <form onSubmit={(e) => void salvarNome(e)} className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>
              Nome nas publicações
            </span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT_ST}
              placeholder="Ex: Letícia Galloni"
              maxLength={80}
            />
          </label>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
