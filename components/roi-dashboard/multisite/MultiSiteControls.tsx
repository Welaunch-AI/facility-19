import { Pause, Play, Sparkles, Zap } from "lucide-react";
import { useMultiSite } from "@/lib/roi-dashboard/multisite/store";

export function MultiSiteControls() {
  const { paused, setPaused, explainMode, setExplainMode, injectEvent } = useMultiSite();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => setPaused(!paused)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        {paused ? "Resume live" : "Pause live"}
      </button>
      <button onClick={injectEvent}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
        <Zap className="h-3.5 w-3.5" /> Trigger event
      </button>
      <button onClick={() => setExplainMode(!explainMode)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          explainMode ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
        }`}>
        <Sparkles className="h-3.5 w-3.5" /> Explain mode
      </button>
    </div>
  );
}
