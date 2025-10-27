import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         hostname: 'cdn.sanity.io',
//       },
//     ],
//   },
//   env: {
//     // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
//     SC_DISABLE_SPEEDY: "false",
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactMaxHeadersLength: 10000,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
    deviceSizes: [320, 375, 425, 500, 640, 750, 828, 1080, 1200, 1920], // Added more granular sizes for mobile
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Default, but good to have explicitly
  },

  // Add environment variables that should be available in the API routes
  experimental: {
    serverComponentsExternalPackages: ['@sanity/client'],
  },

  // Only include public environment variables here
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production
    SC_DISABLE_SPEEDY: "false",
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
