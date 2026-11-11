import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Evita tela totalmente em branco se um erro de render escapar.
 * O fundo escuro + CTA de recarregar cobre o caso clássico pós-deploy.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AppErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "linear-gradient(160deg, #130f09 0%, #1e1812 45%, #2f251b 100%)",
          color: "#f7f2ec",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a56b", marginBottom: 12 }}>
            Portal Iluminando
          </p>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>
            Não foi possível carregar esta página
          </h1>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "rgba(247,242,236,0.65)", marginBottom: 24 }}>
            Atualize a página. Se o problema continuar, limpe o cache do navegador e tente de novo.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#fff",
              background: "linear-gradient(135deg, #9c7742, #c8a56b)",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
