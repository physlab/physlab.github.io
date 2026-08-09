import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// GitHub Pages project sites are served from https://<user>.github.io/<repo>/,
// so every asset URL needs that "/<repo>/" prefix baked in at build time.
// The deploy workflow (.github/workflows/deploy.yml) sets BASE_PATH to
// "/<repo-name>/" automatically; it defaults to "/" for local dev and for
// user/org pages (a repo named "<user>.github.io").
const base = process.env.BASE_PATH ?? "/";
// const base = process.env.BASE_PATH ?? "/physlab/";

export default defineConfig({
  base: "/",
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // GitHub Pages runs Jekyll, which refuses to serve files whose name
        // starts with "_" (e.g. the "_slug" route chunk). Strip the leading
        // underscore from generated chunk/asset names so every file is served.
        chunkFileNames: "assets/chunk-[name]-[hash].js",
        entryFileNames: "assets/entry-[name]-[hash].js",
        assetFileNames: "assets/asset-[name]-[hash][extname]",
      },
    },
  },
});
