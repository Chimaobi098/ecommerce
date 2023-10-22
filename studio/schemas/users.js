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
      name: "firstname",
      title: "First Name",
      type: "string",
    },
    {
      name: "lastname",
      title: "Last Name",
      type: "string",
    },

    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "dob",
      title: "Date of Birth",
      type: "text",
    },
    {
      name: "gender",
      title: "Gender",
      type: "string",
    },
    {
      name: "address1",
      title: "Address Line 1",
      type: "string",
    },
    {
      name: "address2",
      title: "Address Line 2",
      type: "string",
    },
    {
      name: "city",
      title: "City",
      type: "string",
    },
    {
      name: "state",
      title: "State/Province",
      type: "string",
    },
    {
      name: "country",
      title: "Country",
      type: "string",
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "number",
    },
    {
      name: "walletAmount",
      title: "Wallet Amount",
      type: "number",
      initialValue: 0,
    },
    {
      title: "Liked Products",
      name: "likedProducts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      title: "Saved Products",
      name: "savedProducts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
  ],
};
