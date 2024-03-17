import * as utils from '../../../support/utils';

describe('Retrieve Payment Order Privately API tests', () => {
  /**
   * Get Payment Order API Tests
   */

  it('should create payment order and fetch payment order details privately for a correct payment order Id', () => {
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
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
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
        expect(getResponse.body).to.have.property('status', 'PENDING');
        expect(getResponse.body).to.have.property(
          'description',
          requestBody.description
        );
        expect(getResponse.body.metadata).to.have.property(
          'externalReference',
          requestBody.metadata.externalReference
        );
        expect(getResponse.body.metadata).to.have.property(
          'orderId',
          requestBody.metadata.orderId
        );
        expect(getResponse.body).to.have.property('expiresAt', expiresAt);

        // Convert and compare createdAt timestamp
        const createdAt = getResponse.body.createdAt;
        const actualCreateAt = utils.convertTimestamp(createdAt);
        expect(actualCreateAt).to.eq(expectedCreatedAt);
      });
    });
  });

  it('should create payment order without meta data and fetch payment order details privately without metadata for a correct payment order Id', () => {
    const requestBody =
      utils.getRequestBodyWithoutMetadataForRetrievePaymentOrder();
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
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
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
        expect(getResponse.body).to.have.property('status', 'PENDING');
        expect(getResponse.body).to.have.property(
          'description',
          requestBody.description
        );
        expect(getResponse.body).to.not.have.property('metadata');
        expect(getResponse.body).to.have.property('expiresAt', expiresAt);

        // Convert and compare createdAt timestamp
        const createdAt = getResponse.body.createdAt;
        const actualCreateAt = utils.convertTimestamp(createdAt);
        expect(actualCreateAt).to.eq(expectedCreatedAt);
      });
    });
  });

  it('should not fetch payment order detail privately for a correct payment order Id that does not exist', () => {
    // Step 1: Get payment order
    cy.request({
      method: 'GET',
      url: `${utils.requestPrivateOrderUrl}${utils.generateUUID()}`,
      headers: utils.getApiHeadersForAllPayment(),
      failOnStatusCode: false,
    }).then((getResponse) => {
      // Verify the failure of the get request
      expect(getResponse.status).to.eq(404);

      // Ensure the response body contains essential properties with expected values
      expect(getResponse.body).to.have.property(
        'errorMessage',
        utils.PAYMENT_NOT_FOUND
      );
    });
  });

  it('should create payment order and not fetch payment order details privately when (-) is removed from the paymentOrderID', () => {
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

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId.replace(/-/g, '')}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.PAYMENT_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately when (-) is replaced by space in the paymentOrderID', () => {
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

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId.replace(/-/g, ' ')}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.PAYMENT_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details  privately when (-) is replaced by special character $ in the paymentOrderID', () => {
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

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId.replace(/-/g, '$')}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.PAYMENT_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately when a single character is added before a paymentOrderId', () => {
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

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestPrivateOrderUrl}` + `a${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.PAYMENT_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately when a single character is added at the end of a paymentOrderId', () => {
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

      // Ensure the response body contains essential properties
      expect(createResponse.body).to.have.property(
        'paymentOrderId',
        paymentOrderId
      );
      expect(createResponse.body).to.have.property('status', 'PENDING');

      cy.request({
        method: 'GET',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}a`,
        failOnStatusCode: false,
        headers: utils.getApiHeadersForAllPayment(),
      }).then((getResponse) => {
        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.PAYMENT_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately for incorrect headers with empty or invalid  secret and key', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((createResponse) => {
      // Verify the success of the create request
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body).to.have.property('paymentOrderId');

      // Step 2: Try to get Payment Order with incorrect headers
      const paymentOrderId = createResponse.body.paymentOrderId;

      cy.request({
        method: 'GET',
        headers: utils.getApiHeaders(), // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getEmptyHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getEmptyKeyHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getEmptySecretHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getInvalidSecretHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getInvalidKeyHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getInvalidSecretHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });

      cy.request({
        method: 'GET',
        headers: utils.getInvalidKeyAndSecretHeadersForAllPayment, // Incorrect headers
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order with incorrect headers results in 401 UNAUTHORIZED
        expect(getResponse.status).to.eq(401);
        expect(getResponse.body).to.have.property(
          'errorMessage',
          utils.UNAUTHORIZED
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately for a incorrect  Method', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST', // Incorrect method intentionally
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((createResponse) => {
      // Verify the success of the create request
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body).to.have.property('paymentOrderId');

      // Step 2: Get Payment Order
      const paymentOrderId = createResponse.body.paymentOrderId;
      cy.request({
        method: 'POST',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order for incorrect Method is 404
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'error',
          utils.ROUTE_NOT_FOUND
        );
      });

      cy.request({
        method: 'PUT',
        url: `${utils.requestPrivateOrderUrl}${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order for incorrect Method is 404
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'error',
          utils.ROUTE_NOT_FOUND
        );
      });
    });
  });

  it('should create payment order and not fetch payment order details privately for a incorrect endpoint', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST', // Incorrect method intentionally
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((createResponse) => {
      // Verify the success of the create request
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body).to.have.property('paymentOrderId');

      // Step 2: Get Payment Order
      const paymentOrderId = createResponse.body.paymentOrderId;
      cy.request({
        method: 'POST',
        url: `${utils.requestPrivateOrderUrl}invalid/${paymentOrderId}/a`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the request to get payment order for incorrect Method is 404
        expect(getResponse.status).to.eq(404);
        expect(getResponse.body).to.have.property(
          'error',
          utils.ROUTE_NOT_FOUND
        );

        expect;
      });
    });
  });

  it('should create payment order and not fetch payment order details privately for request over HTTP', () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((createResponse) => {
      // Verify the success of the create request
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body).to.have.property('paymentOrderId');

      // Step 2: Get Payment Order
      const paymentOrderId = createResponse.body.paymentOrderId;
      cy.request({
        method: 'POST',
        url: `${'http://api.dev.pyypl.io' + '/pay/private/payment/order/'}${paymentOrderId}`,
        headers: utils.getApiHeadersForAllPayment(),
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify that the response is unauthorized
        expect(getResponse.status).to.eq(403);
      });
    });
  });
});
