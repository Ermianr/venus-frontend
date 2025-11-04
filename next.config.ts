import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  rewrites: async () => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendURL) {
      throw new Error(
        "la variable de entorno NEXT_PUBLIC_BACKEND_URL no esta definida.",
      );
    }
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendURL}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
