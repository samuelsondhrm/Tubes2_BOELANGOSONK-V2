import { useState } from "react";

type Page = "home" | "visualizer";

interface NavbarProps {
  page: Page;
  setPage: (p: Page) => void;
}

/**
 * Unified navigation bar used across all pages.
 * Always renders with the same glass-backdrop wrapper
 * to guarantee visual consistency regardless of page context.
 */
export function Navbar({ page, setPage }: NavbarProps) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((d) => !d);
  };

  return (
    <nav className="app-navbar" role="navigation" aria-label="Main navigation">
      <div className="app-navbar__inner">
        {/* ── Brand ── */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-3 select-none cursor-pointer bg-transparent border-0 p-0 transition-opacity hover:opacity-90"
          title="Go to home"
        >
          <div className="logo-orbital">
            <span className="logo-b">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">BOELANGOESONK</span>
        </button>

        {/* ── Page links (centered) ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-sm font-medium tracking-widest">
          <button
            onClick={() => setPage("home")}
            className={`nav-link${page === "home" ? " active" : ""}`}
          >
            HOME
          </button>
          <button
            onClick={() => setPage("visualizer")}
            className={`nav-link${page === "visualizer" ? " active" : ""}`}
          >
            VISUALIZER
          </button>
        </div>

        {/* ── Theme toggle ── */}
        <button
          className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          <span className="material-icons text-xl">
            {isDark ? "dark_mode" : "wb_sunny"}
          </span>
        </button>
      </div>
    </nav>
  );
}
