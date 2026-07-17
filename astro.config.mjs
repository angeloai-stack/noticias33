// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: vercel(),

  env: {
    schema: {
      STRAPI_URL: envField.string({ context: "server", access: "secret", optional: true }),
      STRAPI_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      STRAPI_ADMIN_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
