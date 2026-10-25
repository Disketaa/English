import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [preact()],
  base: "/English/",
  resolve: {
    alias: {
      "@/": resolve(__dirname, "./Source/") + "/",
    },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css"],
  },
});
