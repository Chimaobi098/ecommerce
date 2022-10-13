/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["cdn.sanity.io"],
  },
  env: {
    ALGOLIA_APP_ID: "QWFLVVGLBV",
    ALGOLIA_SEARCH_KEY: "ae043287c47c3250b6e1d92920a963d6",
  },
};

module.exports = nextConfig;
