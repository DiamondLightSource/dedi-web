import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // BASE_PATH is the URL path the app is served from. GitHub Pages serves it
  // from /dedi-web/; the Docker image sets BASE_PATH=/ to serve from the root.
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    base: env.BASE_PATH || "/dedi-web/",
  };
});
