import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { profilePhotoViewResponseIsImageBody } from "@/lib/profilePhotoView";
import {
  User, Calendar, Lock, CheckCircle, AlertCircle, Zap, Flame, Target,
  Star, Camera, Loader2, Sparkles, ArrowRight, Edit2, X, Save, KeyRound,
} from "lucide-react";

interface Progresso {
  xp: number;
  nivel: number;
  nomeNivel: string;
  xpNoNivel: number;
  xpParaProximo: number;
  streakDias: number;
  melhorStreak: number;
  missoes: { concluida: boolean }[];
}

function formatarData(iso: string) {
  if (!iso) return "Não informada";
  try {
    const [y, m, d] = iso.split("-");
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
  } catch { return iso; }
}

export default function MeuPerfilPage() {
  const [, navigate] = useLocation();
  const { user, updateUser } = useAuth();

  // ── Edit mode ──────────────────────────────────────────────────────────────
  const [editando, setEditando] = useState(false);

  // ── Form state (only mutated in edit mode) ─────────────────────────────────
  const [nome, setNome] = useState(user?.nome ?? "");
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento ?? "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // ── Status ─────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progresso, setProgresso] = useState<Progresso | null>(null);

  // ── Photo ──────────────────────────────────────────────────────────────────
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (fotoUrl?.startsWith("blob:")) URL.revokeObjectURL(fotoUrl);
      if (fotoPreview?.startsWith("blob:")) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoUrl, fotoPreview]);

  useEffect(() => {
    buscarProgresso();
    buscarFoto();
  }, []);

  // keep form in sync if user object updates from outside
  useEffect(() => {
    if (!editando) {
      setNome(user?.nome ?? "");
      setDataNascimento(user?.dataNascimento ?? "");
    }
  }, [user, editando]);

  async function buscarProgresso() {
    try {
      const res = await apiFetch("/gamificacao/progresso");
      if (res.ok) setProgresso(await res.json());
    } catch {}
  }

  async function buscarFoto() {
    try {
      const res = await apiFetch("/usuarios/me/foto-perfil/view");
      if (!profilePhotoViewResponseIsImageBody(res)) return;
      const blob = await res.blob();
      if (blob.size === 0) return;
      setFotoUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {}
  }

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewBlobUrl = URL.createObjectURL(file);
    setFotoPreview(previewBlobUrl);
    setUploadingFoto(true);
    setErrorMsg(null);
    try {
      const urlRes = await apiFetch("/usuarios/me/foto-perfil/upload-url", { method: "POST" });
      if (!urlRes.ok) throw new Error();
      const { uploadURL, objectPath } = await urlRes.json();
      await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/jpeg" } });
      const saveRes = await apiFetch("/usuarios/me/foto-perfil", { method: "PUT", body: JSON.stringify({ objectPath }) });
      if (saveRes.ok) {
        updateUser({ fotoPerfil: objectPath });
        showSuccess("Foto de perfil atualizada!");
        await buscarFoto();
        URL.revokeObjectURL(previewBlobUrl);
        setFotoPreview(null);
      } else throw new Error();
    } catch {
      setErrorMsg("Erro ao fazer upload da foto. Tente novamente.");
      URL.revokeObjectURL(previewBlobUrl);
      setFotoPreview(null);
    }
    setUploadingFoto(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function iniciarEdicao() {
    setNome(user?.nome ?? "");
    setDataNascimento(user?.dataNascimento ?? "");
    setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
    setErrorMsg(null); setSuccessMsg(null);
    setEditando(true);
  }

  function cancelarEdicao() {
    setNome(user?.nome ?? "");
    setDataNascimento(user?.dataNascimento ?? "");
    setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
    setErrorMsg(null);
    setEditando(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null); setErrorMsg(null);

    if (novaSenha && novaSenha !== confirmarSenha) {
      setErrorMsg("A nova senha e a confirmação não coincidem.");
      return;
    }

    const body: Record<string, string> = {};
    if (nome.trim() !== (user?.nome ?? "").trim()) body.nome = nome.trim();
    if (dataNascimento !== (user?.dataNascimento ?? "")) body.dataNascimento = dataNascimento;
    if (novaSenha) { body.senhaAtual = senhaAtual; body.novaSenha = novaSenha; }

    if (Object.keys(body).length === 0) {
      setErrorMsg("Nenhuma alteração detectada.");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch("/usuarios/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar perfil.");
      } else {
        updateUser(data);
        showSuccess("Perfil atualizado com sucesso!");
        setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
        setEditando(false);
      }
    } catch { setErrorMsg("Erro de conexão. Tente novamente."); }
    setSaving(false);
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  const primeiroNome = (user?.nome || "Usuário").split(" ")[0];
  const xpPct = progresso ? Math.min(100, Math.round((progresso.xpNoNivel / progresso.xpParaProximo) * 100)) : 0;
  const missoesConc = progresso?.missoes.filter(m => m.concluida).length ?? 0;
  const avatarSrc = fotoPreview || fotoUrl;

  const inputSt: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(200,165,107,0.3)",
    color: "#f7f2ec",
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* ── Profile hero ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.2), rgba(156,119,66,0.1))",
                border: "2px solid rgba(200,165,107,0.4)",
                boxShadow: "0 0 30px rgba(200,165,107,0.15)",
              }}
            >
              {uploadingFoto
                ? <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
                : avatarSrc
                  ? <img src={avatarSrc} alt="Foto de perfil" className="w-full h-full object-cover" />
                  : <span className="font-tan-mon-cheri text-3xl" style={{ color: "#c8a56b" }}>{primeiroNome[0]?.toUpperCase() ?? "U"}</span>
              }
            </div>

            {/* Camera — always accessible */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingFoto}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", border: "2px solid #130f09" }}
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5" style={{ color: "#1a1208" }} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </div>

          <h1 className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>{primeiroNome}</h1>
          {user?.username && (
            <p className="text-xs mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>@{user.username}</p>
          )}
          {progresso && (
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)" }}>
                <span className="text-[9px] font-bold" style={{ color: "#1a1208" }}>{progresso.nivel}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: "#c8a56b" }}>Nível {progresso.nivel} · {progresso.nomeNivel}</span>
            </div>
          )}
        </div>

        {/* ── Quem Sou Eu — card destaque ──────────────────────────────────── */}
        <button
          onClick={() => navigate("/quem-sou-eu")}
          className="w-full mb-6 rounded-3xl overflow-hidden relative transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, rgba(200,165,107,0.2) 0%, rgba(156,119,66,0.1) 50%, rgba(30,24,18,0.9) 100%)",
            border: "1px solid rgba(200,165,107,0.4)",
            boxShadow: "0 8px 32px rgba(200,165,107,0.15), inset 0 1px 0 rgba(200,165,107,0.15)",
          }}
        >
          {/* Decorative glow blob */}
          <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80, borderRadius: "50%", background: "#c8a56b", opacity: 0.08, filter: "blur(24px)", pointerEvents: "none" }} />

          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(200,165,107,0.35), rgba(156,119,66,0.18))",
                  border: "1px solid rgba(200,165,107,0.4)",
                  boxShadow: "0 4px 16px rgba(200,165,107,0.2)",
                }}
              >
                <Sparkles className="w-6 h-6" style={{ color: "#c8a56b" }} />
              </div>

              {/* Text */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                  Análise Integrada
                </p>
                <p className="font-tan-mon-cheri text-xl mb-1" style={{ color: "#f7f2ec" }}>
                  Dossiê de Vida
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                  Numerologia · Traço de Caráter · Ano Pessoal
                </p>
              </div>

              {/* Arrow */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.2)" }}
              >
                <ArrowRight className="w-4 h-4" style={{ color: "#c8a56b" }} />
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, rgba(200,165,107,0.4), transparent)" }} />
        </button>

        {/* ── Stats grid ───────────────────────────────────────────────────── */}
        {progresso && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl p-4" style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.15)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: "#c8a56b" }} />
                <span className="text-xs" style={{ color: "rgba(200,165,107,0.6)" }}>XP Total</span>
              </div>
              <p className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>{progresso.xp}</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${xpPct}%`, background: "linear-gradient(90deg, #9c7742, #c8a56b)" }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: "rgba(247,242,236,0.3)" }}>{progresso.xpNoNivel}/{progresso.xpParaProximo} XP no nível</p>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "rgba(232,108,43,0.07)", border: "1px solid rgba(232,108,43,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4" style={{ color: "#e86c2b" }} />
                <span className="text-xs" style={{ color: "rgba(232,108,43,0.7)" }}>Sequência</span>
              </div>
              <p className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>{progresso.streakDias} dias</p>
              <p className="text-[10px]" style={{ color: "rgba(247,242,236,0.3)" }}>Melhor: {progresso.melhorStreak} dias</p>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "rgba(93,185,122,0.07)", border: "1px solid rgba(93,185,122,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" style={{ color: "#5db97a" }} />
                <span className="text-xs" style={{ color: "rgba(93,185,122,0.7)" }}>Missões hoje</span>
              </div>
              <p className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>{missoesConc}/{progresso.missoes.length}</p>
              <p className="text-[10px]" style={{ color: "rgba(247,242,236,0.3)" }}>concluídas</p>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "rgba(91,155,213,0.07)", border: "1px solid rgba(91,155,213,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4" style={{ color: "#5b9bd5" }} />
                <span className="text-xs" style={{ color: "rgba(91,155,213,0.7)" }}>Próximo nível</span>
              </div>
              <p className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>{progresso.xpParaProximo - progresso.xpNoNivel}</p>
              <p className="text-[10px]" style={{ color: "rgba(247,242,236,0.3)" }}>XP restantes</p>
            </div>
          </div>
        )}

        {/* ── Toast messages ───────────────────────────────────────────────── */}
        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
            style={{ background: "rgba(93,185,122,0.1)", border: "1px solid rgba(93,185,122,0.3)", color: "#5db97a" }}>
            <CheckCircle className="w-4 h-4 shrink-0" />{successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171" }}>
            <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
          </div>
        )}

        {/* ── READ MODE ────────────────────────────────────────────────────── */}
        {!editando && (
          <div className="space-y-3">
            {/* Dados pessoais — read only */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
              {/* Section header with edit button */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: "#c8a56b" }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Dados Pessoais</span>
                </div>
                <button
                  onClick={iniciarEdicao}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)", color: "#c8a56b" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(200,165,107,0.08)")}
                  title="Editar perfil"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>

              {/* Name row */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.06)" }}>
                <p className="text-xs font-semibold" style={{ color: "rgba(247,242,236,0.35)" }}>Nome completo</p>
                <p className="text-sm font-medium" style={{ color: "#f7f2ec" }}>{user?.nome || "—"}</p>
              </div>

              {/* Username row */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.06)" }}>
                <p className="text-xs font-semibold" style={{ color: "rgba(247,242,236,0.35)" }}>Usuário</p>
                <p className="text-sm" style={{ color: "rgba(200,165,107,0.7)" }}>@{user?.username}</p>
              </div>

              {/* Birth date row */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(200,165,107,0.4)" }} />
                  <p className="text-xs font-semibold" style={{ color: "rgba(247,242,236,0.35)" }}>Data de nascimento</p>
                </div>
                <p className="text-sm" style={{ color: user?.dataNascimento ? "#f7f2ec" : "rgba(247,242,236,0.25)" }}>
                  {user?.dataNascimento ? formatarData(user.dataNascimento) : "Não informada"}
                </p>
              </div>
            </div>

            {/* Password row — read only (just shows locked state) */}
            <div
              className="rounded-2xl flex items-center justify-between px-5 py-4 cursor-pointer transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
              onClick={iniciarEdicao}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}>
                  <KeyRound className="w-4 h-4" style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#f7f2ec" }}>Senha</p>
                  <p className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>Clique em editar para alterar</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "rgba(200,165,107,0.4)" }}>
                <span className="text-sm tracking-widest">••••••••</span>
                <Edit2 className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT MODE ────────────────────────────────────────────────────── */}
        {editando && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Edit mode header */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>Modo edição</p>
                <h2 className="font-tan-mon-cheri text-xl" style={{ color: "#f7f2ec" }}>Editar Perfil</h2>
              </div>
              <button
                type="button"
                onClick={cancelarEdicao}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.45)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.2)")}
              >
                <X className="w-3.5 h-3.5" />
                Cancelar
              </button>
            </div>

            {/* Personal data */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.2)" }}>
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                <User className="w-4 h-4" style={{ color: "#c8a56b" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Dados Pessoais</span>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium" style={{ color: "rgba(247,242,236,0.7)" }}>Nome completo</label>
                <input
                  type="text" value={nome} onChange={e => setNome(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={inputSt}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium" style={{ color: "rgba(247,242,236,0.7)" }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" style={{ color: "#c8a56b" }} />
                    Data de nascimento
                  </span>
                </label>
                <input
                  type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ ...inputSt, colorScheme: "dark" }}
                />
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>Usada para cálculos de numerologia.</p>
              </div>
            </div>

            {/* Password */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.2)" }}>
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                <Lock className="w-4 h-4" style={{ color: "#c8a56b" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Alterar Senha</span>
              </div>
              <p className="text-xs -mt-2" style={{ color: "rgba(247,242,236,0.3)" }}>Deixe em branco para manter a senha atual.</p>

              {[
                { id: "senhaAtual", label: "Senha atual", val: senhaAtual, set: setSenhaAtual, auto: "current-password" },
                { id: "novaSenha", label: "Nova senha", val: novaSenha, set: setNovaSenha, auto: "new-password" },
                { id: "confirmar", label: "Confirmar nova senha", val: confirmarSenha, set: setConfirmarSenha, auto: "new-password" },
              ].map(f => (
                <div key={f.id} className="space-y-1">
                  <label className="block text-sm font-medium" style={{ color: "rgba(247,242,236,0.7)" }}>{f.label}</label>
                  <input
                    type="password" value={f.val} onChange={e => f.set(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={inputSt}
                    placeholder="••••••••" autoComplete={f.auto}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={cancelarEdicao}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.45)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.2)")}
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</>
                  : <><Save className="w-4 h-4" />Salvar alterações</>
                }
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
