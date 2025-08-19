'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BettingInterface from './bettingInterface';
import GameChart from './gameChart';
import GameHistory from './gameHistory';
import GameStats from './gameStats';

interface GameState {
  phase: 'waiting' | 'countdown' | 'flying' | 'crashed';
  multiplier: number;
  countdown: number;
  startTime: number | null;
}

interface Bet {
  id: string;
  amount: number;
  cashOutAt: number;
  placed: boolean;
  cashedOut: boolean;
  winAmount?: number;
}

interface GameResult {
  id: string;
  crashPoint: number;
  timestamp: number;
}

const CrashGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'waiting',
    multiplier: 1.0,
    countdown: 0,
    startTime: null,
  });

  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [multiplierHistory, setMultiplierHistory] = useState<
    Array<{ time: number; multiplier: number }>
  >([]);

  // Game settings
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState(2.0);
  const [autoMode, setAutoMode] = useState(false);

  // Refs to track intervals and prevent duplicates
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentGameIdRef = useRef<string | null>(null);
  const gameStartedRef = useRef(false);

  // Generate crash point using provably fair algorithm
  const generateCrashPoint = useCallback((): number => {
    const random = Math.random();
    const crashPoint = Math.max(
      1,
      Math.floor((100 / (random * 100)) * 100) / 100
    );
    return Math.min(crashPoint, 1000); // Cap at 1000x
  }, []);

  // Clean up intervals
  const clearIntervals = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Cash out function
  const handleCashOut = useCallback(
    (multiplier?: number) => {
      if (!currentBet || currentBet.cashedOut || gameState.phase !== 'flying')
        return;

      const cashOutMultiplier = multiplier || gameState.multiplier;
      const winAmount = Math.floor(currentBet.amount * cashOutMultiplier);

      setCurrentBet((prev) =>
        prev ? { ...prev, cashedOut: true, winAmount } : null
      );
      setBalance((prev) => prev + winAmount);
    },
    [currentBet, gameState.multiplier, gameState.phase]
  );

  // Start countdown phase
  const startCountdown = useCallback(() => {
    clearIntervals();
    
    setGameState((prev) => ({ ...prev, phase: 'countdown', countdown: 5 }));

    countdownIntervalRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.countdown <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return {
            ...prev,
            phase: 'flying',
            countdown: 0,
            startTime: Date.now(),
          };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  }, [clearIntervals]);

  // Main game loop - separated from startGame to avoid infinite loops
  useEffect(() => {
    if (gameState.phase === 'flying' && gameState.startTime && !gameStartedRef.current) {
      gameStartedRef.current = true;
      clearIntervals();
      
      const crashPoint = generateCrashPoint();
      const gameId = `game-${crypto.randomUUID()}`;
      currentGameIdRef.current = gameId;

      setMultiplierHistory([]);

      gameIntervalRef.current = setInterval(() => {
        let newMultiplier = 1;

        setGameState((prev) => {
          if (prev.phase !== 'flying') return prev;

          const elapsed = Date.now() - (prev.startTime || Date.now());
          const progress = elapsed / 1000;

          // Calculate multiplier
          if (progress < 1) {
            newMultiplier = 1 + progress * 0.1;
          } else {
            const adjustedProgress = (progress - 1) / 10;
            newMultiplier =
              1.1 + Math.pow(adjustedProgress, 1.2) * (crashPoint - 1.1);
          }

          // Auto cash out check
          if (
            currentBet &&
            !currentBet.cashedOut &&
            newMultiplier >= autoCashOut
          ) {
            handleCashOut(newMultiplier);
          }

          // Check crash
          if (newMultiplier >= crashPoint) {
            if (gameIntervalRef.current) {
              clearInterval(gameIntervalRef.current);
              gameIntervalRef.current = null;
            }

            // Only add to history if this is still the current game
            if (currentGameIdRef.current === gameId) {
              const result: GameResult = {
                id: gameId,
                crashPoint,
                timestamp: Date.now(),
              };

              setGameHistory((prev) => {
                // Check if this game ID already exists to prevent duplicates
                const exists = prev.some(game => game.id === gameId);
                if (exists) return prev;
                
                return [result, ...prev.slice(0, 19)];
              });

              if (currentBet && !currentBet.cashedOut) {
                setCurrentBet(null); // bet lost
              }

              setTimeout(() => {
                gameStartedRef.current = false;
                setGameState((prev) => ({
                  ...prev,
                  phase: 'waiting',
                  multiplier: 1.0,
                  startTime: null,
                }));

                if (autoMode) {
                  setTimeout(startCountdown, 2000);
                }
              }, 3000);
            }

            return { ...prev, phase: 'crashed', multiplier: crashPoint };
          }

          return { ...prev, multiplier: newMultiplier };
        });

        // Update history outside setGameState
        setMultiplierHistory((prevHist) => [
          ...prevHist,
          { time: Date.now(), multiplier: newMultiplier },
        ]);
      }, 50);
    }

    // Reset gameStartedRef when not flying
    if (gameState.phase !== 'flying') {
      gameStartedRef.current = false;
    }
  }, [gameState.phase, gameState.startTime, generateCrashPoint, currentBet, autoCashOut, autoMode, startCountdown, clearIntervals, handleCashOut]);

  // Place bet
  const placeBet = useCallback(() => {
    if (
      gameState.phase !== 'waiting' ||
      balance < betAmount ||
      currentBet
    )
      return;

    const bet: Bet = {
      id: `bet-${crypto.randomUUID()}`,
      amount: betAmount,
      cashOutAt: autoCashOut,
      placed: true,
      cashedOut: false,
    };

    setCurrentBet(bet);
    setBalance((prev) => prev - betAmount);

    if (!autoMode) {
      startCountdown();
    }
  }, [
    gameState.phase,
    balance,
    betAmount,
    currentBet,
    autoCashOut,
    autoMode,
    startCountdown,
  ]);

  // Auto mode effect
  useEffect(() => {
    if (
      autoMode &&
      gameState.phase === 'waiting' &&
      !currentBet &&
      balance >= betAmount
    ) {
      const timer = setTimeout(placeBet, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoMode, gameState.phase, currentBet, balance, betAmount, placeBet]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearIntervals();
    };
  }, [clearIntervals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CRASH GAME
          </h1>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              Balance: <span className="font-bold text-green-400">${balance}</span>
            </div>
            {currentBet && (
              <div className="bg-blue-800 px-4 py-2 rounded-lg">
                Bet: <span className="font-bold">${currentBet.amount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Game Chart */}
            <GameChart
              gameState={gameState}
              multiplierHistory={multiplierHistory}
              currentBet={currentBet}
            />

            {/* Game Stats */}
            <GameStats
              gameHistory={gameHistory}
              currentMultiplier={gameState.multiplier}
              gamePhase={gameState.phase}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Betting Interface */}
            <BettingInterface
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              autoCashOut={autoCashOut}
              setAutoCashOut={setAutoCashOut}
              autoMode={autoMode}
              setAutoMode={setAutoMode}
              gamePhase={gameState.phase}
              currentBet={currentBet}
              onPlaceBet={placeBet}
              onCashOut={() => handleCashOut()}
              currentMultiplier={gameState.multiplier}
              countdown={gameState.countdown}
            />

            {/* Game History */}
            <GameHistory games={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;