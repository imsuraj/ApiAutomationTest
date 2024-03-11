import { defineConfig } from "cypress";
import { beforeRunHook } from "cypress-mochawesome-reporter/lib";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  video: true,
  // retries: { openMode: 1, runMode: 2 },

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportDir: "cypress/reports/html",
    reportFilename: "[status]_[datetime]-[name]-report",
    overwrite: false,
    html: true,
    json: true,
    reportPageTitle: "API Automation Test Report",
    reportTitle: "Automation Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: true,
    autoOpen: false,
  },
  e2e: {
    baseUrl: "https://api.dev.pyypl.io",
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // require("cypress-mochawesome-reporter/plugin")(on);
      on("before:run", async (details) => {
        await beforeRunHook(details);
      });
      const key = process.env.PYYPL_KEY;
      const secret = process.env.PYYPL_SECRET;

      config.env = { key, secret };
      return config;
    },

    excludeSpecPattern: [
      "**/cypress/e2e/1-getting-started",
      "**/cypress/e2e/2-advanced-examples",
    ],
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
