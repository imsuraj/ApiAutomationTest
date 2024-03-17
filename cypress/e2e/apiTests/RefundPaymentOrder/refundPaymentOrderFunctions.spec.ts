import * as utils from '../../../support/utils';

describe.skip('Refund payment order API functional tests', () => {
  //1
  it.skip('Should initiate a valid refund request with all required parameters', () => {
    // Step 1: Make a POST request to create a payment order with valid parameters
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
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
      // Verify that the create request was successful
      expect(response.status).to.eq(200);
      const { paymentOrderId } = response.body;

      // Ensure the response body contains essential properties
      expect(response.body).to.have.property('paymentOrderId', paymentOrderId);
      expect(response.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'POST',
        url: `${utils.url}/payment/${paymentOrderId}/refund`,
        failOnStatusCode: false,
        headers: utils.getApiHeaders(), // Include headers with valid secret and key
      }).then((response) => {
        // expect(response.status).to.eq(200);
        cy.log(`Response Body: ${JSON.stringify(response.body)}`);
      });
    });
  });

  it('Should initiate a refund for a valid payment reference that is eligible for a refund.', () => {
    const paymentOrderId = '9c7a3392-3964-40e2-9292-5a75f04ec560';
    // Initiate a refund request with valid refund details.
    cy.request({
      method: 'POST',
      url: `${utils.url}/payment/${paymentOrderId}/refund`,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
    }).then((response) => {
      // Verify that the API responds with a success status code - 200
      expect(response.status).to.eq(200);
      cy.log(`Response Body: ${JSON.stringify(response.body)}`);
      // Check that the refund amount is processed and reflected in the system (User Balance).
      // Ensure that the payment status is updated to "refunded."
      expect(response.body).to.have.property('paymentOrderStatus', 'REFUNDED');
    });
  });

  it('Should initiate a partial refund for a valid payment reference that is eligible for partial refund', () => {
    // Initiate a partial refund request with valid refund details.
    // Verify that the API responds with a success status code - 200
    // Check that the refund amount is deducted from the original order and reflected in the system (User Balance).
    // Ensure that the payment status is updated to "partial refunded."
  });

  it('Ensure the response contains the expected fields like `paymentOrderId`, `transactionId`, and `paymentOrderStatus upon successful refund', () => {
    const paymentOrderId = '9c7a3392-3964-40e2-9292-5a75f04ec560';
    // Initiate a refund request with valid refund details.
    cy.request({
      method: 'POST',
      url: `${utils.url}/payment/${paymentOrderId}/refund`,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
    }).then((response) => {
      // Verify that the API responds with a success status code - 200
      expect(response.status).to.eq(200);
      cy.log(`Response Body: ${JSON.stringify(response.body)}`);
      // Check that the refund amount is processed and reflected in the system (User Balance).
      // Ensure that the payment status is updated to "refunded."
      expect(response.body).to.have.property('paymentOrderId');
      expect(response.body).to.have.property('transactionId');
      expect(response.body).to.have.property('paymentOrderStatus', 'REFUNDED');
    });
  });
});
