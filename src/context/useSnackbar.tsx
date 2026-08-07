import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SnackbarType = "info" | "success" | "error";

interface SnackbarContextValue {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
}

interface SnackbarState {
  id: number;
  message: string;
  type: SnackbarType;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

function errorMessage(value: unknown) {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  return "Something went wrong";
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setSnackbar(null);
  }, []);

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = "info", duration = 3500) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setSnackbar({ id: Date.now(), message, type });
      timeoutRef.current = setTimeout(dismiss, duration);
    },
    [dismiss],
  );

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      showSnackbar(errorMessage(event.error ?? event.message), "error", 5000);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      showSnackbar(errorMessage(event.reason), "error", 5000);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showSnackbar]);

  const Icon = snackbar?.type === "error"
    ? AlertCircle
    : snackbar?.type === "success"
      ? CheckCircle2
      : Info;

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <div
          key={snackbar.id}
          role={snackbar.type === "error" ? "alert" : "status"}
          aria-live={snackbar.type === "error" ? "assertive" : "polite"}
          className="fixed right-4 top-4 z-[10000] w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-right-3 duration-200"
        >
          <div
            className="flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-white"
            style={{
              background: "rgba(20,20,20,0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <Icon
              className={`size-5 shrink-0 ${
                snackbar.type === "error"
                  ? "text-red-400"
                  : snackbar.type === "success"
                    ? "text-green-400"
                    : "text-zinc-300"
              }`}
            />
            <span className="min-w-0 flex-1 text-sm font-medium">{snackbar.message}</span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss notification"
              className="grid size-8 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

// Context providers and their hooks intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
}
