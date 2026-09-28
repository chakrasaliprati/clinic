/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Doctor profile photo is served from Supabase Storage
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  // Preserve any previously indexed URLs that moved
  async redirects() {
    return [
      { source: "/services/psoriasis", destination: "/psoriasis-treatment", permanent: true },
      { source: "/services/piles", destination: "/piles-treatment", permanent: true },
      { source: "/services/arthritis", destination: "/services/osteoarthritis", permanent: true },
    ];
  },
};

export default nextConfig;
