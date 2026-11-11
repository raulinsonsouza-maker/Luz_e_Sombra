import { Component, type ErrorInfo, type ReactNode } from "react";
import { isInAppBrowser, safeSessionStorage } from "@/lib/safeStorage";

type Props = { children: ReactNode };
type State = {
  hasError: boolean;
  message: string;
  inApp: boolean;
};

const RETRY_KEY = "luz_eb_retry_v1";

/**
 * Evita tela branca se um erro de render escapar.
 * No Instagram/FB WebView: auto-retry 1x + CTA para abrir no navegador.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
    inApp: typeof navigator !== "undefined" ? isInAppBrowser() : false,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      message: error?.message ? String(error.message).slice(0, 180) : "",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AppErrorBoundary]", error, info.componentStack);

    // Uma tentativa automática (cache/WebView instável do Instagram).
    try {
      const store = safeSessionStorage();
      if (store.getItem(RETRY_KEY) !== "1") {
        store.setItem(RETRY_KEY, "1");
        const url = new URL(window.location.href);
        url.searchParams.set("_r", String(Date.now()));
        window.location.replace(url.toString());
      }
    } catch {
      /* ignore */
    }
  }

  private reloadHard = () => {
    try {
      safeSessionStorage().removeItem(RETRY_KEY);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("_r", String(Date.now()));
    window.location.assign(url.toString());
  };

  private openExternally = () => {
    const href = window.location.href;
    // Android: tenta Chrome via intent; iOS: usuário usa o menu ⋯
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      const hostPath = href.replace(/^https?:\/\//, "");
      window.location.href = `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }
    window.location.assign(href);
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { inApp, message } = this.state;

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
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c8a56b",
              marginBottom: 12,
            }}
          >
            Portal Iluminando
          </p>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>
            {inApp ? "Abra no navegador do celular" : "Não foi possível carregar esta página"}
          </h1>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "rgba(247,242,236,0.65)", marginBottom: 16 }}>
            {inApp
              ? "O navegador interno do Instagram/Facebook às vezes bloqueia o site. Toque em ⋯ (ou Abrir no navegador) e continue no Chrome/Safari."
              : "Atualize a página. Se o problema continuar, limpe o cache e tente de novo."}
          </p>
          {message ? (
            <p style={{ fontSize: "0.7rem", lineHeight: 1.4, color: "rgba(247,242,236,0.35)", marginBottom: 20 }}>
              {message}
            </p>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {inApp ? (
              <button
                type="button"
                onClick={this.openExternally}
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
                Tentar abrir no Chrome
              </button>
            ) : null}
            <button
              type="button"
              onClick={this.reloadHard}
              style={{
                padding: "12px 22px",
                borderRadius: 12,
                border: inApp ? "1px solid rgba(200,165,107,0.35)" : "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: inApp ? "#f7f2ec" : "#fff",
                background: inApp ? "transparent" : "linear-gradient(135deg, #9c7742, #c8a56b)",
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
