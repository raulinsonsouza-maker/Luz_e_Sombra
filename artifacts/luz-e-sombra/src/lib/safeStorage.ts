/** WebViews (Instagram/FB) às vezes bloqueiam Storage com SecurityError. */

function memoryStore(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}

const memLocal = memoryStore();
const memSession = memoryStore();

function pickStorage(primary: Storage | undefined, fallback: Storage): Storage {
  try {
    if (!primary) return fallback;
    const probe = "__luz_storage_probe__";
    primary.setItem(probe, "1");
    primary.removeItem(probe);
    return primary;
  } catch {
    return fallback;
  }
}

let localRef: Storage | null = null;
let sessionRef: Storage | null = null;

function readWindowStorage(kind: "localStorage" | "sessionStorage"): Storage | undefined {
  // Em Instagram/FB o acesso à PROPRIEDADE já lança SecurityError.
  try {
    return window[kind];
  } catch {
    return undefined;
  }
}

export function safeLocalStorage(): Storage {
  if (localRef) return localRef;
  try {
    localRef = pickStorage(typeof window !== "undefined" ? readWindowStorage("localStorage") : undefined, memLocal);
  } catch {
    localRef = memLocal;
  }
  return localRef;
}

export function safeSessionStorage(): Storage {
  if (sessionRef) return sessionRef;
  try {
    sessionRef = pickStorage(typeof window !== "undefined" ? readWindowStorage("sessionStorage") : undefined, memSession);
  } catch {
    sessionRef = memSession;
  }
  return sessionRef;
}

export function isInAppBrowser(ua = typeof navigator !== "undefined" ? navigator.userAgent : ""): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|BytedanceWebview|MicroMessenger/i.test(ua);
}
