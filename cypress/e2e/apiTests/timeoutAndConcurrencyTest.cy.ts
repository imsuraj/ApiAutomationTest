import * as utils from "../../support/utils";

describe("Create/Retrieve Payment Order API timeout and concurrency test", () => {
  it.only("Handles connection timeouts gracefully", () => {
    const timeoutDuration = 3000; // Set your desired timeout duration in milliseconds

    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false, // Set to true to fail on non-2xx status codes
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      timeout: timeoutDuration,
      // retryOnStatusCodeFailure: true, // Retry on non-2xx status codes
      // retryOnNetworkFailure: true, // Retry on network failures
      // retryOnTimeout: true // Retry on timeouts
    }).then((response) => {
      // Handle the response or check for a timeout
      if (response.status === 0) {
        // The request timed out
        cy.log("The request encountered an error:");
      } else {
        // The request completed within the specified timeout
        // Handle the response as needed
        cy.log("Received response:", response.body);
      }
    });
  });

  it("Handles concurrent requests under load", () => {
    // Simulate concurrent requests (5 in this case)
    Cypress._.times(utils.concurrentUser, () => {
      // Make POST request to create a payment order
      cy.request({
        method: "POST",
        url: utils.requestUrl,
        failOnStatusCode: false,
        headers: utils.getApiHeaders(),
        body: utils.getRequestBodyForRetrievePaymentOrder(),
      }).then((response) => {
        // Verify that the create request was successful
        expect(response.status).to.eq(200);
        const paymentOrderId = response.body.paymentOrderId;
        const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
        const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

        // Ensure the response body contains essential properties
        expect(response.body).have.property("paymentOrderId", paymentOrderId);
        expect(response.body).have.property("status", "PENDING");

        // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
      });
    });
  });

  it("should create and fetch payment order details simultaneously to check concurrency", () => {
    const requestBody = utils.getRequestBodyForRetrievePaymentOrder();
    // Step 1: Make concurrent POST requests to create payment orders
    Cypress._.times(utils.concurrentUser, () => {
      cy.request({
        method: "POST",
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: requestBody,
        failOnStatusCode: false,
      }).then((createResponse) => {
        // Verify the success of the create request
        expect(createResponse.status).to.eq(200);
        expect(createResponse.body).to.have.property("paymentOrderId");

        // Step 2: Concurrently get Payment Order
        const paymentOrderId = createResponse.body.paymentOrderId;

        cy.request({
          method: "GET",
          url:
            Cypress.config().baseUrl + "/pay/payment/order/" + paymentOrderId,
          failOnStatusCode: false,
        }).then((getResponse) => {
          // Verify the success of the get request
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body).to.have.property(
            "paymentOrderId",
            paymentOrderId
          );
          expect(getResponse.body).to.have.property("organizationId");
          expect(getResponse.body).to.have.property(
            "organizationName",
            utils.organizationName
          );
          expect(getResponse.body).to.have.property(
            "amount",
            requestBody.amount
          );
          expect(getResponse.body).to.have.property(
            "currency",
            requestBody.currency
          );
          expect(getResponse.body).to.have.property("status", "PENDING");
          expect(getResponse.body).to.have.property(
            "successRedirectUrl",
            utils.successRedirectUrl
          );
          expect(getResponse.body).to.have.property(
            "failureRedirectUrl",
            utils.failureRedirectUrl
          );
        });
      });
    });
  });
});
