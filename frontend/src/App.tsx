import { ReactFlowProvider } from "@xyflow/react";
import { DOMTreeVisualizer } from "./components/DOMTreeVisualizer";
import { InputPanel } from "./components/InputPanel";
import { ResultPanel } from "./components/ResultPanel";
import { AnimationPanel } from "./components/AnimationPanel";
import { LCAPanel } from "./components/LCAPanel";
import { useTraversal } from "./hooks/useTraversal";

export default function App() {
  const { data, loading, error, run } = useTraversal();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0a0f1e",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: 11, color: "#4f46e5", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            IF2211 · Tubes 2
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginTop: 2 }}>
            DOM Tree Traversal
          </div>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
          <InputPanel onSubmit={run} loading={loading} />

          {error && (
            <div
              style={{
                marginTop: 16,
                background: "#450a0a",
                border: "1px solid #7f1d1d",
                borderRadius: 6,
                padding: "10px 12px",
                color: "#fca5a5",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {data && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  color: "#475569",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Results
              </div>
              <ResultPanel result={data.result} maxDepth={data.maxDepth} />
            </div>
          )}

          <div style={{ marginTop: 24, borderTop: "1px solid #1e293b", paddingTop: 20 }}>
            <LCAPanel />
          </div>

          <div style={{ marginTop: 24, borderTop: "1px solid #1e293b", paddingTop: 20 }}>
            <AnimationPanel />
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        {!data && !loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
              color: "#334155",
            }}
          >
            <div style={{ fontSize: 48 }}>⬡</div>
            <div style={{ fontSize: 14 }}>Masukkan URL atau HTML untuk memulai</div>
          </div>
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6366f1",
              fontSize: 13,
            }}
          >
            Memproses traversal...
          </div>
        )}

        {data && (
          <ReactFlowProvider>
            <DOMTreeVisualizer
              tree={data.tree}
              maxDepth={data.maxDepth}
              visitedIds={data.result.visitedIds}
              matchedIds={data.result.matchedIds}
              pathIds={data.result.pathIds}
            />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
