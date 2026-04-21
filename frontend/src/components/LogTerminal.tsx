import { useRef, useEffect } from "react";
import type { LogEntry } from "../types/api";

interface Props {
  log: LogEntry[];
  algorithm?: string;
  loading?: boolean;
}

export function LogTerminal({ log, algorithm = "BFS", loading = false }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [log]);

  function getLogColor(status: string): string {
    switch (status) {
      case "matched":
        return "text-primary";
      case "visiting":
        return "text-white/60";
      case "skipped":
        return "text-white/40 italic";
      default:
        return "text-white/60";
    }
  }

  function formatLogEntry(entry: LogEntry): string {
    const prefix = entry.status === "matched" ? "MATCH" : algorithm;
    const action =
      entry.status === "matched"
        ? `Selector found at <${entry.tag}> (${entry.nodeId})`
        : entry.status === "skipped"
        ? `Skipping <${entry.tag}> (${entry.nodeId})`
        : `Visiting <${entry.tag}> (${entry.nodeId})`;
    return `[${String(entry.step).padStart(4, "0")}] ${prefix}: ${action}`;
  }

  return (
    <aside className="col-span-3 glass rounded-2xl flex flex-col overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center gap-2">
        <span className="material-icons text-sm opacity-50">terminal</span>
        <h3 className="text-xs uppercase tracking-widest font-bold">
          Process Logs
        </h3>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-2"
      >
        {/* Initial ready state */}
        {log.length === 0 && !loading && (
          <>
            <p className="text-green-500 opacity-80">
              [INIT] ENGINE: DOM parser ready...
            </p>
            <p className="text-white/40">
              [IDLE] Awaiting traversal command...
            </p>
            <p className="text-white/20 animate-pulse">_</p>
          </>
        )}

        {/* Loading state */}
        {loading && log.length === 0 && (
          <>
            <p className="text-green-500 opacity-80">
              [INIT] ENGINE: Initializing DOM parser...
            </p>
            <p className="text-white/60">
              [{algorithm}] Fetching and parsing document...
            </p>
            <p className="text-white/40 italic animate-pulse">
              [WAIT] Processing...
            </p>
          </>
        )}

        {/* Log entries */}
        {log.length > 0 && (
          <>
            <p className="text-green-500 opacity-80">
              [INIT] ENGINE: Initializing DOM parser...
            </p>
            {log.map((entry) => (
              <p key={entry.step} className={getLogColor(entry.status)}>
                {formatLogEntry(entry)}
              </p>
            ))}
            <p className="text-green-500 opacity-80">
              [DONE] SUCCESS: Traversal complete
            </p>
            <p className="text-white/20 animate-pulse">_</p>
          </>
        )}
      </div>
    </aside>
  );
}
