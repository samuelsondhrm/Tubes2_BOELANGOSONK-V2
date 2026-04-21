import type { TraversalData } from "../types/api";
import type { LCAResponse } from "../types/api";

interface Props {
  data: TraversalData | null;
  lcaResult: LCAResponse | null;
}

export function StatsFooter({ data, lcaResult }: Props) {
  return (
    <footer className="flex gap-6 h-28 mt-auto">
      {/* LCA Results Card */}
      <div className="glass rounded-2xl p-4 w-64 flex flex-col border-l-4 border-l-primary/40 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-white/5" />
        <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold text-white z-10">
          LCA RESULTS
        </span>
        <div className="mt-2 flex flex-col gap-1 z-10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] opacity-50">LCA Node:</span>
            <span className="text-xs font-mono text-primary font-bold">
              {lcaResult ? `<${lcaResult.lca_node.tag}> ${lcaResult.lca_node.id}` : "..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] opacity-50">Depth A/B:</span>
            <span className="text-xs font-mono text-white opacity-80">
              {lcaResult ? `${lcaResult.depth_a} / ${lcaResult.depth_b}` : "- / -"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex-1 grid grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-primary/40">
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
            Max Depth
          </span>
          <span className="text-2xl font-bold text-white">
            {data?.maxDepth ?? "--"}{" "}
            <span className="text-sm opacity-30 font-normal">layers</span>
          </span>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-primary/40">
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
            Nodes Visited
          </span>
          <span className="text-2xl font-bold text-white">
            {data?.nodesVisited?.toLocaleString() ?? "--"}
          </span>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-primary/40">
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
            Matched Queries
          </span>
          <span className="text-2xl font-bold text-white">
            {data?.matchedIds.length ?? "--"}
          </span>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-primary shadow-[0_0_25px_rgba(255,90,31,0.1)]">
          <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-white">
            SEARCH TIME
          </span>
          <span className="text-3xl font-bold text-white">
            {data ? (
              <>
                {data.elapsedMs < 1
                  ? data.elapsedMs.toFixed(2)
                  : Math.round(data.elapsedMs)}{" "}
                <span className="text-base font-normal opacity-60">ms</span>
              </>
            ) : (
              <>-- <span className="text-base font-normal opacity-60">ms</span></>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
