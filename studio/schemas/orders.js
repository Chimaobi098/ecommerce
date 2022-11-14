export default {
  name: "orders",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },

    {
      name: "user",
      title: "User",
      type: "reference",
      to: { type: "users" },
      options: {
        disableNew: true,
      },
    },
    {
      name: "totalPrice",
      title: "Total Price",
      type: "number",
    },

    {
      name: "paidAt",
      title: "Paid At",
      type: "datetime",
    },
    {
      title: "Is Delivered",
      name: "isDelivered",
      type: "boolean",
    },
    {
      title: "Order Items",
      name: "orderItems",
      type: "array",
      of: [{ title: "Order Item", type: "orderItem" }],
    },
  ],
};
