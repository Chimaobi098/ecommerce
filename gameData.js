const gameData = [
  {
    imageUrl: "memorygame/memorygame.svg",
    rating: 4.7,
    language: "EN",
    gameId: "memorygame",
    gameUrl: "https://memory-game-c6731.web.app/",
    playerCount: 1,
    howToPlay: [
      {
        instruction:
          "When the game first loads, you're shown a grid of numbers. your job is to memorize as many of the numbers that show up in the grid before they fade away. 🤔",
        imageUrl: "/memorygame/fadeout.gif",
      },
      {
        instruction:
          "When the numbers finally fade away, the game begins. You must match all the tiles in the grid to their pairs as quickly as you can. ⏱",
        imageUrl: "/memorygame/correct.gif",
      },
      {
        instruction:
          "If you select to tiles that don't match, both of the tiles you've selected disappear. Oh, and yes, we don't show you what's under the second tile. 😈",
        imageUrl: "/memorygame/wrong.gif",
      },
    ],
  },
];

export default gameData;
