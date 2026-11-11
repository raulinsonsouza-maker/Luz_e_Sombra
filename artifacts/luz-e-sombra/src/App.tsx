import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster as SonnerToaster } from "sonner";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import MotionIntro from "@/components/MotionIntro";
import SiteHeader from "@/components/SiteHeader";
import BottomNav from "@/components/BottomNav";
import SeoHead from "@/components/SeoHead";
import LandingPage from "@/pages/LandingPage";
import VslLandingPage from "@/pages/VslLandingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AcessoPosCompraPage from "@/pages/AcessoPosCompraPage";
import LoginPage from "@/pages/LoginPage";
import EsqueciSenhaPage from "@/pages/EsqueciSenhaPage";
import RedefinirSenhaPage from "@/pages/RedefinirSenhaPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import HomePage from "@/pages/HomePage";
import AvaliacaoPage from "@/pages/AvaliacaoPage";
import ResultadoPage from "@/pages/ResultadoPage";
import HistoricoPage from "@/pages/HistoricoPage";
import NumerologiaPage from "@/pages/NumerologiaPage";
import AdminPage from "@/pages/AdminPage";
import MeuPerfilPage from "@/pages/MeuPerfilPage";
import TracodeCaraterPage from "@/pages/TracodeCaraterPage";
import DiagnosticoEmocionalPage from "@/pages/DiagnosticoEmocionalPage";
import TemperamentoPage from "@/pages/TemperamentoPage";
import JornadaPage from "@/pages/JornadaPage";
import JornadaHubPage from "@/pages/JornadaHubPage";
import LinguagensAmorPage from "@/pages/LinguagensAmorPage";
import MissoesPage from "@/pages/MissoesPage";
import ComunidadePage from "@/pages/ComunidadePage";
import CursosPage from "@/pages/CursosPage";
import CursoPage from "@/pages/CursoPage";
import QuemSouEuPage from "@/pages/QuemSouEuPage";
import NotificacoesPage from "@/pages/NotificacoesPage";
import ReflexaoPage from "@/pages/ReflexaoPage";
import FrasesGuardadasPage from "@/pages/FrasesGuardadasPage";
import AcompanhamentoPage from "@/pages/AcompanhamentoPage";
import TracoPreviewPage from "@/pages/dev/TracoPreviewPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SobrePortalPage from "@/pages/public/SobrePortalPage";
import MetodologiaPage from "@/pages/public/MetodologiaPage";
import JornadaPublicPage from "@/pages/public/JornadaPublicPage";
import ComoFuncionaPage from "@/pages/public/ComoFuncionaPage";
import ContatoPage from "@/pages/public/ContatoPage";
import PlanosPage from "@/pages/public/PlanosPage";
import AnalisesIndexPage from "@/pages/public/AnalisesIndexPage";
import AnalisePage from "@/pages/public/AnalisePage";
import BlogIndexPage from "@/pages/public/BlogIndexPage";
import BlogPostPage from "@/pages/public/BlogPostPage";
import HubConhecimentoPage from "@/pages/public/HubConhecimentoPage";
import GuiaPage from "@/pages/public/GuiaPage";
import GlossarioPage from "@/pages/public/GlossarioPage";
import FaqPage from "@/pages/public/FaqPage";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, status } = useAuth();
  if (status === "loading") {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }
  if (status === "unauthenticated") return <Redirect to="/login" />;
  if (adminOnly && !user?.isAdmin) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <>
      <SeoHead />
      <SiteHeader />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/vsl" component={VslLandingPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/acesso-pos-compra" component={AcessoPosCompraPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/esqueci-senha" component={EsqueciSenhaPage} />
        <Route path="/redefinir-senha" component={RedefinirSenhaPage} />
        <Route path="/admin/login" component={AdminLoginPage} />

        <Route path="/sobre-o-portal" component={SobrePortalPage} />
        <Route path="/metodologia" component={MetodologiaPage} />
        <Route path="/jornada-da-sombra-a-luz" component={JornadaPublicPage} />
        <Route path="/como-funciona" component={ComoFuncionaPage} />
        <Route path="/contato" component={ContatoPage} />
        <Route path="/planos" component={PlanosPage} />
        <Route path="/analises/:slug" component={AnalisePage} />
        <Route path="/analises" component={AnalisesIndexPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/blog" component={BlogIndexPage} />
        <Route path="/autoconhecimento" component={HubConhecimentoPage} />
        <Route path="/padroes-de-comportamento" component={HubConhecimentoPage} />
        <Route path="/desenvolvimento-pessoal" component={HubConhecimentoPage} />
        <Route path="/inteligencia-emocional" component={HubConhecimentoPage} />
        <Route path="/autoconhecimento-e-relacionamentos" component={HubConhecimentoPage} />
        <Route path="/guia" component={GuiaPage} />
        <Route path="/glossario" component={GlossarioPage} />
        <Route path="/perguntas-frequentes" component={FaqPage} />

        {import.meta.env.DEV ? <Route path="/dev/traco" component={TracoPreviewPage} /> : null}
        <Route path="/dashboard">
          <ProtectedRoute component={HomePage} />
        </Route>
        <Route path="/reflexao">
          <ProtectedRoute component={ReflexaoPage} />
        </Route>
        <Route path="/frases-guardadas">
          <ProtectedRoute component={FrasesGuardadasPage} />
        </Route>
        <Route path="/acompanhamento">
          <ProtectedRoute component={AcompanhamentoPage} />
        </Route>
        <Route path="/jornada/:slug">
          <ProtectedRoute component={JornadaHubPage} />
        </Route>
        <Route path="/jornada">
          <ProtectedRoute component={JornadaPage} />
        </Route>
        <Route path="/linguagens-amor">
          <ProtectedRoute component={LinguagensAmorPage} />
        </Route>
        <Route path="/missoes">
          <ProtectedRoute component={MissoesPage} />
        </Route>
        <Route path="/avaliacao">
          <ProtectedRoute component={AvaliacaoPage} />
        </Route>
        <Route path="/resultado/:id">
          <ProtectedRoute component={ResultadoPage} />
        </Route>
        <Route path="/historico">
          <ProtectedRoute component={HistoricoPage} />
        </Route>
        <Route path="/numerologia">
          <ProtectedRoute component={NumerologiaPage} />
        </Route>
        <Route path="/perfil">
          <ProtectedRoute component={MeuPerfilPage} />
        </Route>
        <Route path="/quem-sou-eu">
          <ProtectedRoute component={QuemSouEuPage} />
        </Route>
        <Route path="/diagnostico-emocional">
          <ProtectedRoute component={DiagnosticoEmocionalPage} />
        </Route>
        <Route path="/traco-de-carater">
          <ProtectedRoute component={TracodeCaraterPage} />
        </Route>
        <Route path="/temperamento">
          <ProtectedRoute component={TemperamentoPage} />
        </Route>
        <Route path="/comunidade">
          <ProtectedRoute component={ComunidadePage} />
        </Route>
        <Route path="/cursos/:id">
          <ProtectedRoute component={CursoPage} />
        </Route>
        <Route path="/cursos">
          <ProtectedRoute component={CursosPage} />
        </Route>
        <Route path="/notificacoes">
          <ProtectedRoute component={NotificacoesPage} />
        </Route>
        <Route path="/admin">
          <ProtectedRoute component={AdminPage} adminOnly />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <MotionIntro>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <SonnerToaster theme="dark" position="top-center" richColors />
          </WouterRouter>
        </MotionIntro>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
