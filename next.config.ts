import type { NextConfig } from "next";

const isGithubPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  output: isGithubPages ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "krgnbftsobecdcrglmkj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
