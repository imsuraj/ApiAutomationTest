import * as utils from "../../support/utils";

describe("Create Payment Order API tests", () => {
  it.only("Successfully creates a payment order with valid request with all  parameters", () => {
    // Step 1: Make a POST request to create a payment order with valid parameters
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the create request was successful
      expect(response.status).to.eq(200);
      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
      // expect(response.body).have.property(
      //   "webRedirectUrl",
      //   `${
      //     Cypress.config().baseUrl
      //   }?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`
      // );
      // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
    });
  });

  it("Successfully creates a payment order with valid request with only required parameters - Amount and Currency", () => {
    // Step 1: Make a POST request to create a payment order with required parameters
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
      },
    }).then((response) => {
      // Verify that the create request was successful
      expect(response.status).to.eq(200);
      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
      // expect(response.body).have.property(
      //   "webRedirectUrl",
      //   `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}`
      // );
      // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}`)
    });
  });

  it("Handles payment order creation for min amount less than 10, value between min and max and max value greater 4000 AED/1000 USD", () => {
    //  test scenarios
    const scenarios = [
      { currency: "AED", amount: 10.01, expectedStatus: 200 },
      { currency: "AED", amount: 1999, expectedStatus: 200 },
      { currency: "AED", amount: 3999.99, expectedStatus: 200 },
      { currency: "USD", amount: 10.01, expectedStatus: 200 },
      { currency: "USD", amount: 999.99, expectedStatus: 200 },
      { currency: "USD", amount: 599, expectedStatus: 200 },
      { currency: "AED", amount: 9.99, expectedStatus: 200 },
      { currency: "AED", amount: 4000.01, expectedStatus: 200 },
      { currency: "USD", amount: 1000.01, expectedStatus: 200 },
      { currency: "USD", amount: 9.99, expectedStatus: 200 },
    ];

    // Iterate through scenarios and perform the tests
    scenarios.forEach((scenario) => {
      // Make a POST request to create a payment order
      cy.request({
        method: "POST",
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: {
          amount: scenario.amount,
          currency: scenario.currency,
          description: "Create Order tests",
          metadata: {
            orderId: "114",
            externalReference: "1234",
          },
          successRedirectUrl: utils.successRedirectUrl,
          failureRedirectUrl: utils.failureRedirectUrl,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 200) {
          expect(response.status).to.eq(scenario.expectedStatus);
          cy.log(` Test Data: ${scenario}`);
          const paymentOrderId = response.body.paymentOrderId;
          const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
          const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

          // Ensure the response body contains essential properties and information
          expect(response.body).have.property("paymentOrderId", paymentOrderId);
          expect(response.body).have.property("status", "PENDING");
          // expect(response.body).have.property(
          //   "webRedirectUrl",
          //   `${
          //     Cypress.config().baseUrl
          //   }?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`
          // );
          // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
        } else {
          cy.log(` Test Data: ${scenario}`);
          expect(response.status).to.eq(scenario.expectedStatus);
          expect(response.status).to.not.eq(200);
        }
      });
    });
  });

  it("Handles payment order creation with missing amount parameter", () => {
    // Step 1: Make a POST request to create a payment order without providing the amount
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: amount is wrong"
      );
    });
  });

  it("Handles scenario where a negative amount is provided during payment order creation", () => {
    // Step 1: Make a POST request to create a payment order with a negative amount
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: -10.01,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: amount is wrong"
      );
    });
  });

  it("Handles payment order creation with missing currency parameter", () => {
    // Step 1: Make a POST request to create a payment order without providing the currency
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: currency is wrong"
      );
    });
  });

  it("Handles payment order creation with missing amount and currency parameters", () => {
    // Step 1: Make a POST request to create a payment order without providing amount and currency
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: amount is wrong"
      );
    });
  });
});
