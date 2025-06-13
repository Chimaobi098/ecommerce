import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
// import { apiRequest } from "@/lib/queryClient";
// import { ToastContainer, toast } from "react-toastify";
import { useAudio } from "./useAudio";

// Game states
export type GameState = "idle" | "betting" | "flying" | "crashed";

// Game history item
export interface HistoryItem {
  id: number;
  crashPoint: number;
  timestamp: number;
}

// Player bet
export interface PlayerBet {
  amount: number;
  active: boolean;
  cashedOut: boolean;
  cashedOutAt: number | null;
  winnings: number;
}

interface CrashGameState {
  // Game state
  gameState: GameState;
  multiplier: number;
  cashoutMultiplier: number;
  nextGameTimestamp: number | null;

  // Player data
  balance: number;
  currentBet: PlayerBet;
  betAmount: number;
  autoCashout: number | null;

  // Game history
  history: HistoryItem[];

  // Functions
  initializeGame: () => void;
  placeBet: (amount: number, autoCashout: number | null) => void;
  cashout: () => void;
  setBetAmount: (amount: number) => void;
  setAutoCashout: (multiplier: number | null) => void;

  // Internal state handlers
  _startRound: (crashPoint: number, duration: number) => void;
  _updateMultiplier: (newMultiplier: number) => void;
  _endRound: (crashPoint: number) => void;
  _processBet: (crashPoint: number) => void;
  _resetGame: () => void;
}

