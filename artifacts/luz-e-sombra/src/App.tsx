import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import BottomNav from "@/components/BottomNav";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import HomePage from "@/pages/HomePage";
import AvaliacaoPage from "@/pages/AvaliacaoPage";
import ResultadoPage from "@/pages/ResultadoPage";
import HistoricoPage from "@/pages/HistoricoPage";
import NumerologiaPage from "@/pages/NumerologiaPage";
import AdminPage from "@/pages/AdminPage";
import MeuPerfilPage from "@/pages/MeuPerfilPage";
import TracodeCaraterPage from "@/pages/TracodeCaraterPage";
import JornadaPage from "@/pages/JornadaPage";
import MissoesPage from "@/pages/MissoesPage";
import ComunidadePage from "@/pages/ComunidadePage";
import CursosPage from "@/pages/CursosPage";
import CursoPage from "@/pages/CursoPage";
import QuemSouEuPage from "@/pages/QuemSouEuPage";
import NotificacoesPage from "@/pages/NotificacoesPage";

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
      <SiteHeader />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/dashboard">
          <ProtectedRoute component={HomePage} />
        </Route>
        <Route path="/jornada">
          <ProtectedRoute component={JornadaPage} />
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
        <Route path="/traco-de-carater">
          <ProtectedRoute component={TracodeCaraterPage} />
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
          <Redirect to="/" />
        </Route>
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </AuthProvider>
  );
}

export default App;
