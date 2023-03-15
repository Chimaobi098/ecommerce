export default {
  name: "activeGames",
  title: "Active Games",
  type: "document",
  fields: [
    {
      name: "attemptsRemaining",
      title: "Attempts Remaining",
      type: "number",
    },
    {
      title: "User Name",
      name: "userName",
      type: "reference",
      to: { type: "users" },
    },
    {
      title: "Product To Win",
      name: "productToWin",
      type: "reference",
      to: { type: "product" },
    },
  ],
};
