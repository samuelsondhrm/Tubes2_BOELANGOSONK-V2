import { useState } from "react";
import type { TraversalResult, LogEntry } from "../types/api";

interface Props {
  result: TraversalResult;
  maxDepth: number;
}

export function ResultPanel({ result, maxDepth }: Props) {
  const [showLog, setShowLog] = useState(false);

  function downloadLog() {
    const lines = result.log.map(
      (e) =>
        `Step ${e.step} | ${e.nodeId} | <${e.tag}> | depth=${e.depth} | matched=${e.matched}`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traversal_log.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const statItem = (label: string, value: string | number) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <span style={{ color: "#64748b", fontSize: 12 }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontSize: 12, fontFamily: "monospace" }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: "#1e293b",
          borderRadius: 8,
          padding: "12px 16px",
        }}
      >
        {statItem("Matches Found", result.matchedIds.length)}
        {statItem("Nodes Visited", result.nodesVisited)}
        {statItem("Elapsed", `${result.elapsedMs.toFixed(3)} ms`)}
        {statItem("Max Tree Depth", maxDepth)}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setShowLog((v) => !v)}
          style={btnStyle("#334155")}
        >
          {showLog ? "Hide Log" : "Show Log"} ({result.log.length})
        </button>
        <button onClick={downloadLog} style={btnStyle("#1e40af")}>
          ↓ Download Log
        </button>
      </div>

      {showLog && (
        <div
          style={{
            maxHeight: 300,
            overflowY: "auto",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 6,
            padding: 8,
          }}
        >
          {result.log.map((e: LogEntry) => (
            <div
              key={e.step}
              style={{
                display: "flex",
                gap: 8,
                padding: "3px 0",
                borderBottom: "1px solid #1e293b",
                fontSize: 11,
                fontFamily: "monospace",
              }}
            >
              <span style={{ color: "#475569", minWidth: 28 }}>#{e.step}</span>
              <span
                style={{
                  color: e.matched ? "#22c55e" : "#94a3b8",
                  minWidth: 90,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {e.nodeId}
              </span>
              <span style={{ color: "#6366f1", minWidth: 60 }}>&lt;{e.tag}&gt;</span>
              <span style={{ color: "#475569" }}>d={e.depth}</span>
              {e.matched && (
                <span style={{ color: "#22c55e", marginLeft: "auto" }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}

      {result.matchedIds.length > 0 && (
        <div>
          <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Matched Nodes
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {result.matchedIds.map((id) => (
              <span
                key={id}
                style={{
                  background: "#14532d",
                  border: "1px solid #16a34a",
                  color: "#86efac",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    flex: 1,
    padding: "7px 0",
    background: bg,
    color: "#e2e8f0",
    border: "none",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.05em",
  };
}
