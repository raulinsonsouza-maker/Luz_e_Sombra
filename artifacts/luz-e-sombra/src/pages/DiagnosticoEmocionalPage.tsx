import { useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/context/AuthContext";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import AppPageShell from "@/components/AppPageShell";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
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
    <>
      <MobileTopBar titulo="Diagnóstico emocional" subtitulo="Contexto antes do corpo" />
      <AppPageShell contentClassName="pt-4 space-y-2">
        <NavBackButton
          to={JORNADA_MODULE_NAV.traco.hub}
          label={JORNADA_MODULE_NAV.traco.backLabel}
          className="mb-0"
        />
        <PageIntroHeader
          eyebrow="Traço de Caráter"
          titulo="Diagnóstico emocional"
          subtitulo="Contexto emocional antes da leitura corporal"
          hiddenOnMobile
          className="mb-2"
        />
        <Diagnostico30Form pessoaId={pessoaId} variant="standalone" />
      </AppPageShell>
    </>
  );
}
