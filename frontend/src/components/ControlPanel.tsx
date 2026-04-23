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

export function ControlPanel({ onSubmit, loading }: Props) {
  const [inputMode, setInputMode] = useState<"url" | "html">("url");
  const [url, setUrl] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("BFS");
  const [viewMode, setViewMode] = useState<"top_n" | "all">("top_n");
  const [nodeLimit, setNodeLimit] = useState(100);
  const [selector, setSelector] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topN = viewMode === "all" ? 0 : nodeLimit;
    onSubmit({ url, rawHtml, algorithm, selector, topN });
  }

  function handleModeChange(mode: "url" | "html") {
    setInputMode(mode);
    setUrl("");
    setRawHtml("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* ── Traversal Engine Card ─────────────── */}
      <div className="glass p-5 rounded-2xl">
        <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
          Traversal Engine
        </h3>

        {/* URL / RAW HTML Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
          <button
            type="button"
            className={`flex-1 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
              inputMode === "url"
                ? "bg-primary text-white font-medium"
                : "hover:bg-white/5"
            }`}
            onClick={() => handleModeChange("url")}
          >
            URL
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
              inputMode === "html"
                ? "bg-primary text-white font-medium"
                : "hover:bg-white/5"
            }`}
           onClick={() => handleModeChange("html")}
          >
            RAW HTML
          </button>
        </div>

        <div className="space-y-4">
          {/* Algorithm Selection */}
          <label className="block">
            <span className="text-xs opacity-50 block mb-1">
              Algorithm Selection
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                  algorithm === "BFS"
                    ? "border border-primary/50 bg-primary/10 text-primary"
                    : "border border-white/10 hover:bg-white/5"
                }`}
                onClick={() => setAlgorithm("BFS")}
              >
                BFS
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                  algorithm === "DFS"
                    ? "border border-primary/50 bg-primary/10 text-primary"
                    : "border border-white/10 hover:bg-white/5"
                }`}
                onClick={() => setAlgorithm("DFS")}
              >
                DFS
              </button>
            </div>
          </label>

          {/* Source Input */}
          {inputMode === "url" ? (
            <label className="block">
              <span className="text-xs opacity-50 block mb-1">Source URL</span>
              <input
                type="url"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-xs opacity-50 block mb-1">Raw HTML</span>
              <textarea
                className="w-full h-32 bg-background-dark/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/80 focus:ring-1 focus:ring-primary outline-none transition-all resize-none custom-scrollbar"
                placeholder={"<html>\n  <body>\n    ...\n  </body>\n</html>"}
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
              />
            </label>
          )}
        </div>
      </div>

      {/* ── Search Options Card ──────────────── */}
      <div className="glass p-5 rounded-2xl">
        <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
          Search Options
        </h3>

        <div className="space-y-4">
          {/* View Mode */}
          <label className="block">
            <span className="text-xs opacity-50 block mb-2">View Mode</span>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-white"
              value={viewMode}
              onChange={(e) =>
                setViewMode(e.target.value as "top_n" | "all")
              }
            >
              <option value="top_n" className="text-black">Top N Occurrences</option>
              <option value="all" className="text-black">All Occurrences</option>
            </select>
          </label>

          {/* Node Limit */}
          {viewMode === "top_n" && (
            <label className="block">
              <span className="text-xs opacity-50 block mb-1">Node Limit</span>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                value={nodeLimit}
                onChange={(e) => setNodeLimit(Number(e.target.value))}
                min={1}
              />
            </label>
          )}

          {/* CSS Selector */}
          <label className="block">
            <span className="text-xs opacity-50 block mb-1">CSS Selector</span>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder=".class, #id, tag"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 btn-gradient text-white rounded-xl font-bold text-sm tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "SEARCHING..." : "START SEARCH"}
        </button>
      </div>
    </form>
  );
}
