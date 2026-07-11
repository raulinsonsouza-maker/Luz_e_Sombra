import { GraduationCap, Sparkles } from "lucide-react";

export function CursosEmBreve() {
  return (
    <div className="text-center py-12 px-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{
          background: "linear-gradient(135deg, rgba(200,165,107,0.12), rgba(156,119,66,0.06))",
          border: "1px solid rgba(200,165,107,0.2)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        <GraduationCap className="w-9 h-9" style={{ color: "rgba(200,165,107,0.65)" }} />
      </div>
      <p
        className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3 flex items-center justify-center gap-2"
        style={{ color: "rgba(200,165,107,0.5)" }}
      >
        <Sparkles className="w-3 h-3" />
        Em breve
      </p>
      <h2 className="font-tan-mon-cheri text-2xl mb-3" style={{ color: "#f7f2ec" }}>
        Nossos cursos estão chegando
      </h2>
      <p className="text-sm leading-relaxed max-w-xs mx-auto mb-2" style={{ color: "rgba(247,242,236,0.45)" }}>
        Estamos preparando trilhas guiadas para aprofundar cada módulo da sua jornada de autoconhecimento.
      </p>
      <p className="text-xs" style={{ color: "rgba(247,242,236,0.28)" }}>
        Enquanto isso, continue explorando as análises e ferramentas da plataforma.
      </p>
    </div>
  );
}
