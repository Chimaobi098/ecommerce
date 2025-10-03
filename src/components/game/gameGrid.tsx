import React from 'react';
import { Game } from '@/types/game.types';
import GameCard from './gameCard';

interface GameGridProps {
  games: Game[];
  loading: boolean;
  error: string | null;
}

const GameGrid: React.FC<GameGridProps> = ({ games, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {/* Special Crash Game Card */}
      <GameCard 
        isSpecial={true} 
        specialTitle="Crash Game" 
        specialUrl="/crash" 
      />

      {/* Special Crash Game Card */}
      <GameCard 
        isSpecial={true} 
        specialTitle="Word Search Game" 
        specialUrl="/word"
      />
      
      {/* Regular Game Cards */}
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;