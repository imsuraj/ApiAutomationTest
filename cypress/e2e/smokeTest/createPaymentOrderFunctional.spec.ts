import * as utils from '../../support/utils';

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
});
