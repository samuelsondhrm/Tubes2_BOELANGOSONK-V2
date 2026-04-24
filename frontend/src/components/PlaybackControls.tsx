// Speed presets: interval ms + batch size (steps per tick)
// Instant fires every 16ms (1 frame) and jumps many steps at once
export const SPEED_PRESETS = [
  { label: "Slow",    ms: 500,  batch: 1  },
  { label: "Normal",  ms: 200,  batch: 1  },
  { label: "Fast",    ms: 16,   batch: 5  },
  { label: "Instant", ms: 16,   batch: 25 },
] as const;

export type SpeedPreset = (typeof SPEED_PRESETS)[number];

interface Props {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: (val: boolean) => void;
  onStepChange: (step: number) => void;
  onReplay: () => void;
  speed: number;           // ms interval — kept for backward compat
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onStepChange,
  onReplay,
  speed,
  onSpeedChange,
}: Props) {
  if (totalSteps === 0) return null;

  const preset = SPEED_PRESETS.find((p) => p.ms === speed) ?? SPEED_PRESETS[1];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-2xl flex items-center gap-6 z-50 w-[90%] max-w-2xl border border-primary/20">
      <button
        onClick={onReplay}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary cursor-pointer"
        title="Replay"
      >
        <span className="material-icons">replay</span>
      </button>

      <button
        onClick={() => onTogglePlay(!isPlaying)}
        className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:scale-110 transition-all cursor-pointer"
      >
        <span className="material-icons">{isPlaying ? "pause" : "play_arrow"}</span>
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50 font-bold">
          <span>Step {currentStep} / {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={totalSteps}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1 w-24">
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold text-center">Speed</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-transparent text-xs outline-none cursor-pointer text-primary"
        >
          {SPEED_PRESETS.map((p) => (
            <option key={p.label} value={p.ms}>
              {p.label}
            </option>
          ))}
        </select>
        {/* Badge shows effective steps/tick for Fast & Instant */}
        {preset.batch > 1 && (
          <span className="text-[9px] text-center opacity-40 font-mono">
            ×{preset.batch} steps/tick
          </span>
        )}
      </div>
    </div>
  );
}