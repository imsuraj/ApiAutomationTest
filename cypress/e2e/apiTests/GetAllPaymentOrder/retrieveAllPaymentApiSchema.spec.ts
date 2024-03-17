import * as utils from '../../../support/utils';

const Ajv = require('ajv');
const ajv = new Ajv();

describe('Retrieve all payment order schema test', () => {
  // Response Schema Tests:

  it('Validate schema of get all payment order API', () => {
    // Step 1: Try to get Payment Order without payment order Id
    const paymentOrderId = ' ';
    cy.request({
      method: 'GET',
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeaders,
      failOnStatusCode: false,
    }).then((getResponse) => {
      // Verify the success of the get request
      expect(getResponse.status).to.eq(200);

      // Define the schema for validating the response
      const schema = {
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
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
                status: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                metadata: {
                  type: 'object',
                  properties: {
                    externalReference: {
                      type: 'string',
                    },
                    orderId: {
                      type: 'string',
                    },
                  },
                  required: [],
                },
                expiresAt: {
                  type: 'string',
                },
                createdAt: {
                  type: 'string',
                },
              },
              required: [
                'paymentOrderId',
                'organizationName',
                'amount',
                'currency',
                'status',
                'description',
                'metadata',
                'expiresAt',
                'createdAt',
              ],
            },
          },
          limit: {
            type: 'number',
          },
          nextPage: {
            type: 'string',
          },
        },
        required: ['data', 'limit', 'nextPage'],
      };

      // Compile and validate the schema
      const validate = ajv.compile(schema);
      const isValid = validate(getResponse.body);

      // Assert that the response matches the schema
      expect(isValid).to.be.true;
    });
  });
});
