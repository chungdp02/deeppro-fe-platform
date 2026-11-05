import { defineConfig } from "@playwright/test"

const baseURL = "http://127.0.0.1:4173"

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
