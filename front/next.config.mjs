/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/routes/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
