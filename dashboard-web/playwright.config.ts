import { defineConfig, devices } from '@playwright/test';

// Tests end-to-end, dans un vrai navigateur, contre le dashboard servi par
// les mocks MSW (pas besoin du backend réel pour ces tests). Complémentaires
// des tests vitest/jsdom : ceux-ci vérifient le rendu réel, le responsive,
// et l'accessibilité via axe-core, ce que jsdom ne peut pas faire.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --port 5175 --strictPort',
    url: 'http://localhost:5175',
    reuseExistingServer: !process.env.CI,
    env: { VITE_USE_MOCKS: 'true' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
