import * as utils from '../../../support/utils';

describe('Create Payment Order API Authentication and Rate Limit tests', () => {
  it('Handles invalid API key', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getInvalidKeyApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });
  });

  it('Handles invalid API secret', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getInvalidSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });
  });

  it('Handles invalid both API Key and secret', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getInvalidKeyAndSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });
  });

  it('Handles both empty API Key and secret', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getEmptyKeyAndSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message

      expect(response.status).to.eq(401);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });
  });

  it('Handles Rate Limiting', () => {
    const numberOfRequests = 20; // Adjust the number of requests as needed
    const delayBetweenRequests = 1000; // Delay between requests in milliseconds

    // Create an array with the desired number of requests
    const requests = Array.from({ length: numberOfRequests });

    // Use Cypress each to iterate through the requests
    cy.wrap(requests).each((_, index) => {
      // Make a POST request to create a payment order
      cy.request({
        method: 'POST',
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: utils.getRequestBodyForRetrievePaymentOrder(),
        failOnStatusCode: false,
      }).then((response) => {
        // Verify the server response with an expected status code
        if (response.status === 429) {
          // The request was rate-limited
          cy.log(
            `Request ${index + 1} was rate-limited: ${JSON.stringify(response.body)}`
          );
        } else {
          // Handle the response as needed
          cy.log(
            `Received response for request ${index + 1}: ${JSON.stringify(response.body)}`
          );
        }
      });

      // Introduce a delay between requests
      if (index < numberOfRequests - 1) {
        cy.wait(delayBetweenRequests);
      }
    });
  });
});
