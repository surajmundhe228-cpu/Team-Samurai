import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Reloc8 Flood Evacuation System",
        short_name: "Reloc8",
        description:
          "Flood risk assessment and emergency evacuation management system",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [],
      },

      workbox: {
        navigateFallback: "/index.html",
      },
    }),
  ],
});