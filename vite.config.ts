import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [preact()],
  base: "/",
  resolve: {
    alias: {
      "@/": resolve(__dirname, "./Source/") + "/",
    },
  },
});
