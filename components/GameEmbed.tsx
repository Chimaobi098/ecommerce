// components/GameEmbed.tsx
import React from "react";

const GameEmbed: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Play Stickman Street Fighting 3D</h2>
      <iframe
        style={{ height: "80vh", width: "400px" }}
        src="https://play.gamepix.com/stickman-street-fighting/embed?sid=37523"
        width="480"
        height="320"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GameEmbed;
