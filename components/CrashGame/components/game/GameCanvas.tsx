import { useEffect, useRef, useState } from "react";
import { useCrashGame } from "../../lib/stores/useCrashGame";
import { Plane } from "./Plane";
import { CashoutButton } from "./CashoutButton";
import { Background } from "./Background";
import { MultiplierDisplay } from "./MultiplierDisplay";
import { toast } from "sonner";

// import { ToastContainer, toast } from "react-toastify";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, multiplier, cashoutMultiplier } = useCrashGame();
  // Create a ref outside of the effect to track previous game state
  const prevGameStateRef = useRef<string | null>(null);

  // Setup canvas context and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Handle resize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Show toast notifications only once at the beginning of each game state
  useEffect(() => {
    // Only show toast when the state changes
    if (prevGameStateRef.current !== gameState) {
      if (gameState === "flying") {
        toast.info(
          <div className="font-bold">🚀 BIRD TAKEOFF!</div>
          // { duration: 2000 }
        );
      } else if (gameState === "crashed") {
        toast.error(
          <div className="font-bold">💥 CRASH @ {multiplier.toFixed(2)}x</div>
          // { duration: 3000 }
        );
      } else if (gameState === "betting") {
        toast.info(
          <div className="font-bold">🎲 PLACE YOUR BETS!</div>
          // { duration: 3000 }
        );
      }

      // Update the previous game state
      prevGameStateRef.current = gameState;
    }
  }, [gameState, multiplier]);

  return (
    <div className="relative w-full h-full">
      {/* Canvas for background and animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Game elements rendered with react */}
      <div className="absolute inset-0 w-full h-full">
        <Background gameState={gameState} />
        <Plane
          gameState={gameState}
          multiplier={multiplier}
          cashoutMultiplier={cashoutMultiplier}
        />

        {/* UI Overlays */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
          <MultiplierDisplay multiplier={multiplier} gameState={gameState} />

          <div className="self-end mb-4 mr-4">
            <CashoutButton />
          </div>
        </div>

        {/* Crash message */}
        {gameState === "crashed" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500/80 px-6 py-3 rounded-lg text-white text-3xl font-bold animate-bounce">
              CRASHED @ {multiplier.toFixed(2)}x
            </div>
          </div>
        )}

        {/* Cashout message */}
        {gameState === "flying" && cashoutMultiplier > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500/80 px-6 py-3 rounded-lg text-white text-3xl font-bold animate-pulse">
              CASHED OUT @ {cashoutMultiplier.toFixed(2)}x
            </div>
          </div>
        )}

        {/* Next round countdown */}
        {gameState === "betting" && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <CountdownTimer />
          </div>
        )}
      </div>
    </div>
  );
}

// Countdown timer component
function CountdownTimer() {
  const { nextGameTimestamp } = useCrashGame();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!nextGameTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.ceil((nextGameTimestamp - now) / 1000)
      );
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [nextGameTimestamp]);

  return (
    <div className="bg-slate-800/80 px-4 py-2 rounded-full text-white">
      Next round in: <span className="font-bold">{secondsLeft}s</span>
    </div>
  );
}
