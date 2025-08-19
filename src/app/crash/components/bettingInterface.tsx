'use client';

import React from 'react';
import { Play, Square, Settings, Clock, Zap } from 'lucide-react';

interface Bet {
  id: string;
  amount: number;
  cashOutAt: number;
  placed: boolean;
  cashedOut: boolean;
  winAmount?: number;
}

interface BettingInterfaceProps {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  autoCashOut: number;
  setAutoCashOut: (multiplier: number) => void;
  autoMode: boolean;
  setAutoMode: (enabled: boolean) => void;
  gamePhase: 'waiting' | 'countdown' | 'flying' | 'crashed';
  currentBet: Bet | null;
  onPlaceBet: () => void;
  onCashOut: () => void;
  currentMultiplier: number;
  countdown: number;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  balance,
  betAmount,
  setBetAmount,
  autoCashOut,
  setAutoCashOut,
  autoMode,
  setAutoMode,
  gamePhase,
  currentBet,
  onPlaceBet,
  onCashOut,
  currentMultiplier,
  countdown
}) => {
  const canPlaceBet = gamePhase === 'waiting' && !currentBet && balance >= betAmount;
  const canCashOut = gamePhase === 'flying' && currentBet && !currentBet.cashedOut;

  const getStatusText = () => {
    if (gamePhase === 'waiting') return 'Waiting for players...';
    if (gamePhase === 'countdown') return `Starting in ${countdown}s`;
    if (gamePhase === 'flying') return 'Rocket is flying!';
    if (gamePhase === 'crashed') return 'Rocket crashed!';
  };

  const getBetButtonText = () => {
    if (gamePhase === 'countdown') return `Starting in ${countdown}s`;
    if (balance < betAmount) return 'Insufficient balance';
    if (currentBet) return 'Bet placed';
    return `Bet $${betAmount}`;
  };

  const getCashOutButtonText = () => {
    if (!currentBet) return 'No bet placed';
    if (currentBet.cashedOut) return `Cashed out at ${currentBet.winAmount ? `$${currentBet.winAmount}` : '0'}`;
    const potentialWin = Math.floor(currentBet.amount * currentMultiplier);
    return `Cash out $${potentialWin}`;
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-bold">Betting Panel</h2>
      </div>

      {/* Game Status */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{getStatusText()}</span>
        </div>
      </div>

      {/* Bet Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bet Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            min="1"
            max={balance}
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Math.min(balance, parseInt(e.target.value) || 1)))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-4 py-3 text-white font-semibold focus:border-blue-500 focus:outline-none"
            disabled={gamePhase !== 'waiting' || currentBet !== null}
          />
        </div>
        
        {/* Quick bet buttons */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[10, 25, 50, 100].map(amount => (
            <button
              key={amount}
              onClick={() => setBetAmount(Math.min(amount, balance))}
              disabled={gamePhase !== 'waiting' || currentBet !== null || balance < amount}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-xs py-2 rounded transition-colors"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Cash Out */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Auto Cash Out
        </label>
        <div className="relative">
          <input
            type="number"
            min="1.01"
            step="0.01"
            value={autoCashOut}
            onChange={(e) => setAutoCashOut(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white font-semibold focus:border-blue-500 focus:outline-none"
            disabled={gamePhase === 'flying'}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">x</span>
        </div>
        
        {/* Quick multiplier buttons */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[1.5, 2, 3, 5].map(mult => (
            <button
              key={mult}
              onClick={() => setAutoCashOut(mult)}
              disabled={gamePhase === 'flying'}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-xs py-2 rounded transition-colors"
            >
              {mult}x
            </button>
          ))}
        </div>
      </div>

      {/* Auto Mode Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            disabled={gamePhase === 'flying'}
          />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Auto Mode</span>
          </div>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-7">
          Automatically place bets and cash out
        </p>
      </div>

      {/* Current Bet Info */}
      {currentBet && (
        <div className="mb-4 p-3 bg-blue-900 bg-opacity-60 border border-blue-500 rounded-lg">
          <div className="text-sm text-blue-200 mb-1">Current Bet</div>
          <div className="flex justify-between items-center text-sm">
            <span>Amount: ${currentBet.amount}</span>
            <span>Auto: {currentBet.cashOutAt}x</span>
          </div>
          {!currentBet.cashedOut && gamePhase === 'flying' && (
            <div className="text-center mt-2">
              <div className="text-lg font-bold text-green-400">
                ${Math.floor(currentBet.amount * currentMultiplier)}
              </div>
              <div className="text-xs text-gray-300">Potential win</div>
            </div>
          )}
          {currentBet.cashedOut && (
            <div className="text-center mt-2">
              <div className="text-lg font-bold text-green-400">
                ${currentBet.winAmount}
              </div>
              <div className="text-xs text-gray-300">Won!</div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!currentBet || gamePhase === 'waiting' ? (
          <button
            onClick={onPlaceBet}
            disabled={!canPlaceBet}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100 ${
              canPlaceBet
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="h-5 w-5" />
            {getBetButtonText()}
          </button>
        ) : (
          <button
            onClick={onCashOut}
            disabled={!canCashOut}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100 ${
              canCashOut
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Square className="h-5 w-5" />
            {getCashOutButtonText()}
          </button>
        )}
      </div>

      {/* Balance warning */}
      {balance < betAmount && (
        <div className="mt-3 p-2 bg-red-900 bg-opacity-60 border border-red-500 rounded text-sm text-red-200 text-center">
          Insufficient balance for this bet
        </div>
      )}
    </div>
  );
};

export default BettingInterface;