import * as utils from '../../../support/utils';

describe('Create/Retrieve Payment Order API timeout and concurrency test', () => {
  it('Handles connection timeouts gracefully', () => {
    const timeoutDuration = 3000; // Set your desired timeout duration in milliseconds

    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false, // Set to true to fail on non-2xx status codes
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      timeout: timeoutDuration,
    }).then((response) => {
      // Handle the response or check for a timeout
      if (response.status === 0) {
        // The request timed out
        cy.log('The request encountered an error:');
      } else {
        // The request completed within the specified timeout
        // Handle the response as needed
        cy.log('Received response:', response.body);
      }
    });
  });

  it('Creates Payment Order API - Handles concurrent requests under load', () => {
    // Simulate concurrent requests (5 in this case)
    Cypress._.times(utils.concurrentUser, () => {
      const amount = utils.generateRandomAmount();
      const currency = Cypress._.shuffle(utils.currencies)[0];

      // Make POST request to create a payment order
      cy.request({
        method: 'POST',
        url: utils.requestUrl,
        failOnStatusCode: false,
        headers: utils.getApiHeaders(),
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
        expect(response.body).have.property('paymentOrderId', paymentOrderId);
        expect(response.body).have.property('status', 'PENDING');
        expect(response.body).have.property('expiresAt');
        expect(response.body).have.property(
          'webRedirectUrl',
          `${utils.webRedirectHostUrl}${paymentOrderId}`
        );
        expect(response.body).have.property(
          'appRedirectUrl',
          `${utils.appRedirectHostUrl}${paymentOrderId}`
        );
        expect(response.body).to.have.property('amount', amount);
        expect(response.body).to.have.property('currency', currency);
      });
    });
  });

  it('Creates and fetches payment order details simultaneously to check concurrency', () => {
    const requestBody = utils.getRequestBodyForRetrievePaymentOrder();

    // Step 1: Make concurrent POST requests to create payment orders
    Cypress._.times(utils.concurrentUser, () => {
      cy.request({
        method: 'POST',
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: requestBody,
        failOnStatusCode: false,
      }).then((createResponse) => {
        // Verify the success of the create request
        expect(createResponse.status).to.eq(200);
        expect(createResponse.body).to.have.property('paymentOrderId');

        // Step 2: Concurrently get Payment Order
        const paymentOrderId = createResponse.body.paymentOrderId;
        const expiresAt = createResponse.body.expiresAt;

        cy.request({
          method: 'GET',
          url: `${Cypress.config().baseUrl}/pay/payment/order/${paymentOrderId}`,
          failOnStatusCode: false,
        }).then((getResponse) => {
          // Verify the success of the get request
          expect(getResponse.status).to.eq(200);

          const expectedCreatedAt = utils.subtractMinutes(expiresAt);

          // Ensure the response body contains essential properties with expected values
          expect(getResponse.body).to.have.property(
            'paymentOrderId',
            paymentOrderId
          );
          // expect(getResponse.body).to.have.property('organizationId');
          expect(getResponse.body).to.have.property(
            'organizationName',
            utils.organizationName
          );
          expect(getResponse.body).to.have.property(
            'amount',
            requestBody.amount
          );
          expect(getResponse.body).to.have.property(
            'currency',
            requestBody.currency
          );

          // Convert and compare createdAt timestamp
          const createdAt = getResponse.body.createdAt;
          const actualCreateAt = utils.convertTimestamp(createdAt);
          expect(actualCreateAt).to.eq(expectedCreatedAt);

          expect(getResponse.body).to.have.property('expiresAt', expiresAt);
          expect(getResponse.body).to.have.property('status', 'PENDING');
          expect(getResponse.body).to.have.property('appRedirectUrl');
          expect(getResponse.body).to.have.property(
            'successRedirectUrl',
            utils.successRedirectUrl
          );
          expect(getResponse.body).to.have.property(
            'failureRedirectUrl',
            utils.failureRedirectUrl
          );
        });
      });
    });
  });
});
