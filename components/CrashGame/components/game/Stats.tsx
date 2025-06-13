import { useState, useEffect } from "react";
import { useCrashGame } from "../../lib/stores/useCrashGame";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "../ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function Stats() {
  const { balance } = useCrashGame();
  const { isMuted, toggleMute } = useAudio();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-xs text-slate-400">Balance</div>
          <div className="font-semibold text-green-400">
            {balance.toFixed(2)}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="text-xs text-slate-400">Time</div>
          <div className="font-mono">{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleMute}>
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </Button>
    </div>
  );
}
