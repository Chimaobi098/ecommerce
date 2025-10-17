import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import { useUser } from "@auth0/nextjs-auth0";

import { GameCanvas } from "./components/game/GameCanvas";
import { BettingPanel } from "./components/game/BettingPanel";
import { HistoryPanel } from "./components/game/HistoryPanel";
import { Stats } from "./components/game/Stats";
import { useCrashGame } from "./lib/stores/useCrashGame";
import { useAudio } from "./lib/stores/useAudio";
import { FbUser } from "../../utils/firebase";

// Main App component
function CrashGame() {
  const { user, isLoading } = useUser();
  const crashGameStore = useCrashGame();
  const audioStore = useAudio();
  const [prevGameState, setPrevGameState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user email and balance from Firestore - only when user changes
  useEffect(() => {
    if (user?.email && !isInitialized) {
      // Set user email
      crashGameStore.setUserEmail(user.email);
      
      // Get balance from localStorage/Firestore
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const fbUser: FbUser = JSON.parse(userString);
          crashGameStore.setBalance(fbUser.gameWalletBalance || 0);
          console.log("Initial balance loaded:", fbUser.gameWalletBalance);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
      
      // Sync balance to ensure it's up to date
      crashGameStore.syncBalanceFromFirestore();
      setIsInitialized(true);
    }
  }, [user?.email]); // Only re-run when user email changes

  // Initialize game and audio on component mount - ONLY ONCE
  useEffect(() => {
    // Initialize audio system first
    audioStore.initialize();
    
    // Initialize game state
    crashGameStore.initializeGame();
  }, []); // Empty deps - only run once

  // Handle sound effects based on game state changes
  useEffect(() => {
    const { gameState } = crashGameStore;
    
    // Skip on first render
    if (prevGameState === null) {
      setPrevGameState(gameState);
      return;
    }

    // Game state transitions
    if (prevGameState !== gameState) {
      if (gameState === "flying") {
        // Game just started flying
        audioStore.playStart();
        audioStore.startTickLoop();
      } else if (gameState === "crashed") {
        // Game just crashed
        audioStore.playHit();
        audioStore.stopTickLoop();
      }

      // Update previous state
      setPrevGameState(gameState);
    }
  }, [crashGameStore.gameState]); // Only depend on gameState

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Aviator Crash Game</h1>
          <p className="text-xl mb-8">Please log in to play</p>
          <a 
            href="/api/auth/login" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold inline-block"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <header className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Aviator Crash Game</h1>
            {crashGameStore.gameState === "crashed" && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                CRASHED
              </span>
            )}
            {crashGameStore.gameState === "flying" && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                FLYING
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Stats />
            <div className="text-sm">
              <span className="opacity-70">Player: </span>
              <span className="font-semibold">{user.name || user.email}</span>
            </div>
          </div>
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