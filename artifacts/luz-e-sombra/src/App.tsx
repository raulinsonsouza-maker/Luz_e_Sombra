import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
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

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, status } = useAuth();
  if (status === "loading") {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
          <p className="mt-4 text-brand-medium">Carregando...</p>
        </div>
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
        <Route path="/traco-de-carater">
          <ProtectedRoute component={TracodeCaraterPage} />
        </Route>
        <Route path="/admin">
          <ProtectedRoute component={AdminPage} adminOnly />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
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
