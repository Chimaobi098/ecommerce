import { useState, useEffect, useRef } from 'react';
import { Plane } from 'lucide-react';

export default function AviatorGame() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'flying' | 'crashed'>('waiting');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  const generateCrashPoint = () => {
    const random = Math.random();
    if (random < 0.33) return 1 + Math.random() * 1;
    if (random < 0.66) return 2 + Math.random() * 3;
    return 5 + Math.random() * 10;
  };

  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(5);
    setResult('');
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    setMultiplier(1.00);
    setIsFlying(true);
    setGameState('flying');
    setHasCashedOut(false);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + elapsed * 0.25; // Slower increase (was 0.5)
      
      if (currentMultiplier >= crash) {
        setMultiplier(crash);
        crashGame(crash);
      } else {
        setMultiplier(currentMultiplier);
      }
    }, 50);
  };

  const crashGame = (finalMultiplier: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsFlying(false);
    setGameState('crashed');
    
    if (hasBet && !hasCashedOut) {
      setResult(`CRASHED! Lost $${betAmount}`);
      setHistory(prev => [finalMultiplier.toFixed(2) + 'x', ...prev.slice(0, 9)]);
    } else if (!hasBet) {
      setHistory(prev => [finalMultiplier.toFixed(2) + 'x', ...prev.slice(0, 9)]);
    }
    
    setHasBet(false);
    
    setTimeout(() => {
      setGameState('waiting');
      setTimeout(() => {
        startCountdown();
      }, 1000);
    }, 2000);
  };

  const placeBet = () => {
    if (betAmount > balance || hasBet || gameState === 'flying') return;
    setBalance(balance - betAmount);
    setHasBet(true);
    setResult(`Bet placed: $${betAmount}`);
  };

  const cashOut = () => {
    if (!hasBet || !isFlying || hasCashedOut) return;
    
    const winAmount = betAmount * multiplier;
    setBalance(balance + winAmount);
    setHasCashedOut(true);
    setResult(`Won $${winAmount.toFixed(2)} at ${multiplier.toFixed(2)}x`);
    setHistory(prev => [multiplier.toFixed(2) + 'x', ...prev.slice(0, 9)]);
    setHasBet(false);
  };

  const cancelBet = () => {
    if (gameState === 'flying' || !hasBet) return;
    setBalance(balance + betAmount);
    setHasBet(false);
    setResult('Bet cancelled');
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Aviator Crash Game</h1>
          <p className="text-gray-300 text-center">Balance: ${balance.toFixed(2)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 relative overflow-hidden" style={{ minHeight: '400px' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {gameState === 'countdown' && (
                    <>
                      <div className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
                        Starting in {countdown}...
                      </div>
                      <Plane className="w-16 h-16 text-white mx-auto" />
                    </>
                  )}
                  
                  {gameState === 'waiting' && (
                    <>
                      <div className="text-4xl font-bold text-gray-400 mb-4">
                        Waiting for next round...
                      </div>
                      <Plane className="w-16 h-16 text-gray-400 mx-auto" />
                    </>
                  )}
                  
                  {(gameState === 'flying' || gameState === 'crashed') && (
                    <>
                      <div className={`text-8xl font-bold mb-4 transition-all duration-100 ${isFlying ? 'text-green-400' : 'text-red-500'}`}>
                        {multiplier.toFixed(2)}x
                      </div>
                      {!isFlying && (
                        <div className="text-red-500 text-2xl font-bold animate-pulse">
                          CRASHED!
                        </div>
                      )}
                      {isFlying && (
                        <Plane className="w-16 h-16 text-white mx-auto animate-bounce" />
                      )}
                    </>
                  )}
                </div>
              </div>

              {result && (
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-bold text-lg ${
                  result.includes('Won') ? 'bg-green-500' : 
                  result.includes('Lost') ? 'bg-red-500' : 
                  result.includes('placed') ? 'bg-blue-500' : 'bg-yellow-500'
                } text-white`}>
                  {result}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Place Bet</h2>
              
              <div className="mb-4">
                <label className="text-gray-300 text-sm mb-2 block">Bet Amount</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  disabled={hasBet || gameState === 'flying'}
                />
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount / 2))}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  disabled={hasBet || gameState === 'flying'}
                >
                  ½
                </button>
                <button
                  onClick={() => setBetAmount(betAmount * 2)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  disabled={hasBet || gameState === 'flying'}
                >
                  2×
                </button>
              </div>

              {!hasBet ? (
                <button
                  onClick={placeBet}
                  disabled={betAmount > balance || gameState === 'flying'}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                    betAmount <= balance && gameState !== 'flying'
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {gameState === 'flying' ? 'Round In Progress' : 'Place Bet'}
                </button>
              ) : gameState === 'flying' ? (
                <button
                  onClick={cashOut}
                  disabled={!isFlying || hasCashedOut}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                    isFlying && !hasCashedOut
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white animate-pulse'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {hasCashedOut ? 'Cashed Out!' : `Cash Out $${(betAmount * multiplier).toFixed(2)}`}
                </button>
              ) : (
                <button
                  onClick={cancelBet}
                  className="w-full py-3 rounded-lg font-bold text-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Cancel Bet
                </button>
              )}

              {gameState === 'countdown' && hasBet && (
                <p className="text-green-400 text-center mt-2 text-sm">
                  Bet active for next round!
                </p>
              )}
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">History</h2>
              <div className="flex flex-wrap gap-2">
                {history.map((mult, idx) => {
                  const value = parseFloat(mult);
                  const color = value < 2 ? 'bg-red-600' : value < 5 ? 'bg-yellow-600' : 'bg-green-600';
                  return (
                    <div key={idx} className={`${color} text-white px-3 py-1 rounded text-sm font-bold`}>
                      {mult}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}