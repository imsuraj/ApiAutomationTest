import * as utils from "../../support/utils";

describe("Create Payment Order API Authentication and Rate Limit tests", () => {
  it("Handles invalid API key", () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getInvalidKeyApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal("UNAUTHORIZED");
    });
  });

  it("Handles invalid API secret", () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getInvalidSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal("UNAUTHORIZED");
    });
  });

  it("Handles invalid both API Key and secret", () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getInvalidKeyAndSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(403);
      expect(response.body.error).equal("UNAUTHORIZED");
    });
  });

  it("Handles both empty API Key and secret", () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getEmptyKeyAndSecretApiHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message

      expect(response.status).to.eq(401);
      expect(response.body.error).equal("UNAUTHORIZED");
    });
  });

  it("Handles Rate Limiting", () => {
    const numberOfRequests = 20; // Adjust the number of requests as needed
    const delayBetweenRequests = 100; // Delay between requests in milliseconds

    // Iterate through the desired number of requests
    for (let i = 0; i < numberOfRequests; i++) {
      // Make a POST request to create a payment order
      cy.request({
        method: "POST",
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: utils.getRequestBodyForRetrievePaymentOrder(),
        failOnStatusCode: false,
      }).then((response) => {
        // Verify the server response with an expected status code
        if (response.status === 429) {
          // The request was rate-limited
          cy.log(`Request ${i + 1} was rate-limited: ${response.body}`);
        } else {
          // Handle the response as needed
          cy.log(`Received response for request ${i + 1}: ${response.body}`);
        }
      });

      // Introduce a delay between requests
      if (i < numberOfRequests - 1) {
        cy.wait(delayBetweenRequests);
      }
    }
  });
});
