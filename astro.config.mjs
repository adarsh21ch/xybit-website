import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://xybitfunds.com",
  output: "static",
  integrations: [tailwind({ applyBaseStyles: false })],
});
