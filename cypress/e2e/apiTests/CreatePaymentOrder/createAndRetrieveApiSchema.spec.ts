import * as utils from '../../../support/utils';

const Ajv = require('ajv');
const ajv = new Ajv();

describe('Validate schema test for both Create and Get Payment Order', () => {
  // Response Schema Tests:

  it('Validate the response Schema of create payment order API', () => {
    // Make POST request to create a payment order
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
    }).then((response) => {
      // Verify the response status
      expect(response.status).to.eq(200);

      // Define the expected response schema
      const schema = {
        type: 'object',
        properties: {
          paymentOrderId: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
          expiresAt: {
            type: 'string',
          },
          webRedirectUrl: {
            type: 'string',
          },
          appRedirectUrl: {
            type: 'string',
          },
          amount: {
            type: 'number',
          },
          currency: {
            type: 'string',
          },
        },
        required: [
          'paymentOrderId',
          'status',
          'expiresAt',
          'webRedirectUrl',
          'appRedirectUrl',
          'amount',
          'currency',
        ],
      };

      // Validate the response against the schema
      const validate = ajv.compile(schema);
      const isValid = validate(response.body);

      // Ensure the response adheres to the expected schema
      expect(isValid).to.be.true;
    });
  });

  it('Validate schema of get payment order API', () => {
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
        method: 'GET',
        url: `${Cypress.config().baseUrl}/pay/payment/order/${paymentOrderId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        // Verify the success of the get request
        expect(getResponse.status).to.eq(200);

        // Define the schema for validating the response
        const schema = {
          properties: {
            paymentOrderId: {
              type: 'string',
            },
            organizationName: {
              type: 'string',
            },
            amount: {
              type: 'number',
            },
            currency: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
            },
            expiresAt: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            appRedirectUrl: {
              type: 'string',
            },
            successRedirectUrl: {
              type: 'string',
            },
            failureRedirectUrl: {
              type: 'string',
            },
          },
          required: [
            'paymentOrderId',
            'organizationName',
            'amount',
            'currency',
            'createdAt',
            'expiresAt',
            'status',
            'appRedirectUrl',
            'successRedirectUrl',
            'failureRedirectUrl',
          ],
        };

        // Compile and validate the schema
        const validate = ajv.compile(schema);
        const isValid = validate(getResponse.body);

        // Assert that the response matches the schema
        expect(isValid).to.be.true;
      });
    });
  });
});
