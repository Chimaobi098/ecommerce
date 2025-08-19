'use client';

import React from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

interface GameResult {
  id: string;
  crashPoint: number;
  timestamp: number;
}

interface GameHistoryProps {
  games: GameResult[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ games }) => {
  const getCrashColor = (crashPoint: number) => {
    if (crashPoint < 1.5) return 'text-red-500 bg-red-900';
    if (crashPoint < 2) return 'text-orange-400 bg-orange-900';
    if (crashPoint < 3) return 'text-yellow-400 bg-yellow-900';
    if (crashPoint < 5) return 'text-green-400 bg-green-900';
    if (crashPoint < 10) return 'text-blue-400 bg-blue-900';
    return 'text-purple-400 bg-purple-900';
  };

  const getCrashIcon = (crashPoint: number) => {
    if (crashPoint >= 5) {
      return <TrendingUp className="h-3 w-3" />;
    }
    return <TrendingDown className="h-3 w-3" />;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAverageMultiplier = () => {
    if (games.length === 0) return 0;
    const sum = games.reduce((acc, game) => acc + game.crashPoint, 0);
    return (sum / games.length).toFixed(2);
  };

  const getHighestMultiplier = () => {
    if (games.length === 0) return 0;
    return Math.max(...games.map(game => game.crashPoint)).toFixed(2);
  };

  const getLowestMultiplier = () => {
    if (games.length === 0) return 0;
    return Math.min(...games.map(game => game.crashPoint)).toFixed(2);
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-bold">Game History</h3>
      </div>

      {/* Statistics */}
      {games.length > 0 && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Games played:</span>
              <span className="font-semibold">{games.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average:</span>
              <span className="font-semibold text-blue-400">{getAverageMultiplier()}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Highest:</span>
              <span className="font-semibold text-green-400">{getHighestMultiplier()}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lowest:</span>
              <span className="font-semibold text-red-400">{getLowestMultiplier()}x</span>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {games.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No games played yet</p>
            <p className="text-sm">Place your first bet to get started!</p>
          </div>
        ) : (
          games.map((game, index) => (
            <div
              key={game.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:scale-105 ${getCrashColor(game.crashPoint)} bg-opacity-20 border-opacity-30`}
            >
              <div className="flex items-center gap-2">
                {getCrashIcon(game.crashPoint)}
                <span className="text-xs text-gray-400">
                  Game #{games.length - index}
                </span>
              </div>
              
              <div className="text-center">
                <div className={`font-bold text-lg ${getCrashColor(game.crashPoint).split(' ')[0]}`}>
                  {game.crashPoint.toFixed(2)}x
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                {formatTime(game.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats Pills */}
      {games.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Recent trend */}
          <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full text-xs">
            {games.slice(0, 3).every(g => g.crashPoint >= 2) ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-green-400">Hot</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-400" />
                <span className="text-red-400">Cold</span>
              </>
            )}
          </div>
          
          {/* High multiplier streak */}
          {games.slice(0, 2).every(g => g.crashPoint >= 5) && (
            <div className="flex items-center gap-1 bg-purple-900 px-2 py-1 rounded-full text-xs text-purple-400">
              🔥 High streak
            </div>
          )}
          
          {/* Low multiplier warning */}
          {games.slice(0, 3).every(g => g.crashPoint < 2) && (
            <div className="flex items-center gap-1 bg-red-900 px-2 py-1 rounded-full text-xs text-red-400">
              ⚠️ Low streak
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;