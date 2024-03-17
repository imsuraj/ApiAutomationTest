import * as utils from '../../../support/utils';

describe('Create Payment Order API tests', () => {
  it('Successfully creates a payment order with valid request with all  parameters', () => {
    const amount = utils.generateRandomAmount();
    const currency = Cypress._.shuffle(utils.currencies)[0];
    // Step 1: Make a POST request to create a payment order with valid parameters
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: amount,
        currency: currency,
        description: 'Test Payment Order',
        metadata: {
          orderId: '1',
          externalReference: '0001',
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the create request was successful
      expect(response.status).to.eq(200);
      const paymentOrderId = response.body.paymentOrderId;

      // Ensure the response body contains essential properties
      expect(response.body).to.have.property('paymentOrderId', paymentOrderId);
      expect(response.body).to.have.property('status', 'PENDING');
      expect(response.body).to.have.property('expiresAt');
      expect(response.body).to.have.property(
        'webRedirectUrl',
        `${utils.webRedirectHostUrl}${paymentOrderId}`
      );
      expect(response.body).to.have.property(
        'appRedirectUrl',
        `${utils.appRedirectHostUrl}${paymentOrderId}`
      );
      expect(response.body).to.have.property('amount', amount);
      expect(response.body).to.have.property('currency', currency);
    });
  });

  it('Successfully creates a payment order with valid request with only required parameters - Amount and Currency', () => {
    const amount = utils.generateRandomAmount();
    const currency = Cypress._.shuffle(utils.currencies)[0];
    // Step 1: Make a POST request to create a payment order with required parameters
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: amount,
        currency: currency,
      },
    }).then((response) => {
      // Verify that the create request was successful
      expect(response.status).to.eq(200);
      const paymentOrderId = response.body.paymentOrderId;

      // Ensure the response body contains essential properties
      expect(response.body).to.have.property('paymentOrderId', paymentOrderId);
      expect(response.body).to.have.property('status', 'PENDING');
      expect(response.body).to.have.property('expiresAt');
      expect(response.body).to.have.property(
        'webRedirectUrl',
        `${utils.webRedirectHostUrl}${paymentOrderId}`
      );
      expect(response.body).to.have.property(
        'appRedirectUrl',
        `${utils.appRedirectHostUrl}${paymentOrderId}`
      );
      expect(response.body).to.have.property('amount', amount);
      expect(response.body).to.have.property('currency', currency);
    });
  });

  it('Handles payment order creation for min amount less than 10, value between min and max and max value greater 4000 AED/1000 USD', () => {
    //  test scenarios
    const scenarios = [
      { currency: 'AED', amount: 10, expectedStatus: 200 },
      { currency: 'AED', amount: 11, expectedStatus: 200 },
      { currency: 'AED', amount: 4000, expectedStatus: 200 },
      { currency: 'AED', amount: 4001, expectedStatus: 200 },
      { currency: 'AED', amount: 3999, expectedStatus: 200 },
      { currency: 'USD', amount: 10, expectedStatus: 200 },
      { currency: 'USD', amount: 11, expectedStatus: 200 },
      { currency: 'USD', amount: 1000, expectedStatus: 200 },
      { currency: 'USD', amount: 1001, expectedStatus: 200 },
      { currency: 'USD', amount: 999, expectedStatus: 200 },
    ];

    // Iterate through scenarios and perform the tests
    scenarios.forEach((scenario) => {
      cy.log(
        ` Test Data: Currency : ${scenario.currency},  Amount : ${scenario.amount},  Expected Response: ${scenario.expectedStatus} `
      );
      // Make a POST request to create a payment order
      cy.request({
        method: 'POST',
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: {
          amount: scenario.amount,
          currency: scenario.currency,
          description: 'Create Order tests',
          metadata: {
            orderId: '114',
            externalReference: '1234',
          },
          successRedirectUrl: utils.successRedirectUrl,
          failureRedirectUrl: utils.failureRedirectUrl,
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.status).to.eq(scenario.expectedStatus);

          const { paymentOrderId } = response.body;

          // Ensure the response body contains essential properties and information
          expect(response.body).to.have.property(
            'paymentOrderId',
            paymentOrderId
          );
          expect(response.body).to.have.property('status', 'PENDING');
        } else {
          expect(response.status).to.eq(scenario.expectedStatus);
          expect(response.status).to.not.eq(200);
        }
      });
    });
  });

  it('Handles payment order creation with missing amount parameter', () => {
    // Step 1: Make a POST request to create a payment order without providing the amount
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: 'Test Payment Order',
        metadata: {
          orderId: '1',
          externalReference: '0001',
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).to.have.property(
        'errorMessage',
        utils.INVALID_REQUEST
      );
      expect(response.body.errorDetails).to.include(
        'invalid request: amount is wrong'
      );
    });
  });

  it('Handles scenario where a negative amount is provided during payment order creation', () => {
    // Step 1: Make a POST request to create a payment order with a negative amount
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: -10.01,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: 'Test Payment Order',
        metadata: {
          orderId: '1',
          externalReference: '0001',
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).to.have.property(
        'errorMessage',
        utils.INVALID_REQUEST
      );
      expect(response.body.errorDetails).to.include(
        'invalid request: amount is wrong'
      );
    });
  });

  it('Handles payment order creation with missing currency parameter', () => {
    // Step 1: Make a POST request to create a payment order without providing the currency
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        description: 'Test Payment Order',
        metadata: {
          orderId: '1',
          externalReference: '0001',
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).to.have.property(
        'errorMessage',
        utils.INVALID_REQUEST
      );
      expect(response.body.errorDetails).to.include(
        'invalid request: currency is wrong'
      );
    });
  });

  it('Handles payment order creation with missing amount and currency parameters', () => {
    // Step 1: Make a POST request to create a payment order without providing amount and currency
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        description: 'Test Payment Order',
        metadata: {
          orderId: '1',
          externalReference: '0001',
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request returns a status code of 400 (Bad Request)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body).to.have.property(
        'errorMessage',
        utils.INVALID_REQUEST
      );
      expect(response.body.errorDetails).to.include(
        'invalid request: amount is wrong'
      );
    });
  });
});
