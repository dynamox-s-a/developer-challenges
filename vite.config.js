import { defineConfig } from 'vite'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  }), WindiCSS(), svgr()],
  resolve: {
    alias: [
      {
        find: 'src',
        replacement: path.join(__dirname, 'src'),
      }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/setupTests.js',
    ],
    coverage: {
      include: [
        'src/**/*.{js,jsx}',
      ]
    },
    testTimeout: 2000,
  },
})
