export function Header() {
  return (
    <header className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="logo-orbital">
          <span className="logo-b">B</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">BOELANGOESONK</h1>
      </div>

      <nav className="flex gap-8">
        <a
          href="#"
          className="text-primary font-medium border-b-2 border-primary pb-1"
        >
          VISUALIZER
        </a>
      </nav>

      <div className="w-32" />
    </header>
  );
}
