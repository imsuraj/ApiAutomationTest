import * as utils from '../../../support/utils';

describe('Create Payment Order API security tests', () => {
  it.skip('Prevents SQL injection', () => {
    // Load SQL injection test data from fixture file
    cy.fixture('sqlInjectionTestData').as('sqlInjectionTestData');
    // Access the SQL injection test data using this.sqlInjectionTestData
    cy.get('@sqlInjectionTestData').then((data: any) => {
      // Iterate through each SQL injection payload and make a POST request.
      data.sqlInjectionTestData.forEach((sqlInjectionData) => {
        cy.request({
          method: 'POST',
          url: utils.requestUrl,
          headers: utils.getApiHeaders(),
          body: {
            amount: sqlInjectionData,
            currency: `${sqlInjectionData}`,
            description: `${sqlInjectionData}`,
            metadata: {
              orderId: `${sqlInjectionData}`,
              externalReference: `${sqlInjectionData}`,
            },
            successRedirectUrl: `${sqlInjectionData}`,
            failureRedirectUrl: `${sqlInjectionData}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Validate expected response and log response body
          expect(response.status).to.eq(400);
          cy.log(`SQL Injection Test Data: ${sqlInjectionData}`);
          cy.log(`Request Body: ${JSON.stringify(response.body)}`);
          cy.log(`Response Status: ${response.status}`);
        });
      });
    });
  });

  it.skip('Prevents Cross-Site Scripting (XSS)', () => {
    // Load XSS test data from fixture file
    cy.fixture('xssTestData').as('xssTestData');
    // Access the XSS test data using this.xssTestData
    cy.get('@xssTestData').then((data: any) => {
      // Iterate through each XSS payload and make a POST request.
      data.xssTestData.forEach((xssData) => {
        // Make POST request to create a payment order with potential XSS payload
        cy.request({
          method: 'POST',
          url: utils.requestUrl,
          headers: utils.getApiHeaders(),
          body: {
            amount: xssData,
            currency: `${xssData}`,
            description: `${xssData}`,
            metadata: {
              orderId: `${xssData}`,
              externalReference: `${xssData}`,
            },
            successRedirectUrl: `${xssData}`,
            failureRedirectUrl: `${xssData}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Validate expected response and log response body
          expect(response.status).to.eq(400);
          cy.log(`XSS Test Data: ${xssData}`);
          cy.log(`Request Body: ${JSON.stringify(response.body)}`);
          cy.log(`Response Status: ${response.status}`);
        });
      });
    });
  });

  it('Handles malformed JSON Data', () => {
    // Make POST request to create a payment order with malformed JSON data
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: '{ amount: 33, currency: "AED", description: "Payment for goods" ', // Malformed JSON
      failOnStatusCode: false,
    }).then((response) => {
      // Validate expected response and log response body
      expect(response.status).to.eq(500);
      cy.log(`Request Body: ${JSON.stringify(response.body)}`);
      cy.log(`Response Status: ${response.status}`);
    });
  });

  it.skip('Handles exceeding max payload size', () => {
    // Make POST request to create a payment order with a payload that exceeds the max size
    cy.request({
      method: 'POST',
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
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
        randomPayload1: "' DROP TABLE Orders --",
        randomPayload2: "' DROP TABLE Orders --",
        randomPayload3: "' DROP sadfTABLE Orders --",
        randomPayload4: "' DROP TABLE dsfsdfsOrders --",
        randomPayload5: "' DROP TABLE Orders --",
        randomPayload6: "' DROP TABLE Orders --",
        randomPayload7: "' DROP TABLE Orders --",
        randomPayload8: "' DROP TABLE Orders --",
        randomPayload9: "' DROP TABLE Orders --",
        randomPayload10: "' DROP TABLE Orders --",
        randomPayload11: "' DROP TABLE Orders --",
        randomPayload12: "' DROP TABLE Orders --",
        randomPayload13: "' DROP TABLE Orders --",
        randomPayload14: "' DROP TABLE Orders --",
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Validate expected response and log response body
      expect(response.status).to.eq(413);
      cy.log(`Request Body: ${JSON.stringify(response.body)}`);
      cy.log(`Response Status: ${response.status}`);
    });
  });
});
