import Head from "next/head";
import { useState } from "react";
import gameData from "../gameData.js";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { CloseMenu } from "../components/productInfoOverly/prodInfoOverlay.styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { NavBar } from "../components/Home/home.styles";
// styling
const Wrapper = styled(motion.div)`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15vmin;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  overflow-y: scroll;
  padding-bottom: 25vmin;
`;

const GameInfoSection = styled(motion.div)`
  border-bottom: 1px solid black;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3vmin;
  a {
    background-color: #fda214;
    border: none;
    font-size: 1rem;
    padding: 2px 23px;
    border-radius: 20px;
    font-weight: 500;
    text-decoration: none;
    color: white;
  }
`;

const GameInfo = styled.div`
  width: 60vmin;
  height: 20px;
  display: flex;
  justify-content: space-between;

  div:nth-child(2) {
    border-left: 1px solid #d2d2d2;
    border-right: 1px solid #d2d2d2;
    padding: 0 10px;
  }

  .game-info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1,
    p {
      margin: 0;
      font-size: 4vmin;
      position: relative;
      top: -4vmin;
    }

    h1 {
      color: #d2d2d2;
    }
    p {
      color: #878787;
      font-weight: 500;
    }
  }
`;

const HowToPlaySection = styled(motion.div)`
  padding: 30px 10px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 6vmin;
  }

  p {
    text-align: center;
  }
`;
const Arcade = () => {
  interface gamaData {
    imageUrl: string;
    rating: number;
    language: string;
    gameId: string;
    gameUrl: string;
    playerCount: number;
    howToPlay: {
      instruction: string;
      imageUrl: string;
    }[];
  }
  console.log("you are in the arcade section");
  const [gameOverlay, setGameOverlay] = useState<gamaData | null>(null);
  return (
    <>
      <NavBar>
        <header>Games</header>
      </NavBar>
      <Head>
        <title>Games || The best way to earn</title>
      </Head>

      <Wrapper>
        {gameData.map((game) => (
          <motion.img
            key={game.gameId}
            whileTap={{ scale: 0.9 }}
            layoutId={game.gameId}
            onClick={() => {
              setGameOverlay(game);
            }}
            style={{ marginTop: "7vmin", width: "90%", borderRadius: "10px" }}
            src={game.imageUrl}
            alt="game art"
          />
        ))}
      </Wrapper>
      <AnimatePresence>
        {gameOverlay && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "white",
            }}
          >
            <motion.img
              layoutId={gameOverlay.gameId}
              src={gameOverlay.imageUrl}
              alt="game art"
              style={{ width: "100%" }}
            />
            <CloseMenu
              onClick={() => {
                setGameOverlay(null);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CloseRoundedIcon />
            </CloseMenu>
            <GameInfoSection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameInfo>
                <div className="game-info-item">
                  <h1>Language</h1>
                  <p>{gameOverlay.language}</p>
                </div>
                <div className="game-info-item">
                  <h1>Rating</h1>
                  <p>{gameOverlay.rating}</p>
                </div>
                <div className="game-info-item">
                  <h1>Players</h1>
                  <p>{gameOverlay.playerCount}</p>
                </div>
              </GameInfo>

              <a href={gameOverlay.gameUrl}>Play</a>
            </GameInfoSection>
            <HowToPlaySection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h1>How To Play</motion.h1>
              {gameOverlay.howToPlay.map((item) => (
                <>
                  <p>{item.instruction}</p>
                  <img src={item.imageUrl} alt="how to play image" />
                </>
              ))}
            </HowToPlaySection>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Arcade;
