# API Automation Assessment

## Overview

This project is an API automation test suite built with Cypress, focusing on the functionalities of creating payment orders and fetching payment details. The goal is to ensure the reliability and correctness of the API endpoints related to payment processing.

## Features

### Create Payment Order API Tests
- **Positive Scenarios:** Verify that the create payment order API works as expected under normal conditions.
- **Negative Scenarios:** Test the API's response to invalid inputs, unauthorized requests, or other error conditions.
- **Metadata Handling:** Ensure that metadata such as order ID and external references are processed correctly.

### Fetch Payment Details API Tests
- **Retrieve Valid Payment Details:** Confirm that the API returns the correct details for a successful payment order.
- **Handle Pending Payments:** Verify the handling of pending payment orders and the corresponding API responses.
- **Error Scenarios:** Test the API's behavior in cases of invalid payment IDs or unauthorized access.

## Getting Started

Before you begin, ensure you have met the following requirements:
- Node.js installed
- Git installed
- Account with API key and secret

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/imsuraj/ApiAutomationTest.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd ApiAutomationTest
   ```

3. **Install Dependencies:**
   ```bash
   npm ci
   npm install ajv
   ```

## Configuration
- Update the `baseUrl` and any other relevant configurations in Cypress.

## Running Tests

Replace `<key>` and `<secret>` with your actual API key and secret.

```bash
PYYPL_KEY="<key>" PYYPL_SECRET="<secret>" npm run cy:run_process
```

To run tests individually:

```bash
PYYPL_KEY="<key>" PYYPL_SECRET="<secret>" npm run cy:open_process
```

## Cypress Folder Structure

- **cypress:**
  - This is the main folder containing essential project elements.
- **cypress/e2e:**
  - This folder holds test files (specs) representing different features. The files under the "cypress/e2e/apiTest" folder represent distinct test suites for API testing. Each file is dedicated to a specific aspect, such as authentication and rate limiting, creating and retrieving API schemas, functional and security testing for creating payment orders, validation testing for payment order creation, retrieval tests for payment orders, and tests focusing on timeouts and concurrency issues, allowing for a comprehensive examination of the API functionalities.
- **cypress/fixtures:**
  - The folder contains various JSON files, such as "invalidAmount.json," "nonStringTestData.json," "sqlInjectionTestData.json," "urls.json," and "xssTestData.json," each serving as test data sources for different scenarios in testing.
- **cypress/report:**
  - This folder is optionally used for storing generated test reports (Eg. Mochawesome report).
- **cypress/screenshots:**
  - The folder stores captured screenshots files generated during Cypress test runs, providing visual documentation of test execution.
- **cypress/support:**
  - This folder contains Utility file and configuration settings.
    - **commands.js:**
      - This file is used to define custom commands for reuse in the tests.
    - **e2e.js:**
      - This file is an execution hook in Cypress that is executed before every test suite, allowing users to set up global configurations.
    - **utils.js:**
      - The file contains reusable utility functions and constants, such as generating random amounts, constructing API headers with various scenarios (invalid, empty), creating UUIDs, and defining common values like redirect URLs and supported currencies. These utilities are designed to assist in API automation testing with Cypress, promoting code organization and reusability across test cases.

- **cypress/videos:**
  - The folder stores recorded video files generated during Cypress test runs, providing visual documentation of test execution.

- **node_modules:**
  - The directory contains all the dependencies installed for a Node.js project, including libraries and packages specified in the project's "package.json" file.

- **cypress.config.js:**
  - It is the configuration file for Cypress, and in this specific setup, it defines global configuration options such as viewport dimensions, timeouts, and the use of a custom Mochawesome reporter with specific settings for report generation. Additionally, it sets up environment variables for API keys and secrets, excludes and includes specific test patterns, and enables the `cypress-mochawesome-reporter` plugin to generate detailed and visually appealing HTML reports.

- **package.json:**
  - It specifies metadata and dependencies for the "automation" project. It includes scripts for test automation using Cypress, such as deleting previous test reports, opening the Cypress test runner, and running tests with specified environment variables. The project depends on Cypress version 13.6.6 and utilizes the "cypress-mochawesome-reporter" version 3.8.2 for enhanced test reporting.

## Mochawesome HTML Report
Mochawesome HTML report serves as a detailed summary of our test executions, providing insights into both successful and unsuccessful scenarios, along with test durations. It organizes this information in a clear hierarchy, breaking down our test suites and individual cases. The report goes beyond just text, offering interactive charts that help visualize test statistics and pinpoint areas of concern. Additionally, it features embedded screenshots for any failed tests, aiding us in debugging and understanding the issues better. With customization options, such as choosing report directories, filenames, and toggling specific features, Mochawesome HTML report proves to be a valuable tool for enhancing our understanding of test results and fostering effective communication within our development team.
