export default {
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
   
    {
      name: "productItem",
      title: "Product Details",
      type: "reference",
      to: { type: "product" },
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
    },

    {
      name: "totalPrice",
      title: "Total Price",
      type: "number",
    },
  ],
};
