import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'apps/renderer',
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist-electron'),
  },
  plugins: [
    vue(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: path.resolve(__dirname, 'apps/electron-main/main.ts'),
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist-electron'),
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.resolve(__dirname, 'apps/electron-main/preload.ts'),
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist-electron'),
          },
        },
      },
    }),
  ],
})
