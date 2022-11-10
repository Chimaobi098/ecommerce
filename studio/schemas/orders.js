export default {
  name: "orders",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "user",
      title: "User",
          type: "reference",
          to: [{ type: 'users' }], 
          options: {
          disableNew: true
      }
      },
    {
      name: "totalPrice",
      title: "Total Price",
      type: "number",
    },
    {
      name: "shippingAddress",
      title: "Shipping Address",
      type: "string",
    },

    {
      name: "paidAt",
      title: "Paid At",
      type: "datetime",
    },
    {
      title: "Is Delivered",
      name: "isDelivered",
      type: 'boolean',
     
    },
    {
      title: "Order Items",
      name: "orderItems",
        type: 'array',
        of: [
            { type: 'reference', to: [{type:"product"}]}
      ]
     
    },
  ],
};
