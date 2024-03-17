import * as utils from '../../../support/utils';

describe('Get all Payment Order API tests', () => {
  /**
   * Get all Payment Order API Tests
   */

  it('Should fetch all payment order detail', () => {
    // Step 1: Get All Payment Order
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeadersForAllPayment,
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the response code is 200
      expect(response.status).to.eq(200);

      // Verify that the response body is an object with a 'data' property
      expect(response.body).to.have.property('data').that.is.an('array').that.is
        .not.empty;

      // Checking the presence of certain attributes in the first payment order
      const firstPaymentOrder = response.body.data[0];
      expect(firstPaymentOrder).to.have.property('paymentOrderId');
      expect(firstPaymentOrder).to.have.property(
        'organizationName',
        utils.organizationName
      );
      expect(firstPaymentOrder).to.have.property('amount');
      expect(firstPaymentOrder).to.have.property('currency');
      expect(firstPaymentOrder).to.have.property('status');
      expect(firstPaymentOrder).to.have.property('description');
      expect(firstPaymentOrder).to.have.property('metadata');
      expect(firstPaymentOrder).to.have.property('expiresAt');
      expect(firstPaymentOrder).to.have.property('createdAt');
    });
  });

  it.skip('should fetch empty list of payment order  when there are no payment orders', () => {
    // Step 1: Try to get Payment Order without payment order Id
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeaders,
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get payment order without Id is unauthorized
      expect(response.status).to.eq(200);

      // Verify that the response body is an object with a 'data' property is empty
      expect(response.body).to.have.property('data').that.is.an('array').that.is
        .empty;
    });
  });

  it('Handles Invalid api endpoint', () => {
    // Step 1: Try to get Payment Order without payment order Id
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}invalid`,
      headers: utils.getApiHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get payment order for invalid endpoint
      expect(response.status).to.eq(404);
      expect(response.body.error).equal(utils.ROUTE_NOT_FOUND);
      expect;
    });
  });

  it('Handles Invalid request over HTTP', () => {
    // Step 1: Make POST request to a deliberately incorrect API endpoint
    cy.request({
      method: 'GET',
      url: 'http://api.dev.pyypl.io' + '/pay/payment/order/', // Incorrect url intentionally
      headers: utils.getApiHeaders(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the response is 403
      expect(response.status).to.eq(403);
    });
  });

  it('Handles Invalid method', () => {
    // Step 1: Make PUT request to a deliberately incorrect API endpoint
    cy.request({
      method: 'PUT', // Incorrect method intentionally
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request returns a status code of 404 (Not Found)
      expect(response.status).to.eq(404);

      // Ensure the response body contains essential properties with expected values
      expect(response.body.error).equal(utils.ROUTE_NOT_FOUND);
    });

    // Step 1: Make POST request to a deliberately incorrect API endpoint
    cy.request({
      method: 'POST', // Incorrect method intentionally
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request returns a status code of 404 (Not Found)
      expect(response.status).to.eq(400);

      // Ensure the response body contains essential properties with expected values
      expect(response.body.errorMessage).equal(utils.INVALID_REQUEST);
    });
  });

  it('Handles Unauthorized access for all empty, invalid header and invalid key or secret', () => {
    // Step 1: Try to get Payment Order without header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order without header is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with valid header but having content type
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeaders(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with empty key and secret header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getEmptyHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with empty key  header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getEmptyKeyHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with empty secret  header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getEmptySecretHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with invalid key  header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getInvalidKeyHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with invalid secret  header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getInvalidSecretHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });

    // Step 1: Try to get Payment Order with invalid key and secret  header
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getInvalidKeyAndSecretHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request to get all payment order is unauthorized
      expect(response.status).to.eq(400);
      expect(response.body.error).equal(utils.UNAUTHORIZED);
    });
  });
});
