import { useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/context/AuthContext";
import MobileTopBar from "@/components/MobileTopBar";
import { parsePessoaIdFromSearch } from "@/lib/tracoFormStorage";
import Diagnostico30Form from "@/pages/traco/components/Diagnostico30Form";

export default function DiagnosticoEmocionalPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const pessoaId = useMemo(() => parsePessoaIdFromSearch(search), [search]);
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <MobileTopBar titulo="Diagnóstico emocional" subtitulo="Contexto antes do corpo" />
      <Diagnostico30Form pessoaId={pessoaId} variant="standalone" />
    </div>
  );
}
