const utils = require('../../support/utils')
const Ajv = require('ajv')
const ajv = new Ajv()


describe('Validation and Error Handaling in Payment Order API tests', () => {
    /**
     * Test cases for Invalid Data
     */

    it('Handles currency validation: 200 for valid currencies, 400 for invalid currencies', () => {
        // Array of currencies to be tested
        const currencies = ['AED', 'USD', 'NRS', 'EUR', 'GRB', 'AUD', 'SGD']

        // Iterate through each currency in the array
        cy.wrap(currencies).each((currency) => {
            cy.request({
                method: 'POST',
                url: utils.requestUrl,
                headers: utils.getApiHeaders(),
                body: {
                    amount: utils.generateRandomAmount(),
                    currency: `${currency}`,
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

                // Check if the currency is valid (AED or USD)
                if (!(currency == 'AED' || currency == 'USD')) {
                    // For invalid currencies, expect 400 and specific error details
                    expect(response.status).to.eq(400)
                    expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                    expect(response.body.errorDetails).to.include('invalid request: currency is wrong')
                    cy.log('Invalid Currency')
                } else {
                    // For valid currencies, expect 200 and verify essential properties
                    expect(response.status).to.eq(200)
                    const paymentOrderId = response.body.paymentOrderId
                    const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                    const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                    // Ensure the response body contains essential properties
                    expect(response.body).have.property('paymentOrderId', paymentOrderId)
                    expect(response.body).have.property('status', 'PENDING')
                    expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                    // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

                }

            })
        })
    })

    it('Handles Invalid API endpoint', () => {
        // Step 1: Make POST request to a deliberately incorrect API endpoint
        cy.request({
            method: 'POST',
            url: Cypress.config().baseUrl + '/pay/payment/orders', // Incorrect endpoint intentionally
            headers: utils.getApiHeaders(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {

            // Verify that the request returns a status code of 404 (Not Found)
            expect(response.status).to.eq(404)

            // Ensure the response body contains essential properties with expected values
            expect(response.body.error).equal('ROUTE_NOT_FOUND')

        })
    })

    it('Handles invalid content type in the request header', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getInvalidContentTypeHeader(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {

            // Verify the response status and error message
            expect(response.status).to.eq(400)
            expect(response.body.errorMessage).equal("INVALID_REQUEST")

        })
    })

    it('Handles invalid API key', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getInvalidKeyApiHeader(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {
            // Verify the response status and error message
            expect(response.status).to.eq(403)
            expect(response.body.error).equal('UNAUTHORIZED')
        })
    })

    it('Handles invalid API secret', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getInvalidSecretApiHeader(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {
            // Verify the response status and error message
            expect(response.status).to.eq(403)
            expect(response.body.error).equal('UNAUTHORIZED')
        })
    })

    it('Handles invalid both API Key and secret', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getInvalidKeyAndSecretApiHeader(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {
            // Verify the response status and error message
            expect(response.status).to.eq(403)
            expect(response.body.error).equal('UNAUTHORIZED')
        })
    })

    it('Handles both empty API Key and secret', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getEmptyKeyAndSecretApiHeader(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {
            // Verify the response status and error message

            expect(response.status).to.eq(401)
            expect(response.body.error).equal('API_KEY_MISSING')
        })
    })

    it('Handles Rate Limiting', () => {
        const numberOfRequests = 20 // Adjust the number of requests as needed
        const delayBetweenRequests = 0 // Delay between requests in milliseconds

        // Iterate through the desired number of requests
        for (let i = 0; i < numberOfRequests; i++) {
            // Make a POST request to create a payment order
            cy.request({
                method: 'POST',
                url: utils.requestUrl,
                headers: utils.getApiHeaders(),
                body: utils.getRequestBodyForRetrivePaymentOrder(),
                failOnStatusCode: false
            }).then((response) => {
                // Verify the server response with an expected status code
                if (response.status === 429) {
                    // The request was rate-limited
                    cy.log(`Request ${i + 1} was rate-limited: ${response.body}`)
                } else {
                    // Handle the response as needed
                    cy.log(`Received response for request ${i + 1}: ${response.body}`)
                }
            })
            
            // Introduce a delay between requests
            if (i < numberOfRequests - 1) {
                cy.wait(delayBetweenRequests)
            }
        }
    })

    it('Handles requests over HTTP', () => {
        // Step 1: Make POST request to create a payment order 
        cy.request({
            method: 'POST',
            url: "http://api.dev.pyypl.io/pay/payment/order",
            headers: utils.getApiHeaders(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((response) => {
            // Verify the response status and error message
            expect(response.status).to.eq(403)
        })
    })

    it('Handles invalid amount scenarios', () => {
        // Load  test data from fixture file
        cy.fixture('invalidAmount').as('invalidAmount')
        // Access the  test data 
        cy.get('@invalidAmount').then((data) => {
            // Iterate through each data and make a POST request.
            data.invalidAmount.forEach((invalidAmount) => {
                // Make POST request to create a payment order with invalid amount
                cy.request({
                    method: 'POST',
                    url: utils.requestUrl,
                    failOnStatusCode: false,
                    headers: utils.getApiHeaders(),
                    body: {
                        amount: invalidAmount,
                        currency: Cypress._.shuffle(utils.currencies)[0],
                        description: "Test Payment Order",
                        metadata: {
                            orderId: "1",
                            externalReference: "0001"
                        },
                        successRedirectUrl: utils.successRedirectUrl,
                        failureRedirectUrl: utils.failureRedirectUrl
                    }
                }).then((response) => {

                    // Verify the response status and error details
                    expect(response.status).to.eq(400)
                    expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                    expect(response.body.errorDetails).to.include('invalid request: amount is wrong')

                    cy.log(`Test passed for amount: ${invalidAmount}`)

                })
            })
        })
    })

    it('Handles invalid currency code scenarios', () => {
        // Make POST request to create a payment order with an invalid currency code
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(),
            body: {
                amount: utils.generateRandomAmount(),
                currency: "INVALID",
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {

            // Verify the response status and error details
            expect(response.status).to.eq(400)
            expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
            expect(response.body.errorDetails).to.include('invalid request: currency is wrong')

        })
    })

    it('Handles invalid success redirect URL scenario', () => {
        // Make POST request to create a payment order with an invalid success redirect URL
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(),
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: 'invalidUrl',
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {

            // Verify the response status and error details
            expect(response.status).to.eq(400)
            expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
            expect(response.body.errorDetails).to.include('invalid request: successRedirectUrl is wrong')

        })
    })

    it('Handles invalid failure redirect URL scenario', () => {
        // Make POST request to create a payment order with an invalid failure redirect URL
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(),
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: 'invaldUrl'
            }
        }).then((response) => {

            // Verify the response status and error details
            expect(response.status).to.eq(400)
            expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
            expect(response.body.errorDetails).to.include('invalid request: failureRedirectUrl is wrong')

        })
    })

    it('Validate the response Schema', () => {
        // Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(),
            body: utils.getRequestBodyForRetrivePaymentOrder()
        }).then((response) => {

            // Verify the response status
            expect(response.status).to.eq(200)

            // Define the expected response schema
            const schema = {
                "type": "object",
                "properties": {
                    "paymentOrderId": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string"
                    },
                    "webRedirectUrl": {
                        "type": "string"
                    }
                },
                "required": [
                    "paymentOrderId",
                    "status",
                    "webRedirectUrl"
                ]
            }

            // Validate the response against the schema
            const validate = ajv.compile(schema)
            const isValid = validate(response.body)

            // Ensure the response adheres to the expected schema
            expect(isValid).to.be.true

        })
    })

    it('Validate schema of get payment order', () => {
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: utils.getRequestBodyForRetrivePaymentOrder(),
            failOnStatusCode: false
        }).then((createResponse) => {

            // Verify the success of the create request
            expect(createResponse.status).to.eq(200)
            expect(createResponse.body).to.have.property('paymentOrderId')

            // Step 2: Get Payment Order
            const paymentOrderId = createResponse.body.paymentOrderId
            cy.request({
                method: 'GET',
                url: Cypress.config().baseUrl + '/pay/payment/order/' + paymentOrderId,
                failOnStatusCode: false
            }).then((getResponse) => {

                // Verify the success of the get request
                expect(getResponse.status).to.eq(200)

                // Define the schema for validating the response
                const schema = {
                    "properties": {
                        "paymentOrderId": { "type": "string" },
                        "organizationId": { "type": "string" },
                        "organizationName": { "type": "string" },
                        "amount": { "type": "number" },
                        "currency": { "type": "string" },
                        "createdAt": { "type": "string" },
                        "expiresAt": { "type": "string" },
                        "status": { "type": "string" },
                        "appRedirectUrl": { "type": "string" },
                        "successRedirectUrl": { "type": "string" },
                        "failureRedirectUrl": { "type": "string" }
                    },
                    "required": [
                        "paymentOrderId",
                        "organizationId",
                        "organizationName",
                        "amount",
                        "currency",
                        "createdAt",
                        "expiresAt",
                        "status",
                        "appRedirectUrl",
                        "successRedirectUrl",
                        "failureRedirectUrl"
                    ]
                }

                // Compile and validate the schema
                const validate = ajv.compile(schema)
                const isValid = validate(getResponse.body)

                // Assert that the response matches the schema
                expect(isValid).to.be.true

            })

        })
    })
})