import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    assetsInlineLimit: 0, // keep video/images as real files, never base64-inlined
    sourcemap: false
  }
});
