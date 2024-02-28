const utils = require('../../support/utils')

describe('Create Payment Order API edge cases tests', () => {
    it('Handles extreme value for amount scenario', () => {
        // Make POST request to create a payment order with an amount exceeding MAX_SAFE_INTEGER
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: {
                amount: Number.MAX_SAFE_INTEGER + 1,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            },
            failOnStatusCode: false
        }).then((response) => {
              //Validate expected response and log response body
              expect(response.status).to.eq(500)
              cy.log(`Request Body: ${JSON.stringify(response.body)}`)
              cy.log(`Response Status: ${response.status}`)
        })
    })


})