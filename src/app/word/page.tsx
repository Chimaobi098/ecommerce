'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Coins } from 'lucide-react';

interface WordSearchGameProps {}

interface GameWord {
  word: string;
  found: boolean;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

const WordSearchGame: React.FC<WordSearchGameProps> = () => {
  const [gameStage, setGameStage] = useState<'setup' | 'playing'>('setup');
  const [attempts, setAttempts] = useState<number>(1);
  const [selectedReward, setSelectedReward] = useState<number>(1000);
  const [costPerAttempt] = useState<number>(1000);
  const [auctionWallet, setAuctionWallet] = useState<number>(60000);
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintTimer, setHintTimer] = useState<number | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  const words = ['REACT', 'JAVASCRIPT', 'CODING', 'DEVELOPMENT'];
  const gridSize = 12;

  const rewardOptions = [
    { value: 1000, label: '1,000 BC' },
    { value: 2000, label: '2,000 BC' },
    { value: 3000, label: '3,000 BC' },
    { value: 5000, label: '5,000 BC' },
    { value: 10000, label: '10,000 BC' },
  ];

  const totalCost = attempts * costPerAttempt;

  const generateGrid = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('?')
    );
    
    const newGameWords: GameWord[] = [];
    
    // Place words in grid
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 50) {
        const direction = ['horizontal', 'vertical', 'diagonal'][Math.floor(Math.random() * 3)] as 'horizontal' | 'vertical' | 'diagonal';
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          newGameWords.push({
            word,
            found: false,
            startRow,
            startCol,
            direction
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill remaining cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '?') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setGameWords(newGameWords);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: string): boolean => {
    const len = word.length;
    
    switch (direction) {
      case 'horizontal':
        if (col + len > gridSize) return false;
        for (let i = 0; i < len; i++) {
          if (grid[row][col + i] !== '?' && grid[row][col + i] !== word[i]) return false;
        }
        break;
      case 'vertical':
        if (row + len > gridSize) return false;
        for (let i = 0; i < len; i++) {
          if (grid[row + i][col] !== '?' && grid[row + i][col] !== word[i]) return false;
        }
        break;
      case 'diagonal':
        if (row + len > gridSize || col + len > gridSize) return false;
        for (let i = 0; i < len; i++) {
          if (grid[row + i][col + i] !== '?' && grid[row + i][col + i] !== word[i]) return false;
        }
        break;
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: string) => {
    const len = word.length;
    
    switch (direction) {
      case 'horizontal':
        for (let i = 0; i < len; i++) {
          grid[row][col + i] = word[i];
        }
        break;
      case 'vertical':
        for (let i = 0; i < len; i++) {
          grid[row + i][col] = word[i];
        }
        break;
      case 'diagonal':
        for (let i = 0; i < len; i++) {
          grid[row + i][col + i] = word[i];
        }
        break;
    }
  };

const startGame = () => {
    if (auctionWallet >= totalCost) {
        setAuctionWallet(prev => prev - totalCost);
        setGameStage('playing');
        generateGrid();
        
        // Start hint timer
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 4000);
        setHintTimer(timer as unknown as number); // Cast to number to match state type
    }
};

  const handleCellClick = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const newSelected = new Set(selectedCells);
    
    if (newSelected.has(cellKey)) {
      newSelected.delete(cellKey);
    } else {
      newSelected.add(cellKey);
    }
    
    setSelectedCells(newSelected);
    
    // Check if selected cells form a word
    checkForWords(newSelected);
  };

  const checkForWords = (selected: Set<string>) => {
    gameWords.forEach(gameWord => {
      if (!foundWords.has(gameWord.word)) {
        const wordCells = getWordCells(gameWord);
        const wordCellsSet = new Set(wordCells);
        
        if (isSubset(wordCellsSet, selected)) {
          setFoundWords(prev => new Set([...prev, gameWord.word]));
          // Credit wallet for winning (UI only - actual implementation would be in backend)
          setAuctionWallet(prev => prev + selectedReward);
        }
      }
    });
  };

  const getWordCells = (gameWord: GameWord): string[] => {
    const cells: string[] = [];
    const len = gameWord.word.length;
    
    for (let i = 0; i < len; i++) {
      let row = gameWord.startRow;
      let col = gameWord.startCol;
      
      switch (gameWord.direction) {
        case 'horizontal':
          col += i;
          break;
        case 'vertical':
          row += i;
          break;
        case 'diagonal':
          row += i;
          col += i;
          break;
      }
      
      cells.push(`${row}-${col}`);
    }
    
    return cells;
  };

  const isSubset = (subset: Set<string>, superset: Set<string>): boolean => {
    for (const item of subset) {
      if (!superset.has(item)) {
        return false;
      }
    }
    return true;
  };

