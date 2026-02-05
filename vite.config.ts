import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { loadingScript } from "vite-plugin-script-loader";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [svelte(), loadingScript()],
    server: {
      cors: true,
    },
    base:
      command === "serve"
        ? "/"
        : "https://www.abc.net.au/res/sites/news-projects/interactive-artemis-ii/dist/",
  };
});
