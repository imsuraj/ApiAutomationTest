import * as utils from '../../support/utils';

describe('Retrieve Payment Order API tests', () => {
  /**
   * Get Payment Order API Tests
   */

  it('should create payment order and fetch payment order details for a correct payment order Id', () => {
    const requestBody = utils.getRequestBodyForRetrievePaymentOrder();
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: requestBody,
      failOnStatusCode: false,
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(200);

      const paymentOrderId = createResponse.body.paymentOrderId;
      const expiresAt = createResponse.body.expiresAt;

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestUrl}/${paymentOrderId}`,
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
        expect(getResponse.body).to.have.property('amount', requestBody.amount);
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
