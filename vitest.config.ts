import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./src/**/*.{spec,vitest}.?(c|m)[jt]s?(x)'],
    //exclude: ['**/_build/**']
    exclude: ['**/_build/**'],
    setupFiles: ['@taskfolders/utils/logger/node/register-global.start'],

  },
})
