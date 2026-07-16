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
      WP_URL: envField.string({ context: "server", access: "secret" }),
      WP_USER: envField.string({ context: "server", access: "secret", optional: true }),
      WP_APP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SUPABASE_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SUPABASE_SERVICE_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      ACCESS_CODE: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      ADMIN_CODE: envField.string({
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
