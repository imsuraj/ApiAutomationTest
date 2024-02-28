const { defineConfig } = require("cypress");

module.exports = defineConfig({

  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  video: true,
  // retries: {openMode:2, runMode: 1},

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportDir: "cypress/reports",
    reportFilename: "[status]_[datetime]-[name]-report",
    overwrite: false,
    html: true,
    json: true,
    reportPageTitle: 'NXOS API Automation Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: true,
    autoOpen: false


  },
  e2e: {
    baseUrl: 'https://api.dev.pyypl.io',
    "watchForFileChanges": true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
      const key = process.env.PYYPL_KEY
      const secret = process.env.PYYPL_SECRET

      config.env = { key, secret }
      return config
      
    },

    excludeSpecPattern: ['**/cypress/e2e/1-getting-started', '**/cypress/e2e/2-advanced-examples'],
    spectPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}	',
  },
});
