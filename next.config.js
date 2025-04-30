/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        pathname: "/account123/**",
      },
    ],
  },
  env: {
    ALGOLIA_APP_ID: "QWFLVVGLBV",
    ALGOLIA_SEARCH_KEY: "ae043287c47c3250b6e1d92920a963d6",
    PAYSTACK_PUBLIC_KEY: "pk_test_8f3c6c93fc82f663ce4939505f86d6fa13f386d9",
  },
};

module.exports = nextConfig;

// next.config.js
module.exports = {
  pageDataCollectionTimeout: 1000000,
  // Other configurations...
};

// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        port: "",
        pathname: "/account123/**",
      },
    ],
  },
};
