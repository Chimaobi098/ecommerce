export default {
  name: "coupons",
  title: "Coupons",
  type: "document",
  fields: [
    {
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
    },
    {
      title: "Discount Percentage",
      name: "discountPercentage",
      type: "number",
    },
  ],
};
