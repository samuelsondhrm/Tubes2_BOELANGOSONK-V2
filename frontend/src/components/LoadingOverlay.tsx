export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background-dark/60 backdrop-blur-sm z-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 loading-ring" />
        <div className="absolute inset-[6px] loading-ring-reverse" />
        <div className="absolute inset-[12px] loading-ring-slow" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#ff5a1f] animate-pulse" />
      </div>
      <p className="text-xs uppercase tracking-widest text-white/60 font-medium">
        Scanning DOM Tree...
      </p>
    </div>
  );
}
