const utils = require('../../support/utils')

describe('Retrieve Payment Order API tests', () => {
    /**
    * Get Payment Order API Tests
    */

    it('should create payment order and fetch payment order details for a correct payment order Id', () => {
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

                cy.request({
                    method: 'GET',
                    url: utils.requestUrl + '/' + paymentOrderId,
                    failOnStatusCode: false
                }).then((getResponse) => {
                    
                        // Verify the success of the get request
                        expect(getResponse.status).to.eq(200)

                        // Ensure the response body contains essential properties with expected values
                        expect(getResponse.body).to.have.property('paymentOrderId', paymentOrderId)
                        expect(getResponse.body).to.have.property('organizationId')
                        expect(getResponse.body).to.have.property('organizationName', utils.organizationName)
                        expect(getResponse.body).to.have.property('amount', requestBody.amount)
                        expect(getResponse.body).to.have.property('currency', requestBody.currency)
                        expect(getResponse.body).to.have.property('status', 'PENDING')
                        expect(getResponse.body).to.have.property('successRedirectUrl', utils.successRedirectUrl)
                        expect(getResponse.body).to.have.property('failureRedirectUrl', utils.failureRedirectUrl)
                    
                })
            
        })
    })

    it('should not fetch payment order detail for a correct payment order Id that does not exist', () => {

        // Step 1: Get payment order
        cy.request({
            method: 'GET',
            url: utils.requestUrl + '/' + utils.generateUUID(),
            failOnStatusCode: false
        }).then((getResponse) => {
            
            // Verify the failure of the get request 
            expect(getResponse.status).to.eq(404)

            // Ensure the response body contains essential properties with expected values
            expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
        
        })
    })

    it('should not fetch payment order detail without/empty payment order Id', () => {
        // Step 1: Try to get Payment Order without payment order Id
        const paymentOrderId = ' '
        cy.request({
            method: 'GET',
            url: utils.requestUrl + '/' + paymentOrderId,
            failOnStatusCode: false
        }).then((getResponse) => {
            
            // Verify that the request to get payment order without Id is unauthorized
            expect(getResponse.status).to.eq(401)
        
        })
    })

    it('should create payment order and not fetch payment order details when (-) is removed from the paymentOrderID', () => {
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

            cy.request({
                method: 'GET',
                url: utils.requestUrl + '/' + paymentOrderId.replace(/-/g, ''),
                failOnStatusCode: false
            }).then((getResponse) => {
                
                // Verify that the request to get payment order with invalid Id format results in 404 Not Found
                expect(getResponse.status).to.eq(404)
                expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
            
            })
        
        })
    })

    it('should create payment order and not fetch payment order details when (-) is replaced by space in the paymentOrderID', () => {
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

            cy.request({
                method: 'GET',
                url: utils.requestUrl + '/' + paymentOrderId.replace(/-/g, ' '),
                failOnStatusCode: false
            }).then((getResponse) => {
                
                // Verify that the request to get payment order with invalid Id format results in 404 Not Found
                expect(getResponse.status).to.eq(404)
                expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
            
            })
        
        })
    })

    it('should create payment order and not fetch payment order details when (-) is replaced by special character $ in the paymentOrderID', () => {
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

            cy.request({
                method: 'GET',
                url: utils.requestUrl + '/' + paymentOrderId.replace(/-/g, '$'),
                failOnStatusCode: false
            }).then((getResponse) => {
                
                // Verify that the request to get payment order with invalid Id format results in 404 Not Found
                expect(getResponse.status).to.eq(404)
                expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
            
            })
        
        })
    })

    it('should create payment order and not fetch payment order details when a single character is added before a paymentOrderId', () => { 
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

            cy.request({
                method: 'GET',
                url: utils.requestUrl + '/' + 'a' + paymentOrderId,
                failOnStatusCode: false
            }).then((getResponse) => {
                
                // Verify that the request to get payment order with invalid Id format results in 404 Not Found
                expect(getResponse.status).to.eq(404)
                expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
            
            })
        
        })
    })

    it('should create payment order and not fetch payment order details when a single character is added at the end of a paymentOrderId', () => {
        const requestBody = utils.getRequestBodyForRetrivePaymentOrder()
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            headers: utils.getApiHeaders(),
            body: requestBody,
            failOnStatusCode: false
        }).then((createResponse) => {
            
                expect(createResponse.status).to.eq(200)
                const paymentOrderId = createResponse.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(requestBody.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(requestBody.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(createResponse.body).have.property('paymentOrderId', paymentOrderId)
                expect(createResponse.body).have.property('status', 'PENDING')
                // expect(createResponse.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                expect(createResponse.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

                cy.request({
                    method: 'GET',
                    url: utils.requestUrl + '/' + paymentOrderId + 'a',
                    failOnStatusCode: false
                }).then((getResponse) => {
                    
                        // Verify that the request to get payment order with invalid Id format results in 404 Not Found
                        expect(getResponse.status).to.eq(404)
                        expect(getResponse.body).to.have.property('errorMessage', 'PAYMENT_NOT_FOUND')
                    
                })
            
        })
    })

    it('should create payment order and not fetch payment order details for incorrect headers with valid secret and key', () => {
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

            // Step 2: Try to get Payment Order with incorrect headers
            const paymentOrderId = createResponse.body.paymentOrderId
            cy.request({
                method: 'GET',
                headers: utils.getApiHeaders(), // Incorrect headers
                url: utils.requestUrl + '/' + paymentOrderId,
                failOnStatusCode: false
            }).then((getResponse) => {

                // Verify that the request to get payment order with incorrect headers results in 500 Internal Server Error
                expect(getResponse.status).to.eq(500)
                expect(getResponse.body).to.have.property('errorMessage', 'INTERNAL_SERVER_ERROR')
            })
        
        })
    })

    it('should create payment order and not fetch payment order details for a incorrect  Method', () => {
        // Step 1: Make POST request to create a payment order
        cy.request({
            method: 'POST', // Incorrect method intentionally
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
                method: 'POST',
                url: utils.requestUrl + '/' + paymentOrderId,
                failOnStatusCode: false
            }).then((getResponse) => {
                // Verify that the request to get payment order without Id is unauthorized
                expect(getResponse.status).to.eq(401)
            })
        
        })
    })

    it('should create payment order and not fetch payment order details for request over HTTP', () => {
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
                method: 'POST',
                url: 'http://api.dev.pyypl.io' + '/pay/payment/order/' + paymentOrderId,
                failOnStatusCode: false
            }).then((getResponse) => {

                // Verify that the response is unauthorized
                expect(getResponse.status).to.eq(403)


            })
        
        })
    })

})