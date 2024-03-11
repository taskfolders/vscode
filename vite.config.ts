/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['src/**/*.{spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['@taskfolders/utils/logger/node/register-global.start'],
  },
})
