import { useState } from "react";
import type { Algorithm } from "../types/api";

interface Props {
  onSubmit: (params: {
    url: string;
    rawHtml: string;
    algorithm: Algorithm;
    selector: string;
    topN: number;
  }) => void;
  loading: boolean;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 6,
  color: "#e2e8f0",
  padding: "8px 12px",
  fontSize: 13,
  fontFamily: "monospace",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
};

export function InputPanel({ onSubmit, loading }: Props) {
  const [inputMode, setInputMode] = useState<"url" | "html">("url");
  const [url, setUrl] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("BFS");
  const [selector, setSelector] = useState("");
  const [topN, setTopN] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ url, rawHtml, algorithm, selector, topN });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid #334155" }}>
        {(["url", "html"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setInputMode(mode)}
            style={{
              flex: 1,
              padding: "7px 0",
              background: inputMode === mode ? "#6366f1" : "#1e293b",
              color: inputMode === mode ? "#fff" : "#64748b",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              transition: "background 0.15s",
            }}
          >
            {mode === "url" ? "URL" : "Raw HTML"}
          </button>
        ))}
      </div>

      {inputMode === "url" ? (
        <div>
          <label style={labelStyle}>Website URL</label>
          <input
            style={inputStyle}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label style={labelStyle}>Raw HTML</label>
          <textarea
            style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
            placeholder="<html>...</html>"
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
          />
        </div>
      )}

      <div>
        <label style={labelStyle}>Algorithm</label>
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
        >
          <option value="BFS">BFS — Breadth First Search</option>
          <option value="DFS">DFS — Depth First Search</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>CSS Selector</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="div, .class, #id, *"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Top N Results (0 = semua)</label>
        <input
          style={inputStyle}
          type="number"
          min={0}
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 0",
          background: loading ? "#334155" : "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.05em",
          transition: "background 0.15s",
        }}
      >
        {loading ? "Traversing..." : "▶ Traverse"}
      </button>
    </form>
  );
}
