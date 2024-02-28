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
npx cypress open
```

This README file provides a clearer structure, includes missing information, and improves the clarity of commands and instructions.