const nextAttempt = () => {
    if (currentAttempt < attempts) {
        setCurrentAttempt(prev => prev + 1);
        setSelectedCells(new Set());
        setFoundWords(new Set());
        setShowHint(false);
        generateGrid();
        
        // Start new hint timer
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 4000);
        setHintTimer(timer as unknown as number); // Cast to number to match state type
    }
};

  const resetGame = () => {
    setGameStage('setup');
    setCurrentAttempt(1);
    setSelectedCells(new Set());
    setFoundWords(new Set());
    setShowHint(false);
    if (hintTimer) {
      clearTimeout(hintTimer);
      setHintTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (hintTimer) {
        clearTimeout(hintTimer);
      }
    };
  }, [hintTimer]);

  if (gameStage === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Word Search</h1>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{auctionWallet.toLocaleString()} BC</span>
            </div>
          </div>

          {/* Game Setup Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Game Setup</h2>
            
            <div className="space-y-4">
              {/* Number of Attempts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={attempts}
                  onChange={(e) => setAttempts(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Reward Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward
                </label>
                <select
                  value={selectedReward}
                  onChange={(e) => setSelectedReward(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {rewardOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cost per Attempt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Attempt
                </label>
                <input
                  type="text"
                  value={`${costPerAttempt.toLocaleString()} BC`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600"
                />
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Cost for All Attempts
                </label>
                <input
                  type="text"
                  value={`${totalCost.toLocaleString()} BC`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 font-semibold"
                />
              </div>

              {/* Insufficient funds warning */}
              {auctionWallet < totalCost && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm">
                    Insufficient funds. You need {totalCost.toLocaleString()} BC but only have {auctionWallet.toLocaleString()} BC.
                  </p>
                </div>
              )}

              {/* Play Button */}
              <button
                onClick={startGame}
                disabled={auctionWallet < totalCost}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  auctionWallet >= totalCost
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-6 h-6" />
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-4">
          <button 
            onClick={resetGame}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-white text-center">
              <div className="text-sm opacity-80">Attempt</div>
              <div className="font-bold">{currentAttempt}/{attempts}</div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{auctionWallet.toLocaleString()} BC</span>
            </div>
          </div>
        </div>

        {/* Words to Find */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Find these words:</h3>
          <div className="grid grid-cols-2 gap-2">
            {words.map((word, index) => (
              <div
                key={word}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  foundWords.has(word)
                    ? 'bg-green-100 text-green-800 line-through'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {word}
                {/* Decoy words */}
                <div className="text-xs text-gray-500 mt-1">
                  {word}S, {word}ING
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint Display */}
        {showHint && currentWordIndex < words.length && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Hint:</strong> Look for "{words[currentWordIndex]}" - 
              {currentWordIndex < 3 ? ' it relates to programming!' : ' find it yourself!'}
            </p>
          </div>
        )}

        {/* Word Search Grid */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="grid grid-cols-12 gap-1">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.has(cellKey);
                const isPartOfFoundWord = gameWords.some(gameWord => 
                  foundWords.has(gameWord.word) && 
                  getWordCells(gameWord).includes(cellKey)
                );
                
                return (
                  <button
                    key={cellKey}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      aspect-square text-xs font-bold rounded transition-all duration-200
                      ${isPartOfFoundWord 
                        ? 'bg-green-200 text-green-800' 
                        : isSelected 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="space-y-3">
          {foundWords.size === words.length && currentAttempt < attempts && (
            <button
              onClick={nextAttempt}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
            >
              Next Attempt ({currentAttempt + 1}/{attempts})
            </button>
          )}
          
          {foundWords.size === words.length && currentAttempt === attempts && (
            <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
              <h3 className="text-green-800 font-bold text-lg mb-2">Congratulations!</h3>
              <p className="text-green-700">
                You've completed all {attempts} attempts!
                <br />
                Total earned: {(foundWords.size * selectedReward * attempts).toLocaleString()} BC
              </p>
            </div>
          )}

          <button
            onClick={() => setSelectedCells(new Set())}
            className="w-full py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
          >
            Clear Selection
          </button>
        </div>

        {/* Game Stats */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-2xl font-bold">{foundWords.size}</div>
              <div className="text-xs opacity-80">Words Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{words.length - foundWords.size}</div>
              <div className="text-xs opacity-80">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{selectedReward.toLocaleString()}</div>
              <div className="text-xs opacity-80">Reward (BC)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;