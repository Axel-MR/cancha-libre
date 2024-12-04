import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  
  /* config options here */
};

module.exports = {
  reactStrictMode: true,
};


module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Cambia a false si quieres que sea una redirección temporal
      },
    ];
  },
};



export default nextConfig;
