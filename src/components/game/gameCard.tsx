import React from 'react';
import { GameCardProps } from '@/types/game';

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  isSpecial = false, 
  specialTitle = "Special Game",
  specialUrl = "/crash"
}) => {
  const title = isSpecial ? specialTitle : game?.title || '';
  const imageUrl = isSpecial ? undefined : game?.banner_image;
  const playUrl = isSpecial ? specialUrl : game?.url || '';

  return (
    <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-32 object-cover rounded border-4 mb-3"
          loading="lazy"
        />
      )}
      
      {isSpecial && (
        <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded border-4 mb-3 flex items-center justify-center">
          <div className="text-white text-xl font-bold">🎮</div>
        </div>
      )}
      
      <h3 className="text-base font-medium mb-3 text-gray-800 line-clamp-2">
        {title}
      </h3>
      
      <a
        href={playUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full text-center bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
      >
        Play
      </a>
    </div>
  );
};

export default GameCard;