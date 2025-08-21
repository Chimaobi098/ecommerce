import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../AC_Footer";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { useRouter } from "next/router";

type Game = {
  id: string;
  title: string;
  banner_image: string;
  url: string;
};

const Arcade: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const router = useRouter()

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
      <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 p-4 overflow-scroll pb-[15vmin] pt-[65px]">
        <div className="fixed top-0 left-0 z-20 text-2xl w-full flex justify-center items-center font-bold h-[60px] bg-white border-b border-[#cccccc]">
            <div onClick={()=>{ router.push('/app-center')}} className="absolute left-0 h-full w-[10%] px-1 flex items-center">
                <KeyboardArrowLeft className="text-[32px]"/>
            </div> 
            <span>Arcade</span>
        </div>
        <div
          // key={game.id}
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
          className="bg-white"
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
            className="bg-white"
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
        {/* <Footer theme="light" /> */}
      </div>
  );
};

export default Arcade;
