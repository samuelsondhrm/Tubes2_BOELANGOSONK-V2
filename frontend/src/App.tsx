import { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Navbar } from "./components/Navbar";
import { ControlPanel } from "./components/ControlPanel";
import { LCAPanel } from "./components/LCAPanel";
import { VisualizerCanvas } from "./components/VisualizerCanvas";
import { LogTerminal } from "./components/LogTerminal";
import { StatsFooter } from "./components/StatsFooter";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { LandingPage } from "./components/LandingPage";
import { useTraversal, type TraversalParams } from "./hooks/useTraversal";
import { PlaybackControls } from "./components/PlaybackControls";
import type { LCAResponse } from "./types/api";

type Page = "home" | "visualizer";

function getInitialPage(): Page {
  try {
    const saved = localStorage.getItem("boel_page");
    if (saved === "visualizer") return "visualizer";
  } catch (e: unknown) {
    void e;
  }
  return "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  useEffect(() => {
    try { localStorage.setItem("boel_page", page); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = page === "visualizer" ? "hidden" : "auto";
  }, [page]);

  return (
    <>
      {/* ── Shared navbar — identical on every page ── */}
      <Navbar page={page} setPage={setPage} />

      {/* ── Page content ── */}
      {page === "home" ? (
        <LandingPage setPage={setPage} />
      ) : (
        <VisualizerPage />
      )}
    </>
  );
}

function VisualizerPage() {
  const { 
    data, 
    loading, 
    error, 
    run,
    currentStep,
    totalSteps,
    isPlaying,
    setIsPlaying,
    setCurrentStep,
    replay,
    playbackSpeed,
    setPlaybackSpeed,
  } = useTraversal();
  const [lcaResult, setLcaResult] = useState<LCAResponse | null>(null);
  const [lastAlgorithm, setLastAlgorithm] = useState<string>("BFS");

  const handleRun = (params: TraversalParams) => {
    setLastAlgorithm(params.algorithm);
    setLcaResult(null);
    run(params);
  };

  return (
    <>
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[100vw] h-[100vw] rounded-full border-[80px] border-primary/40 opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full eclipse-glow" />
        <div className="particle" style={{ top: "20%", left: "15%", animationDelay: "0s" }} />
        <div className="particle" style={{ top: "60%", left: "25%", animationDelay: "2s" }} />
        <div className="particle" style={{ top: "40%", left: "75%", animationDelay: "4s" }} />
        <div className="particle" style={{ top: "80%", left: "55%", animationDelay: "1s" }} />
        <div className="particle" style={{ top: "10%", left: "85%", animationDelay: "7s" }} />
      </div>

      {/* ── Main Layout (fills remaining viewport below navbar) ── */}
      <div className="relative z-10 flex flex-col h-[calc(100vh-var(--navbar-h))] p-4 md:p-6 gap-6">
        <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <ControlPanel onSubmit={handleRun} loading={loading} />
            <LCAPanel onResult={setLcaResult} />
          </aside>

          {/* Center Canvas */}
          <section className="col-span-6 glass rounded-2xl relative overflow-hidden flex flex-col">
            <div className="p-6 flex justify-between items-center border-b border-white/5 bg-background-dark/20 z-10">
              <div>
                <h2 className="font-bold tracking-tighter text-2xl">DOM_VISUALIZER</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${loading ? "bg-primary" : data ? "bg-green-500" : "bg-white/20"} animate-pulse`}
                  />
                  <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">
                    {loading ? "SCANNING_IN_PROGRESS" : data ? "VISUALIZATION_READY" : "AWAITING_INPUT"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-40 uppercase">Depth Limit</p>
                <p className="font-mono text-primary font-bold">
                  MAX_DEPTH: {data?.maxDepth ?? "--"}
                </p>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,90,31,0.03)_0%,transparent_100%)]">
              {loading && <LoadingOverlay />}

              {!data && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                  <span className="material-icons text-6xl mb-4 opacity-50">account_tree</span>
                  <p className="font-mono text-sm uppercase tracking-widest">No Traversal Data</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-x-4 top-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl z-20 text-sm">
                  <div className="font-bold mb-1">Traversal Error</div>
                  {error}
                </div>
              )}

              {data && (
                <>
                  <ReactFlowProvider>
                    <VisualizerCanvas
                      tree={data.tree}
                      visitedIds={data.visitedIds}
                      matchedIds={data.matchedIds}
                      pathIds={data.pathIds}
                    />
                  </ReactFlowProvider>

                  <PlaybackControls
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    isPlaying={isPlaying}
                    onTogglePlay={setIsPlaying}
                    onStepChange={setCurrentStep}
                    onReplay={replay}
                    speed={playbackSpeed}
                    onSpeedChange={setPlaybackSpeed}
                  />
                </>
              )}
            </div>
          </section>

          {/* Right Sidebar */}
          <LogTerminal
            log={data?.log ?? []}
            algorithm={lastAlgorithm}
            loading={loading}
          />
        </main>

        <StatsFooter data={data} lcaResult={lcaResult} />
      </div>
    </>
  );
}
