import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      JWT_REFRESH_SECRET: "test-secret-for-vitest",
      JWT_REFRESH_TTL: "604800",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules", "dist"],
    },
  },
});
