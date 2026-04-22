import { useState, useEffect } from "react";

export function HeroTree() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const nodeBg      = isDark ? "rgba(10,10,11,0.88)"    : "rgba(255,255,255,0.92)";
  const nodeBorder  = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const nodeActive  = isDark ? "rgba(255,90,31,0.45)"   : "rgba(255,90,31,0.40)";
  const textDefault = isDark ? "rgba(255,255,255,0.95)" : "#1a1a1b";
  const textDim     = isDark ? "rgba(255,255,255,0.50)" : "rgba(26,26,27,0.45)";
  const matchedBg   = "rgba(255,90,31,0.16)";
  const matchedText = "#ff5a1f";

  const nodes = [
    { id: "html",  x: 320, y: 40,  label: "<html>",  matched: false, active: true  },
    { id: "head",  x: 180, y: 130, label: "<head>",  matched: false, active: true  },
    { id: "body",  x: 460, y: 130, label: "<body>",  matched: false, active: true  },
    { id: "title", x: 100, y: 220, label: "<title>", matched: false, active: false },
    { id: "meta",  x: 200, y: 220, label: "<meta>",  matched: false, active: false },
    { id: "div1",  x: 360, y: 220, label: "<div>",   matched: true,  active: true  },
    { id: "div2",  x: 500, y: 220, label: "<div>",   matched: true,  active: false },
    { id: "p1",    x: 320, y: 310, label: "<p>",     matched: false, active: false },
    { id: "a1",    x: 410, y: 310, label: "<a>",     matched: false, active: false },
    { id: "span1", x: 530, y: 310, label: "<span>",  matched: false, active: false },
    { id: "em1",   x: 320, y: 390, label: "<em>",    matched: false, active: false },
  ] as const;

  const edges: [string, string, boolean][] = [
    ["html", "head",  false],
    ["html", "body",  true ],
    ["head", "title", false],
    ["head", "meta",  false],
    ["body", "div1",  true ],
    ["body", "div2",  false],
    ["div1", "p1",    false],
    ["div1", "a1",    false],
    ["div2", "span1", false],
    ["p1",   "em1",   false],
  ];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 640 440" className="w-full h-full">
        {edges.map(([a, b, active], i) => {
          const A = byId[a], B = byId[b];
          const midY = (A.y + B.y) / 2;
          const d = `M ${A.x} ${A.y + 14} C ${A.x} ${midY}, ${B.x} ${midY}, ${B.x} ${B.y - 14}`;
          return (
            <path
              key={i}
              d={d}
              className={`node-line-svg${active ? " active dash-flow" : ""}`}
            />
          );
        })}

        {nodes.map((n) => {
          const w = n.label.length * 7 + 18;
          return (
            <g key={n.id} transform={`translate(${n.x - w / 2}, ${n.y - 14})`}>
              <rect
                width={w}
                height={28}
                rx={4}
                fill={n.matched ? matchedBg : nodeBg}
                stroke={n.matched ? "#ff5a1f" : n.active ? nodeActive : nodeBorder}
                strokeWidth={n.matched ? 1.5 : 1}
                style={n.matched ? { filter: "drop-shadow(0 0 10px rgba(255,90,31,0.6))" } : {}}
              />
              <text
                x={w / 2}
                y={18}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="11"
                fontWeight="600"
                fill={n.matched ? matchedText : n.active ? textDefault : textDim}
              >
                {n.label}
              </text>
              <circle cx={w / 2} cy={-2} r={2} fill="rgba(255,90,31,0.6)" />
            </g>
          );
        })}

        <text
          x="378"
          y="202"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fill="#ff5a1f"
          fontWeight="700"
        >
          MATCH
        </text>
      </svg>
    </div>
  );
}
