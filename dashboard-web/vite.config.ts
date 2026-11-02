import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Nos tests vitest utilisent tous le suffixe .test., jamais .spec. — ça
    // exclut naturellement e2e/*.spec.ts (Playwright, npm run test:e2e) sans
    // avoir à remplacer la liste exclude par défaut de vitest.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
