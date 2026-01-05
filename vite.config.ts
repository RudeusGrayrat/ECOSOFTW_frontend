import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  cacheDir: ".vite-cache",
  server:{
    port: 5174,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  base: "/", 
});