export const useCrashGame = create<CrashGameState>()(
  subscribeWithSelector((set, get) => ({
    // Game state
    gameState: "idle",
    multiplier: 1,
    cashoutMultiplier: 0,
    nextGameTimestamp: null,

    // Player data
    balance: 1000, // Starting balance
    currentBet: {
      amount: 0,
      active: false,
      cashedOut: false,
      cashedOutAt: null,
      winnings: 0,
    },
    betAmount: 10, // Default bet amount
    autoCashout: null,

    // Game history
    history: [],

    // Initialize game - STANDALONE CLIENT IMPLEMENTATION
    initializeGame: () => {
      console.log("Initializing client-side demo game");

      // Generate some random history
      const generateHistory = () => {
        const history = [];
        for (let i = 10; i > 0; i--) {
          const crashPoint =
            Math.random() < 0.3
              ? 1 + Math.random() * 0.5 // 30% chance of early crash (1.0-1.5x)
              : Math.random() < 0.6
              ? 1.5 + Math.random() * 3.5 // 30% chance of medium crash (1.5-5x)
              : 5 + Math.random() * 45; // 40% chance of high crash (5-50x)

          history.push({
            id: i,
            crashPoint: parseFloat(crashPoint.toFixed(2)),
            timestamp: Date.now() - i * 30000,
          });
        }
        return history;
      };

      // Set initial game state
      set({
        history: generateHistory(),
        balance: 1000, // Starting balance
        gameState: "betting",
        nextGameTimestamp: Date.now() + 10000, // 10 seconds to next round
      });

      // Start betting phase
      setTimeout(() => {
        // Generate a random crash point
        const crashPoint =
          Math.random() < 0.3
            ? 1 + Math.random() * 0.5 // 30% chance of early crash (1.0-1.5x)
            : Math.random() < 0.6
            ? 1.5 + Math.random() * 3.5 // 30% chance of medium crash (1.5-5x)
            : 5 + Math.random() * 45; // 40% chance of high crash (5-50x)

        // Calculate flight duration based on crash point
        const duration =
          crashPoint < 5
            ? crashPoint * 2000 // Faster for small multipliers
            : 10000 + crashPoint * 800; // Longer for bigger multipliers

        console.log(
          `Starting round with crash at ${crashPoint.toFixed(2)}x after ${(
            duration / 1000
          ).toFixed(1)}s`
        );

        // Start the round
        get()._startRound(crashPoint, duration);
      }, 10000);
    },

    // Place a bet - simplified for demo
    placeBet: (amount, autoCashout) => {
      const { gameState, balance } = get();

      // Validate bet
      if (gameState !== "betting") {
        console.log("Betting is currently closed");
        return;
      }

      if (amount > balance) {
        console.log("Insufficient balance");
        return;
      }

      if (amount <= 0) {
        console.log("Bet amount must be greater than 0");
        return;
      }

      // For demo, skip server API and update local state directly
      set({
        balance: balance - amount,
        currentBet: {
          amount,
          active: true,
          cashedOut: false,
          cashedOutAt: null,
          winnings: 0,
        },
        autoCashout,
      });

      console.log(`Bet placed: ${amount}, auto cashout: ${autoCashout}`);
    },

    // Manually cash out - simplified for demo
    cashout: () => {
      const { gameState, currentBet, multiplier } = get();

      // Validate cashout
      if (
        gameState !== "flying" ||
        !currentBet.active ||
        currentBet.cashedOut
      ) {
        return;
      }

      // For demo, update local state directly (bypass API)
      const winnings = currentBet.amount * multiplier;

      // Update bet state
      set({
        currentBet: {
          ...currentBet,
          active: false,
          cashedOut: true,
          cashedOutAt: multiplier,
          winnings,
        },
        balance: get().balance + winnings,
        cashoutMultiplier: multiplier, // For display purposes
      });

      // Play success sound
      const { playSuccess } = useAudio.getState();
      playSuccess();

      console.log(
        `Cashed out at ${multiplier.toFixed(2)}x: +${winnings.toFixed(2)}`
      );
    },

    // Update bet amount
    setBetAmount: (amount) => {
      set({ betAmount: amount });
    },

    // Update auto cashout value
    setAutoCashout: (multiplier) => {
      set({ autoCashout: multiplier });
    },

    // Internal: Start a new round - SIMPLIFIED CLIENT-SIDE IMPLEMENTATION
    _startRound: (crashPoint, duration) => {
      // Use a random crashPoint for client-side demo
      const randomCrashPoint =
        crashPoint ||
        (Math.random() < 0.3
          ? 1 + Math.random() * 0.5 // 30% chance of early crash (1.0-1.5x)
          : Math.random() < 0.6
          ? 1.5 + Math.random() * 3.5 // 30% chance of medium crash (1.5-5x)
          : 5 + Math.random() * 45); // 40% chance of high crash (5-50x)

      // Using a smaller duration if none provided for better demo
      const gameDuration =
        duration ||
        (randomCrashPoint < 5
          ? randomCrashPoint * 2000 // Faster for small multipliers
          : 10000 + randomCrashPoint * 800); // Longer for bigger multipliers

      const { currentBet, autoCashout } = get();

      // Reset game state
      set({
        gameState: "flying",
        multiplier: 1,
        cashoutMultiplier: 0,
      });

      // Start updating multiplier
      let startTime = Date.now();
      let endTime = startTime + gameDuration;

      // Update multiplier in real-time
      const updateInterval = setInterval(() => {
        const now = Date.now();

        // If game should be over, stop updating
        if (now >= endTime) {
          clearInterval(updateInterval);
          return;
        }

        // Calculate new multiplier based on elapsed time
        const elapsed = now - startTime;
        const progress = elapsed / gameDuration;

        // Slower exponential growth function with max limit
        const newMultiplier = Math.min(
          1 + Math.exp(progress * 2.8) - 1, // Slower growth rate
          randomCrashPoint,
          50 // Hard cap at 50x
        );

        get()._updateMultiplier(newMultiplier);

        // Check for auto-cashout
        if (
          autoCashout !== null &&
          newMultiplier >= autoCashout &&
          currentBet.active &&
          !currentBet.cashedOut
        ) {
          get().cashout();
        }
      }, 33); // ~30fps

      // Set a timeout to end the game
      setTimeout(() => {
        clearInterval(updateInterval);
        get()._endRound(randomCrashPoint);
      }, gameDuration);
    },

    // Internal: Update the current multiplier
    _updateMultiplier: (newMultiplier) => {
      set({ multiplier: newMultiplier });
    },

    // Internal: End the current round
    _endRound: (crashPoint) => {
      const { hitSound } = useAudio.getState();

      // Process any active bets
      get()._processBet(crashPoint);

      // Update game state
      set((state) => ({
        gameState: "crashed",
        history: [
          {
            id: state.history.length > 0 ? state.history[0].id + 1 : 1,
            crashPoint,
            timestamp: Date.now(),
          },
          ...state.history.slice(0, 9), // Keep only 10 most recent
        ],
      }));

      // Schedule reset - shorter wait time for better game flow
      setTimeout(() => {
        get()._resetGame();
      }, 1500);
    },

    // Internal: Process the player's bet
    _processBet: (crashPoint) => {
      const { currentBet, balance } = get();

      // Skip if no active bet or already cashed out
      if (!currentBet.active || currentBet.cashedOut) {
        return;
      }

      // If player hasn't cashed out and the game crashed
      if (crashPoint === get().multiplier) {
        // Update bet state to reflect loss
        set({
          currentBet: {
            ...currentBet,
            active: false,
            cashedOut: false,
            cashedOutAt: null,
            winnings: 0,
          },
        });

        // Play crash sound
        const { playHit } = useAudio.getState();
        playHit();

        return;
      }

      // Process successful cashout
      const winnings = currentBet.amount * get().multiplier;

      // Update bet state
      set({
        currentBet: {
          ...currentBet,
          active: false,
          cashedOut: true,
          cashedOutAt: get().multiplier,
          winnings,
        },
        balance: balance + winnings,
      });
    },

    // Internal: Reset game state for next round - FULLY OFFLINE IMPLEMENTATION
    _resetGame: () => {
      const waitTime = 5000; // 5 seconds until next round - faster gameplay

      set({
        gameState: "betting",
        multiplier: 1,
        nextGameTimestamp: Date.now() + waitTime,
        currentBet: {
          amount: 0,
          active: false,
          cashedOut: false,
          cashedOutAt: null,
          winnings: 0,
        },
      });

      // Start next round after 10 seconds
      setTimeout(() => {
        // Generate a random crash point
        const crashPoint =
          Math.random() < 0.3
            ? 1 + Math.random() * 0.5 // 30% chance of early crash (1.0-1.5x)
            : Math.random() < 0.6
            ? 1.5 + Math.random() * 3.5 // 30% chance of medium crash (1.5-5x)
            : 5 + Math.random() * 45; // 40% chance of high crash (5-50x)

        // Calculate flight duration based on crash point
        const duration =
          crashPoint < 5
            ? crashPoint * 2000 // Faster for small multipliers
            : 10000 + crashPoint * 800; // Longer for bigger multipliers

        console.log(
          `Starting round with crash at ${crashPoint.toFixed(2)}x after ${(
            duration / 1000
          ).toFixed(1)}s`
        );

        // Start the round
        get()._startRound(crashPoint, duration);
      }, waitTime);
    },
  }))
);
