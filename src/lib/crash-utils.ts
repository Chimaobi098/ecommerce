import { GameResult, UserStats } from '@/types/crash';

/**
 * Generate a provably fair crash point
 * In production, this should use a cryptographically secure method
 * with server-side validation and hash verification
 */
export const generateCrashPoint = (): number => {
  // Simple implementation for demo purposes
  const random = Math.random();
  
  // Use a realistic crash distribution
  // Most crashes happen between 1x-3x, with decreasing probability for higher multipliers
  let crashPoint: number;
  
  if (random < 0.33) {
    // 33% chance of crashing between 1.0x - 1.99x
    crashPoint = 1 + Math.random() * 0.99;
  } else if (random < 0.66) {
    // 33% chance of crashing between 2.0x - 4.99x
    crashPoint = 2 + Math.random() * 2.99;
  } else if (random < 0.88) {
    // 22% chance of crashing between 5.0x - 9.99x
    crashPoint = 5 + Math.random() * 4.99;
  } else if (random < 0.96) {
    // 8% chance of crashing between 10x - 49.99x
    crashPoint = 10 + Math.random() * 39.99;
  } else {
    // 4% chance of very high multipliers (50x - 1000x)
    crashPoint = 50 + Math.random() * 950;
  }
  
  return Math.floor(crashPoint * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate multiplier based on elapsed time and target crash point
 */
export const calculateMultiplier = (elapsedMs: number, crashPoint: number): number => {
  const elapsedSeconds = elapsedMs / 1000;
  
  if (elapsedSeconds <= 0) return 1.0;
  
  // Slow start for first second
  if (elapsedSeconds < 1) {
    return 1 + (elapsedSeconds * 0.1);
  }
  
  // Exponential growth after first second
  const adjustedTime = (elapsedSeconds - 1) / 10;
  const multiplier = 1.1 + Math.pow(adjustedTime, 1.2) * (crashPoint - 1.1);
  
  return Math.min(multiplier, crashPoint);
};

/**
 * Calculate user statistics from game history
 */
export const calculateUserStats = (
  gameHistory: GameResult[],
  betHistory: Array<{ bet: number; win: number; multiplier: number }>
): UserStats => {
  if (betHistory.length === 0) {
    return {
      totalBets: 0,
      totalWon: 0,
      totalLost: 0,
      biggestWin: 0,
      longestStreak: 0,
      averageMultiplier: 0
    };
  }
  
  const totalBets = betHistory.length;
  const totalWon = betHistory.reduce((sum, bet) => sum + bet.win, 0);
  const totalLost = betHistory.reduce((sum, bet) => sum + (bet.win > 0 ? 0 : bet.bet), 0);
  const biggestWin = Math.max(...betHistory.map(bet => bet.win));
  
  // Calculate longest winning streak
  let longestStreak = 0;
  let currentStreak = 0;
  
  betHistory.forEach(bet => {
    if (bet.win > bet.bet) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  const averageMultiplier = betHistory.reduce((sum, bet) => sum + bet.multiplier, 0) / totalBets;
  
  return {
    totalBets,
    totalWon,
    totalLost,
    biggestWin,
    longestStreak,
    averageMultiplier: Math.round(averageMultiplier * 100) / 100
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format multiplier for display
 */
export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(2)}x`;
};

/**
 * Get color class based on multiplier value
 */
export const getMultiplierColor = (multiplier: number, crashed: boolean = false): string => {
  if (crashed) return 'text-red-500';
  if (multiplier < 2) return 'text-green-400';
  if (multiplier < 5) return 'text-yellow-400';
  if (multiplier < 10) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Get gradient class based on multiplier value
 */
export const getMultiplierGradient = (multiplier: number, crashed: boolean = false): string => {
  if (crashed) return 'from-red-600 to-red-400';
  if (multiplier < 2) return 'from-green-600 to-green-400';
  if (multiplier < 5) return 'from-yellow-600 to-yellow-400';
  if (multiplier < 10) return 'from-orange-600 to-orange-400';
  return 'from-red-600 to-red-400';
};

/**
 * Validate bet amount
 */
export const validateBetAmount = (
  amount: number, 
  balance: number, 
  minBet: number = 1, 
  maxBet: number = Infinity
): { valid: boolean; error?: string } => {
  if (amount < minBet) {
    return { valid: false, error: `Minimum bet is $${minBet}` };
  }
  
  if (amount > maxBet) {
    return { valid: false, error: `Maximum bet is $${maxBet}` };
  }
  
  if (amount > balance) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  if (!Number.isInteger(amount)) {
    return { valid: false, error: 'Bet amount must be a whole number' };
  }
  
  return { valid: true };
};

/**
 * Validate auto cash out multiplier
 */
export const validateAutoCashOut = (multiplier: number): { valid: boolean; error?: string } => {
  if (multiplier < 1.01) {
    return { valid: false, error: 'Minimum cash out is 1.01x' };
  }
  
  if (multiplier > 1000) {
    return { valid: false, error: 'Maximum cash out is 1000x' };
  }
  
  return { valid: true };
};

/**
 * Generate unique ID for bets and games
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
};

/**
 * Calculate house edge for transparency
 */
export const calculateHouseEdge = (gameHistory: GameResult[]): number => {
  if (gameHistory.length === 0) return 0;
  
  // Theoretical RTP calculation based on crash points
  const averageCrashPoint = gameHistory.reduce((sum, game) => sum + game.crashPoint, 0) / gameHistory.length;
  
  // Simple house edge calculation (in a real implementation, this would be more complex)
  const theoreticalRTP = Math.min(0.99, 1 / averageCrashPoint * 0.99);
  const houseEdge = (1 - theoreticalRTP) * 100;
  
  return Math.max(0, Math.min(5, houseEdge)); // Cap between 0-5%
};

/**
 * Get game phase display text
 */
export const getPhaseDisplayText = (phase: string, countdown?: number): string => {
  switch (phase) {
    case 'waiting':
      return 'Waiting for players...';
    case 'countdown':
      return countdown ? `Starting in ${countdown}s` : 'Starting soon...';
    case 'flying':
      return 'Rocket is flying!';
    case 'crashed':
      return 'Rocket crashed!';
    default:
      return 'Unknown phase';
  }
};

/**
 * Calculate potential winnings
 */
export const calculatePotentialWin = (betAmount: number, multiplier: number): number => {
  return Math.floor(betAmount * multiplier);
};

/**
 * Check if multiplier qualifies as a "big win"
 */
export const isBigWin = (multiplier: number): boolean => {
  return multiplier >= 10;
};

/**
 * Get risk level based on auto cash out setting
 */
export const getRiskLevel = (autoCashOut: number): 'low' | 'medium' | 'high' | 'extreme' => {
  if (autoCashOut <= 2) return 'low';
  if (autoCashOut <= 5) return 'medium';
  if (autoCashOut <= 10) return 'high';
  return 'extreme';
};

/**
 * Format time duration for display
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  return `${seconds}s`;
};

/**
 * Local storage helpers for persisting game state
 */
export const storage = {
  save: (key: string, data: any): void => {
    try {
      localStorage.setItem(`crash-game-${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`crash-game-${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(`crash-game-${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};