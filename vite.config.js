import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    allowedHosts: "*",
    port: "8000"
  },
  base: './' // Use './' for relative paths in production
});
