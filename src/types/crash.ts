export interface GameState {
    phase: 'waiting' | 'countdown' | 'flying' | 'crashed';
    multiplier: number;
    countdown: number;
    startTime: number | null;
  }
  
  export interface Bet {
    id: string;
    amount: number;
    cashOutAt: number;
    placed: boolean;
    cashedOut: boolean;
    winAmount?: number;
    timestamp: number;
  }
  
  export interface GameResult {
    id: string;
    crashPoint: number;
    timestamp: number;
    duration: number; // in milliseconds
  }
  
  export interface MultiplierPoint {
    time: number;
    multiplier: number;
  }
  
  export interface UserStats {
    totalBets: number;
    totalWon: number;
    totalLost: number;
    biggestWin: number;
    longestStreak: number;
    averageMultiplier: number;
  }
  
  export interface GameSettings {
    betAmount: number;
    autoCashOut: number;
    autoMode: boolean;
    soundEnabled: boolean;
    animationsEnabled: boolean;
  }
  
  export type GamePhase = GameState['phase'];
  
  export interface CrashGameProps {
    initialBalance?: number;
    minBet?: number;
    maxBet?: number;
    maxMultiplier?: number;
  }