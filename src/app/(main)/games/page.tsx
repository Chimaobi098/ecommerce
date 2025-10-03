'use client';

import React, { useEffect, useState } from 'react';
import { Game } from '@/types/game.types';
import { GameAPI } from '@/lib/api';
import GameGrid from '@/components/game/gameGrid';

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedGames = await GameAPI.fetchGames();
        setGames(fetchedGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 py-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse Games</h2>
        <GameGrid games={games} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default GamesPage;