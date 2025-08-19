'use client';

import React from 'react';
import { TrendingUp, Rocket, Bomb } from 'lucide-react';

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

interface GameChartProps {
  gameState: GameState;
  multiplierHistory: Array<{ time: number; multiplier: number }>;
  currentBet: Bet | null;
}

const GameChart: React.FC<GameChartProps> = ({
  gameState,
  multiplierHistory,
  currentBet
}) => {
  const getMultiplierColor = () => {
    if (gameState.phase === 'crashed') return 'text-red-500';
    if (gameState.multiplier < 2) return 'text-green-400';
    if (gameState.multiplier < 5) return 'text-yellow-400';
    if (gameState.multiplier < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMultiplierGradient = () => {
    if (gameState.phase === 'crashed') return 'from-red-600 to-red-400';
    if (gameState.multiplier < 2) return 'from-green-600 to-green-400';
    if (gameState.multiplier < 5) return 'from-yellow-600 to-yellow-400';
    if (gameState.multiplier < 10) return 'from-orange-600 to-orange-400';
    return 'from-red-600 to-red-400';
  };

  const getStatusIcon = () => {
    switch (gameState.phase) {
      case 'waiting':
        return <TrendingUp className="h-8 w-8 text-gray-400" />;
      case 'countdown':
        return <Rocket className="h-8 w-8 text-blue-400" />;
      case 'flying':
        return <Rocket className="h-8 w-8 text-green-400 animate-bounce" />;
      case 'crashed':
        return <Bomb className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (gameState.phase) {
      case 'waiting':
        return 'Preparing for takeoff...';
      case 'countdown':
        return `Launching in ${gameState.countdown}s`;
      case 'flying':
        return 'Rocket is flying!';
      case 'crashed':
        return `Crashed at ${gameState.multiplier.toFixed(2)}x`;
    }
  };

  const chartHeight = 300;
  const chartWidth = 600;
  
  // Create SVG path for multiplier line
  const createPath = () => {
    if (multiplierHistory.length < 2) return '';
    
    const maxTime = Math.max(...multiplierHistory.map(h => h.time));
    const maxMultiplier = Math.max(...multiplierHistory.map(h => h.multiplier));
    
    const points = multiplierHistory.map(point => {
      const x = (point.time / maxTime) * chartWidth;
      const y = chartHeight - ((point.multiplier - 1) / (maxMultiplier - 1)) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points}`;
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {getStatusIcon()}
            Crash Chart
          </h2>
          <div className="text-sm text-gray-400">
            {getStatusText()}
          </div>
        </div>

        {/* Multiplier Display */}
        <div className="text-center mb-6">
          <div className={`text-7xl md:text-8xl font-bold mb-2 bg-gradient-to-r ${getMultiplierGradient()} bg-clip-text text-transparent`}>
            {gameState.multiplier.toFixed(2)}x
          </div>
          
          {gameState.phase === 'countdown' && (
            <div className="text-3xl font-bold text-blue-400">
              {gameState.countdown}
            </div>
          )}
          
          {currentBet && !currentBet.cashedOut && gameState.phase === 'flying' && (
            <div className="text-lg text-green-400">
              Potential win: ${Math.floor(currentBet.amount * gameState.multiplier)}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="px-6 pb-6">
        <div className="bg-gray-900 rounded-lg p-4 h-80 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="text-gray-600">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Multiplier line chart */}
          {gameState.phase === 'flying' && multiplierHistory.length > 1 && (
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={createPath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={getMultiplierColor()}
              />
              {/* Gradient fill under the line */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path
                d={`${createPath()} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                fill="url(#chartGradient)"
                className={getMultiplierColor()}
              />
            </svg>
          )}

          {/* Center content when not flying */}
          {gameState.phase !== 'flying' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {gameState.phase === 'waiting' && (
                  <div className="text-gray-500">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Waiting for next round...</p>
                  </div>
                )}
                
                {gameState.phase === 'countdown' && (
                  <div className="text-blue-400">
                    <Rocket className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg">Get ready for takeoff!</p>
                  </div>
                )}
                
                {gameState.phase === 'crashed' && (
                  <div className="text-red-500">
                    <Bomb className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Rocket crashed!</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Next round starting soon...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flying rocket animation */}
          {gameState.phase === 'flying' && (
            <div 
              className="absolute transition-all duration-75 ease-linear"
              style={{
                left: `${Math.min((gameState.multiplier - 1) * 50, 85)}%`,
                bottom: `${Math.min((gameState.multiplier - 1) * 30, 75)}%`,
                transform: 'translate(-50%, 50%)'
              }}
            >
              <div className="text-2xl animate-pulse">🚀</div>
            </div>
          )}

          {/* Auto cash out line indicator */}
          {currentBet && !currentBet.cashedOut && (
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute w-full border-t-2 border-dashed border-yellow-400 opacity-60"
                style={{
                  bottom: `${Math.min((currentBet.cashOutAt - 1) * 30, 75)}%`
                }}
              >
                <span className="absolute -right-2 -top-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold">
                  {currentBet.cashOutAt}x
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chart controls/info */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Safe Zone (1x - 2x)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Risky Zone (2x - 10x)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Danger Zone (10x+)</span>
            </div>
          </div>
          
          {gameState.phase === 'flying' && (
            <div>
              Time: {Math.floor((Date.now() - (gameState.startTime || Date.now())) / 1000)}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameChart;