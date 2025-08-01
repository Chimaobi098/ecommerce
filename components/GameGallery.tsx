import React, { useEffect, useState } from "react";
import axios from "axios";
import CrashGame from "./CrashGame/App";

type Game = {
  id: string;
  title: string;
  banner_image: string;
  url: string;
};

const GameGallery: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "https://feeds.gamepix.com/v2/json?sid=37523&pagination=24&page=1"
        );
        const gameItems = response.data?.items ?? [];

        const formattedGames: Game[] = gameItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          banner_image: item.banner_image,
          url: item.url,
        }));

        setGames(formattedGames);
      } catch (err) {
        setError("Failed to load games.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
          padding: "1rem",
        }}
      >
        <div
          // key={game.id}
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
        >
          <img
            // src={game.banner_image}
            // alt={game.title}
            style={{ width: "100%", borderRadius: 4 }}
          />
          <h3 style={{ fontSize: "1rem", marginTop: "0.5rem" }}>Crash Game</h3>
          {/* <button
              onClick={() => {
                console.log(`Testing game: ${game.title}`);
                setSelectedGameUrl(game.url);
              }}
            >
              Test
            </button> */}

          <a
            href="/crash"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              backgroundColor: "black",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            Play
          </a>
        </div>

        {games.map((game) => (
          <div
            key={game.id}
            style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
          >
            <img
              src={game.banner_image}
              alt={game.title}
              style={{ width: "100%", borderRadius: 4 }}
            />
            <h3 style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
              {game.title}
            </h3>
            {/* <button
              onClick={() => {
                console.log(`Testing game: ${game.title}`);
                setSelectedGameUrl(game.url);
              }}
            >
              Test
            </button> */}

            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                // backgroundColor: "#0070f3",
                backgroundColor: "black",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                textDecoration: "none",
              }}
            >
              Play
            </a>
          </div>
        ))}
      </div>
      {/* {selectedGameUrl && (
        <div style={{ marginTop: "2rem" }}>
          <iframe
            src={selectedGameUrl}
            width="100%"
            height="600"
            style={{ border: "none" }}
            allowFullScreen
          />
        </div>
      )} */}
    </>
  );
};

export default GameGallery;
