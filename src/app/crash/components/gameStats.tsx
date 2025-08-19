'use client';

import React from 'react';
import { BarChart3, Target, Clock, Zap } from 'lucide-react';

interface GameResult {
  id: string;
  crashPoint: number;
  timestamp: number;
}

interface GameStatsProps {
  gameHistory: GameResult[];
  currentMultiplier: number;
  gamePhase: 'waiting' | 'countdown' | 'flying' | 'crashed';
}

const GameStats: React.FC<GameStatsProps> = ({
  gameHistory,
  currentMultiplier,
  gamePhase
}) => {
  const getDistribution = () => {
    if (gameHistory.length === 0) return {};
    
    const ranges = {
      '1.0x - 1.5x': 0,
      '1.5x - 2.0x': 0,
      '2.0x - 5.0x': 0,
      '5.0x - 10x': 0,
      '10x+': 0
    };

    gameHistory.forEach(game => {
      if (game.crashPoint < 1.5) ranges['1.0x - 1.5x']++;
      else if (game.crashPoint < 2.0) ranges['1.5x - 2.0x']++;
      else if (game.crashPoint < 5.0) ranges['2.0x - 5.0x']++;
      else if (game.crashPoint < 10.0) ranges['5.0x - 10x']++;
      else ranges['10x+']++;
    });

    return ranges;
  };

const distribution: Record<string, number> = getDistribution();
const maxCount = Math.max(...Object.values(distribution));

const getRecentTrend = () => {
    if (gameHistory.length < 5) return 'insufficient-data';
    
    const recent = gameHistory.slice(0, 5);
    const averageRecent = recent.reduce((sum, game) => sum + game.crashPoint, 0) / recent.length;
    
    if (averageRecent > 3) return 'bullish';
    if (averageRecent < 1.8) return 'bearish';
    return 'neutral';
};

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-400 bg-green-900';
      case 'bearish': return 'text-red-400 bg-red-900';
      case 'neutral': return 'text-yellow-400 bg-yellow-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      case 'neutral': return '➡️';
      default: return '❓';
    }
  };

  const getConsecutiveCount = () => {
    if (gameHistory.length === 0) return { high: 0, low: 0 };
    
    let highStreak = 0;
    let lowStreak = 0;
    
    for (const game of gameHistory) {
      if (game.crashPoint >= 2) {
        highStreak++;
        lowStreak = 0;
      } else {
        lowStreak++;
        highStreak = 0;
      }
      
      if (lowStreak > 0 || highStreak > 0) break;
    }
    
    return { high: highStreak, low: lowStreak };
  };

  const streaks = getConsecutiveCount();
  const trend = getRecentTrend();

  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-bold">Game Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Current Status */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">Current</span>
          </div>
          <div className="text-xl font-bold text-white">
            {currentMultiplier.toFixed(2)}x
          </div>
          <div className="text-xs text-gray-400 capitalize">
            {gamePhase}
          </div>
        </div>

        {/* Games Played */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Games</span>
          </div>
          <div className="text-xl font-bold text-white">
            {gameHistory.length}
          </div>
          <div className="text-xs text-gray-400">
            Total played
          </div>
        </div>

        {/* Current Trend */}
        <div className={`p-4 rounded-lg ${getTrendColor(trend)} bg-opacity-20 border border-opacity-30`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Trend</span>
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            <span>{getTrendIcon(trend)}</span>
            <span className="capitalize">{trend}</span>
          </div>
          <div className="text-xs opacity-70">
            Last 5 games
          </div>
        </div>

        {/* Streak Info */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400">Streak</span>
          </div>
          <div className="text-xl font-bold text-white">
            {streaks.high > 0 ? (
              <span className="text-green-400">{streaks.high} 🔥</span>
            ) : streaks.low > 0 ? (
              <span className="text-red-400">{streaks.low} 🧊</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {streaks.high > 0 ? 'High wins' : streaks.low > 0 ? 'Low crashes' : 'No streak'}
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      {gameHistory.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Crash Point Distribution ({gameHistory.length} games)
          </h4>
          
          <div className="space-y-3">
            {Object.entries(distribution).map(([range, count]) => {
              const percentage = gameHistory.length > 0 ? (count / gameHistory.length) * 100 : 0;
              const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              const getRangeColor = (range: string) => {
                if (range.includes('1.0x - 1.5x')) return 'bg-red-500';
                if (range.includes('1.5x - 2.0x')) return 'bg-orange-500';
                if (range.includes('2.0x - 5.0x')) return 'bg-yellow-500';
                if (range.includes('5.0x - 10x')) return 'bg-green-500';
                return 'bg-purple-500';
              };
              
              return (
                <div key={range} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-400 text-right">
                    {range}
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                    <div
                      className={`h-4 rounded-full ${getRangeColor(range)} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                      {count > 0 && `${count} (${percentage.toFixed(1)}%)`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Data State */}
      {gameHistory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No statistics yet</p>
          <p className="text-sm">Play a few games to see detailed stats</p>
        </div>
      )}
    </div>
  );
};

export default GameStats;