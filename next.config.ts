import path from "node:path";
import type { NextConfig } from "next";

/** Set by .github/workflows/deploy.yml. Local dev, `next start` and Vercel keep the server build. */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(".") },
  images: isGitHubPages
    ? { loader: "custom", loaderFile: "./src/lib/image-loader.ts" }
    : { formats: ["image/avif", "image/webp"] },
  ...(isGitHubPages && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    trailingSlash: true,
  }),
};

export default nextConfig;
