import { HeroTree } from "./HeroTree";

type Page = "home" | "visualizer";

interface Props {
  setPage: (p: Page) => void;
}

function Hero({ setPage }: Props) {
  return (
    <section className="grid grid-cols-12 gap-6 px-2 pt-6 md:pt-10">
      {/* LEFT — pitch + CTAs */}
      <div className="col-span-12 lg:col-span-6 flex flex-col justify-center fade-in">
        <div className="chip mb-6 w-fit">
          <span className="tick-dot" />
          <span>IF2211 · ALGORITHM STRATEGY</span>
        </div>

        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.95]">
          Parse the DOM.
          <br />
          <span className="text-primary">See the tree.</span>
        </h1>

        <p className="mt-6 text-white/70 text-lg max-w-lg leading-relaxed">
          A high-fidelity DOM tree visualizer built around graph traversal primitives.
          Feed it a URL or raw HTML, choose{" "}
          <span className="font-mono text-primary">BFS</span> or{" "}
          <span className="font-mono text-primary">DFS</span>, and watch every node —
          matched, visited, and connected — render in real time.
        </p>

        {/* How it works */}
        <div className="mt-8 glass rounded-2xl p-5 max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-white/40 text-[10px] uppercase tracking-widest">
            <span className="material-icons text-[14px] text-primary">play_circle</span>
            <span>HOW_IT_WORKS</span>
          </div>
          <ol className="space-y-3">
            {[
              { n: "01", text: "Paste a URL or raw HTML into the input panel." },
              { n: "02", text: "Choose BFS or DFS and enter a CSS selector." },
              { n: "03", text: "Hit Start Search! the DOM tree renders live on the canvas." },
            ].map(({ n, text }) => (
              <li key={n} className="flex items-start gap-3">
                <span className="font-mono text-primary text-xs font-bold mt-0.5 shrink-0">{n}</span>
                <span className="text-sm text-white/70 leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setPage("visualizer")}
            className="btn-gradient text-white rounded-xl font-bold tracking-widest text-sm px-7 py-3 transition-all cursor-pointer flex items-center gap-2"
          >
            LAUNCH VISUALIZER
            <span className="material-icons text-base">arrow_forward</span>
          </button>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="glass rounded-xl px-6 py-3 text-sm font-medium tracking-widest border border-white/10 hover:border-primary/40 transition-all cursor-pointer flex items-center gap-2"
          >
            EXPLORE FEATURES
            <span className="material-icons text-base">arrow_downward</span>
          </a>
        </div>

        {/* Sub-stats row */}
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
          <div>
            <div className="stat-num text-primary">2</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Traversal Algorithms</div>
          </div>
          <div>
            <div className="stat-num">LCA</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Lowest Common Ancestor</div>
          </div>
          <div>
            <div className="stat-num">∞</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Depth Support</div>
          </div>
        </div>
      </div>

      {/* RIGHT — hero tree preview */}
      <div className="col-span-12 lg:col-span-6 fade-in">
        <div className="glass rounded-2xl h-full relative overflow-hidden" style={{ minHeight: 520 }}>
          <div className="p-5 flex justify-between items-center border-b border-white/5 bg-background-dark/20 z-10 relative">
            <div>
              <h2 className="font-bold tracking-tighter text-lg">DOM_VISUALIZER</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">
                  PREVIEW_MODE
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-40 uppercase">Depth Limit</p>
              <p className="font-mono text-primary font-bold text-sm">MAX_DEPTH: 4</p>
            </div>
          </div>

          <div className="relative flex-1" style={{ height: "calc(100% - 73px)" }}>
            <div className="scanline scanline-anim" />
            <div className="absolute inset-0 p-4">
              <HeroTree />
            </div>

            {/* Mini legend */}
            <div className="absolute bottom-8 left-4 flex gap-3 text-[10px] uppercase tracking-widest font-mono">
              <span className="node-tag text-primary">matched</span>
              <span className="node-tag-dim text-white/60">visited</span>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: "account_tree",
      title: "BFS & DFS Engines",
      copy: "Swap between breadth- and depth-first traversal instantly. Every visit is logged and replayable.",
      tag: "TRAVERSAL_ENGINE",
    },
    {
      icon: "travel_explore",
      title: "URL or Raw HTML",
      copy: "Point at a live URL or paste raw markup. Same engine, same output, zero configuration.",
      tag: "INPUT_MODES",
    },
    {
      icon: "filter_alt",
      title: "CSS Selector Matching",
      copy: "Filter the tree with any valid CSS selector. Matches glow in primary orange across the graph.",
      tag: "SEARCH_OPTIONS",
    },
    {
      icon: "hub",
      title: "Lowest Common Ancestor",
      copy: "Select two nodes and resolve their LCA in a single click — with the path rendered on the canvas.",
      tag: "LCA_ENGINE",
    },
    {
      icon: "bar_chart",
      title: "Live Stats Footer",
      copy: "Nodes visited, matched queries, max depth, search time — always on, always measured in ms.",
      tag: "TELEMETRY",
    },
    {
      icon: "terminal",
      title: "Process Log Terminal",
      copy: "Every visit, match, and path resolution streams to a right-rail terminal you can scroll and copy.",
      tag: "PROCESS_LOGS",
    },
  ];

  return (
    <section id="features" className="mt-24 md:mt-32 px-2">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="chip mb-4">
            <span className="tick-dot" />
            <span>FEATURE_SET</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Everything the <span className="text-primary">traversal</span> needs.
          </h2>
        </div>
        <p className="max-w-sm text-white/60 text-sm leading-relaxed">
          A focused set of primitives for reasoning about HTML as a graph — nothing more, nothing cosmetic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <div key={i} className="feature-card glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">{it.icon}</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-white/40">{it.tag}</span>
            </div>
            <h3 className="font-bold tracking-tight text-lg mb-2">{it.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{it.copy}</p>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Algorithms() {
  return (
    <section className="mt-24 md:mt-32 px-2">
      <div className="chip mb-4">
        <span className="tick-dot" />
        <span>ALGORITHMS</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-10">
        Pick your <span className="text-primary">traversal</span>.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BFS */}
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-white/40">ALGORITHM_01</div>
              <h3 className="text-3xl font-bold tracking-tighter mt-1">Breadth-First Search</h3>
            </div>
            <div className="font-mono text-primary text-2xl font-bold">BFS</div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Expands outward from the root one level at a time. Ideal for finding shallow matches
            and the shortest path to a selector.
          </p>
          <svg viewBox="0 0 320 120" className="w-full">
            {[0, 1, 2, 3].map((level) => {
              const count = level === 0 ? 1 : level === 3 ? 4 : level + 1;
              return (
                <g key={level}>
                  {Array.from({ length: count }).map((_, i) => {
                    const x = 40 + (240 / Math.max(count, 1)) * (i + 0.5);
                    const y = 15 + level * 30;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill="#ff5a1f" opacity={1 - level * 0.18} />
                        <circle cx={x} cy={y} r="10" fill="none" stroke="#ff5a1f" strokeWidth="1" opacity={0.2} />
                      </g>
                    );
                  })}
                </g>
              );
            })}
            <text x="10" y="20"  fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">L0</text>
            <text x="10" y="50"  fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">L1</text>
            <text x="10" y="80"  fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">L2</text>
            <text x="10" y="110" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">L3</text>
          </svg>
        </div>

        {/* DFS */}
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-white/40">ALGORITHM_02</div>
              <h3 className="text-3xl font-bold tracking-tighter mt-1">Depth-First Search</h3>
            </div>
            <div className="font-mono text-primary text-2xl font-bold">DFS</div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Dives down each branch to its leaves before backtracking. Excels at exhaustively
            exploring deeply nested document structures.
          </p>
          <svg viewBox="0 0 320 120" className="w-full">
            <path d="M 40 20 L 100 50 L 120 80 L 140 108" stroke="#ff5a1f" strokeWidth="1.5" fill="none" className="dash-flow" />
            <path d="M 100 50 L 180 80 L 200 108" stroke="#ff5a1f" strokeWidth="1.5" fill="none" opacity={0.5} />
            <path d="M 40 20 L 220 50 L 260 80 L 280 108" stroke="#ff5a1f" strokeWidth="1.5" fill="none" opacity={0.3} />
            {([[40,20],[100,50],[120,80],[140,108],[180,80],[200,108],[220,50],[260,80],[280,108]] as [number,number][]).map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="#ff5a1f" opacity={i < 4 ? 1 : 0.4} />
                {i < 4 && <circle cx={x} cy={y} r="10" fill="none" stroke="#ff5a1f" strokeWidth="1" opacity={0.3} />}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function CTAStrip({ setPage }: Props) {
  return (
    <section className="mt-24 md:mt-32 px-2">
      <div className="glass rounded-2xl p-10 md:p-14 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full border-[60px] border-primary/30 opacity-30 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-4">
              <span className="tick-dot" />
              <span>READY_TO_RUN</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
              Load a URL.{" "}
              <br className="hidden md:block" />
              <span className="text-primary">Visualize the tree.</span>
            </h2>
            <p className="text-white/60 mt-4 max-w-lg text-sm md:text-base leading-relaxed">
              No sign-up, no account. Open the visualizer and start traversing any HTML document in seconds.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <button
              onClick={() => setPage("visualizer")}
              className="btn-gradient text-white rounded-xl font-bold tracking-widest text-sm px-8 py-4 transition-all cursor-pointer flex items-center gap-2"
            >
              OPEN VISUALIZER
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="mt-20 md:mt-28 pb-10 px-2">
      <div className="divider-glow mb-8" />
      <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-white/40 font-mono tracking-widest">
        <div className="flex items-center gap-3">
          <div className="logo-orbital" style={{ width: 28, height: 28 }}>
            <span className="logo-b" style={{ fontSize: 14 }}>B</span>
          </div>
          <span>BOELANGOESONK · DOM_TREE_VISUALIZER</span>
        </div>
        <div className="flex gap-6">
          <span>BFS · DFS · LCA</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage({ setPage }: Props) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-bg opacity-[0.35]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[100vw] h-[100vw] rounded-full border-[80px] border-primary/40 opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full eclipse-glow" />
        <div className="particle" style={{ top: "20%", left: "15%", animationDelay: "0s" }} />
        <div className="particle" style={{ top: "60%", left: "25%", animationDelay: "2s" }} />
        <div className="particle" style={{ top: "40%", left: "75%", animationDelay: "4s" }} />
        <div className="particle" style={{ top: "80%", left: "55%", animationDelay: "1s" }} />
        <div className="particle" style={{ top: "10%", left: "85%", animationDelay: "7s" }} />
        <div className="particle" style={{ top: "30%", left: "45%", animationDelay: "5s" }} />
        <div className="particle" style={{ top: "70%", left: "85%", animationDelay: "3s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 flex flex-col flex-1">
          <Hero setPage={setPage} />
          <Features />
          <Algorithms />
          <CTAStrip setPage={setPage} />
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
