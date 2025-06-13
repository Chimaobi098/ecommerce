import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";

// import "@fontsource/inter";
import { GameCanvas } from "./components/game/GameCanvas";
import { BettingPanel } from "./components/game/BettingPanel";
import { HistoryPanel } from "./components/game/HistoryPanel";
import { Stats } from "./components/game/Stats";
import { useCrashGame } from "./lib/stores/useCrashGame";
import { useAudio } from "./lib/stores/useAudio";

// This is the main entry point for the Crash Game application.
// Main App component
function CrashGame() {
  const { initializeGame, gameState } = useCrashGame();
  const {
    initialize: initializeAudio,
    playStart,
    playHit,
    startTickLoop,
    stopTickLoop,
  } = useAudio();
  const [prevGameState, setPrevGameState] = useState<string | null>(null);

  // Initialize game and audio on component mount
  useEffect(() => {
    // Initialize game state
    initializeGame();

    // Initialize audio system
    initializeAudio();
  }, [initializeGame, initializeAudio]);

  // Handle sound effects based on game state changes
  useEffect(() => {
    // Skip on first render
    if (prevGameState === null) {
      setPrevGameState(gameState);
      return;
    }

    // Game state transitions
    if (prevGameState !== gameState) {
      if (gameState === "flying") {
        // Game just started flying
        playStart();
        // Start tick loop for flying state
        startTickLoop();
      } else if (gameState === "crashed") {
        // Game just crashed
        playHit();
        // Stop tick loop when crashed
        stopTickLoop();
      }

      // Update previous state
      setPrevGameState(gameState);
    }
  }, [
    gameState,
    prevGameState,
    playStart,
    playHit,
    startTickLoop,
    stopTickLoop,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <header className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Aviator Crash Game</h1>
            {gameState === "crashed" && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                CRASHED
              </span>
            )}
            {gameState === "flying" && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                FLYING
              </span>
            )}
          </div>
          <Stats />
        </header>

        <main className="container mx-auto p-4 grid gap-6 md:grid-cols-3 md:gap-8">
          <div className="md:col-span-2 h-[400px] md:h-[500px] relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <GameCanvas />
          </div>

          <div className="flex flex-col gap-4">
            <BettingPanel />
            <HistoryPanel />
          </div>
        </main>

        <footer className="p-4 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>Virtual currency only. No real money involved.</p>
          <p className="mt-1 text-xs opacity-60">
            Max multiplier: 50.00×, Max flight time: 60 seconds
          </p>
        </footer>
      </div>

      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default CrashGame;
