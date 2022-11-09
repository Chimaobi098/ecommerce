export default {
  name: "users",
  title: "Users",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "userId",
      title: "user Id",
      type: "string",
    },
    {
      name: "name",
      title: "Name",
      type: "string",
    },

    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "address",
      title: "Address",
      type: "string",
    },
    {
      name: "phoneNumber",
      title: "Phone Number",
      type: "number",
    },
    {
      title: "Liked Products",
      name: "likedProducts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
  ],
};
