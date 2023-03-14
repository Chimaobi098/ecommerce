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
      title: "Liked Products",
      name: "likedProducts",
      type: "reference",
      to: { type: "users" },
    },
  ],
};
