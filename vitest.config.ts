import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    setupFiles: ["./app/tests/msw/setup.ts"],
    passWithNoTests: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    globals: true, // to use global test functions without import
    coverage: { provider: "v8", reporter: ["text", "html"] },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"), // 👈 tells Vitest that "~" = app/
    },
  },
});
