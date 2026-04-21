import { useState } from "react";
import { api } from "../api/client";
import type { LCAResponse } from "../types/api";

interface Props {
  onResult: (result: LCAResponse | null) => void;
}

export function LCAPanel({ onResult }: Props) {
  const [nodeA, setNodeA] = useState("");
  const [nodeB, setNodeB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.lca({
        node_id_a: nodeA.trim(),
        node_id_b: nodeB.trim(),
      });
      onResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      onResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-5 rounded-2xl flex flex-col mb-4">
      <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
        LCA Engine
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">
              ads_click
            </span>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
              placeholder="Node A"
              value={nodeA}
              onChange={(e) => setNodeA(e.target.value)}
              required
            />
          </div>
          <div className="flex-1 relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">
              ads_click
            </span>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
              placeholder="Node B"
              value={nodeB}
              onChange={(e) => setNodeB(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 btn-gradient text-white rounded-xl font-bold text-sm tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "SEARCHING..." : "FIND LCA"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
