const utils = require('../../support/utils')

describe('Payment Order Creation API tests', () => {
    /**
     * Positive Test Cases ---
     */

    it('Successfully creates a payment order with valid request with all  parameters', () => {
        // Step 1: Make a POST request to create a payment order with valid parameters
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
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
            
                // Verify that the create request was successful
                expect(response.status).to.eq(200)
                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

           
        })
    })

    it('Successfully creates a payment order with valid request with only required parameters - Amount and Currency', () => {
        // Step 1: Make a POST request to create a payment order with required parameters
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0]
            }
        }).then((response) => {
            
                // Verify that the create request was successful
                expect(response.status).to.eq(200)
                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}`)
                // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}`)
            
        })
    })

    it('Handles payment order creation for min amount less than 10, value between min and max and max value greater 4000 AED/1000 USD', () => {
        //  test scenarios
        const scenarios = [
            { currency: 'AED', amount: 10.01, expectedStatus: 200 },
            { currency: 'AED', amount: 1999, expectedStatus: 200 },
            { currency: 'AED', amount: 3999.99, expectedStatus: 200 },
            { currency: 'USD', amount: 10.01, expectedStatus: 200 },
            { currency: 'USD', amount: 999.99, expectedStatus: 200 },
            { currency: 'USD', amount: 599, expectedStatus: 200 },
            { currency: 'AED', amount: 9.99, expectedStatus: 400 },
            { currency: 'AED', amount: 4000.01, expectedStatus: 400 },
            { currency: 'USD', amount: 1000.01, expectedStatus: 400 },
            { currency: 'USD', amount: 9.99, expectedStatus: 400 },
        ]

        // Iterate through scenarios and perform the tests
        scenarios.forEach((scenario) => {
            // Make a POST request to create a payment order 
            cy.request({
                method: 'POST',
                url: utils.requestUrl,
                headers: utils.getApiHeaders(),
                body: {
                    amount: scenario.amount,
                    currency: scenario.currency,
                    description: 'Create Order tests',
                    metadata: {
                        orderId: '114',
                        externalReference: '1234'
                    },
                    successRedirectUrl: utils.successRedirectUrl,
                    failureRedirectUrl: utils.failureRedirectUrl
                },
                failOnStatusCode: false
            }).then((response) => {
                
                    if (response.status == 200) {
                        expect(response.status).to.eq(scenario.expectedStatus)
                        cy.log(` Test Data: ${scenario}`)
                        const paymentOrderId = response.body.paymentOrderId
                        const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                        const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                        // Ensure the response body contains essential properties and information
                        expect(response.body).have.property('paymentOrderId', paymentOrderId)
                        expect(response.body).have.property('status', 'PENDING')
                        expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
                        // expect(response.body).have.property('webRedirectUrl', `http://localhost:8000?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)

                    } else {
                        cy.log(` Test Data: ${scenario}`)
                        expect(response.status).to.eq(scenario.expectedStatus)
                        expect(response.status).to.not.eq(200)
                    }

            })
        })
    })

    it('Handles payment order creation with missing amount parameter', () => {
        // Step 1: Make a POST request to create a payment order without providing the amount
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
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
            
                // Verify that the request returns a status code of 400 (Bad Request)
                expect(response.status).to.eq(400)

                // Ensure the response body contains essential properties with expected values
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('invalid request: amount is wrong')
            
        })
    })

    it('Handles scenario where a negative amount is provided during payment order creation', () => {
        // Step 1: Make a POST request to create a payment order with a negative amount
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: -10.01,
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
            
                // Verify that the request returns a status code of 400 (Bad Request)
                expect(response.status).to.eq(400)

                // Ensure the response body contains essential properties with expected values
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('invalid request: amount is wrong')
            
        })
    })

    it('Handles payment order creation with missing currency parameter', () => {
        // Step 1: Make a POST request to create a payment order without providing the currency
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify that the request returns a status code of 400 (Bad Request)
                expect(response.status).to.eq(400)

                // Ensure the response body contains essential properties with expected values
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('invalid request: currency is wrong')
            
        })
    })

    it('Handles payment order creation with missing amount and currency parameters', () => {
        // Step 1: Make a POST request to create a payment order without providing amount and currency
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify that the request returns a status code of 400 (Bad Request)
                expect(response.status).to.eq(400)

                // Ensure the response body contains essential properties with expected values
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('invalid request: amount is wrong')
            
        })
    })

    it('Handles payment order creation without providing the "description"', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            
        })
    })

    //

    it('Validates non-string value for description', () => {
        // Load  test data from fixture file
        cy.fixture('nonStringTestData').as('nonStringTestData')
        // Access the  test data 
        cy.get('@nonStringTestData').then((data) => {
            // Iterate through each data and make a POST request.
            data.nonStringTestData.forEach((description) => {
                // Step 1: Make a POST request to create a payment order providing non string in the "description"
                cy.request({
                    method: 'POST',
                    url: utils.requestUrl,
                    failOnStatusCode: false,
                    headers: utils.getApiHeaders(), // Include headers with valid secret and key
                    body: {
                        amount: utils.generateRandomAmount(),
                        currency: Cypress._.shuffle(utils.currencies)[0],
                        description: description,
                        metadata: {
                            orderId: '122',
                            externalReference: '1234'
                        },
                        successRedirectUrl: utils.successRedirectUrl,
                        failureRedirectUrl: utils.failureRedirectUrl
                    }
                }).then((response) => {
                    
                        // Verify that the request fails due to non string values
                        expect(response.status).to.eq(400)

                        expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                        expect(response.body.errorDetails).to.include('description is wrong')
                    
                })
            })
        })
    })

    it('Validates non-string value for metadata OrderId', () => {
        // Load  test data from fixture file
        cy.fixture('nonStringTestData').as('nonStringTestData')
        // Access the  test data 
        cy.get('@nonStringTestData').then((data) => {
            // Iterate through each data and make a POST request.
            data.nonStringTestData.forEach((orderId) => {
                // Step 1: Make a POST request to create a payment order with non string metadata order id
                cy.request({
                    method: 'POST',
                    url: utils.requestUrl,
                    failOnStatusCode: false,
                    headers: utils.getApiHeaders(), // Include headers with valid secret and key
                    body: {
                        amount: utils.generateRandomAmount(),
                        currency: Cypress._.shuffle(utils.currencies)[0],
                        description: 'Non string tests',
                        metadata: {
                            orderId: orderId,
                            externalReference: '1234'
                        },
                        successRedirectUrl: utils.successRedirectUrl,
                        failureRedirectUrl: utils.failureRedirectUrl
                    }
                }).then((response) => {
                    
                        // Verify that the request fails due to non string values
                        expect(response.status).to.eq(400)

                        expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                        expect(response.body.errorDetails).to.include('metadata is wrong')
                    
                })
            })
        })
    })

    it('Validates non-string value for metadata externalReference', () => {
        // Load  test data from fixture file
        cy.fixture('nonStringTestData').as('nonStringTestData')
        // Access the  test data 
        cy.get('@nonStringTestData').then((data) => {
            // Iterate through each data and make a POST request.
            data.nonStringTestData.forEach((externalReference) => {
                // Step 1: Make a POST request to create a payment order with non string externalReference
                cy.request({
                    method: 'POST',
                    url: utils.requestUrl,
                    failOnStatusCode: false,
                    headers: utils.getApiHeaders(), // Include headers with valid secret and key
                    body: {
                        amount: utils.generateRandomAmount(),
                        currency: Cypress._.shuffle(utils.currencies)[0],
                        description: 'Non string tests',
                        metadata: {
                            orderId: '123',
                            externalReference: externalReference
                        },
                        successRedirectUrl: utils.successRedirectUrl,
                        failureRedirectUrl: utils.failureRedirectUrl
                    }
                }).then((response) => {
                    
                        // Verify that the request fails due to non string values
                        expect(response.status).to.eq(400)

                        expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                        expect(response.body.errorDetails).to.include('metadata is wrong')
                    
                })
            })
        })
    })

    it('Validates Maximum Character Limit for Description Field (<= 256 characters)', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'A'.repeat(utils.maxCharacterLimit),
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            

        })
    })

    it('Validates Maximum Character Limit for metadata Order ID  (<= 256 characters)', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'Test Description',
                metadata: {
                    orderId: 'A'.repeat(utils.maxCharacterLimit),
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            
        })
    })

    it('Validates Maximum Character Limit for metadata externalReference (<= 256 characters)', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'Test Api',
                metadata: {
                    orderId: "1",
                    externalReference: 'A'.repeat(utils.maxCharacterLimit)
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
          
        })
    })

    it('Validates max character (greater than 256 character) limit for description"', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'A'.repeat(utils.maxCharacterLimit + 1),
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify that the request fails due to exceeding max character limi
                expect(response.status).to.eq(400)
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('description is wrong')
            

        })
    })

    it('Validates max character (greater than 256 character) limit for metadata orderId"', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'Test Description',
                metadata: {
                    orderId: 'A'.repeat(utils.maxCharacterLimit + 1),
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify that the request fails due to exceeding max character limi
                expect(response.status).to.eq(400)
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('metadata is wrong')
            
        })
    })

    it('Validates max character (greater than 256 character) limit for metadata externalReference"', () => {
        // Step 1: Make a POST request to create a payment order without providing the "description"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: utils.generateRandomAmount(),
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: 'Test API',
                metadata: {
                    orderId: "1",
                    externalReference: 'A'.repeat(utils.maxCharacterLimit + 1)
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify that the request fails due to exceeding max character limi
                expect(response.status).to.eq(400)
                expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                expect(response.body.errorDetails).to.include('metadata is wrong')
            
        })
    })

    it('Handles payment order creation with empty "metadata"', () => {
        // Step 1: Make a POST request to create a payment order with empty "metadata"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {},
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            
        })
    })

    it('Handles payment order creation with missing "orderId" in metadata', () => {
        // Step 1: Make a POST request to create a payment order with missing "orderId" in metadata
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
          
        })
    })

    it('Handles payment order creation with missing "externalReference" in metadata', () => {
        // Step 1: Make a POST request to create a payment order with missing "externalReference" in metadata
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "124"
                },
                successRedirectUrl: utils.successRedirectUrl,
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            
        })
    })

    it('Handles payment order creation with missing "successRedirectUrl"', () => {
        // Step 1: Make a POST request to create a payment order with missing "successRedirectUrl"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                failureRedirectUrl: utils.failureRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)
                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&failureRedirectUrl=${encodeFailuerUrl}`)
          
        })
    })

    it('Handles payment order creation with missing "failureRedirectUrl"', () => {
        // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: utils.successRedirectUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl)
                const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}`)
            
        })
    })

    it('Handles payment order creation with successRedirectUrl and failureRedirectUrl having different valid URL formats', () => {
        const successUrl = "https://www.success.new.co/"
        const failureUrl = "https://failedroute.new.co/"
        // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
        cy.request({
            method: 'POST',
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
                amount: 10,
                currency: Cypress._.shuffle(utils.currencies)[0],
                description: "Test Payment Order",
                metadata: {
                    orderId: "1",
                    externalReference: "0001"
                },
                successRedirectUrl: successUrl,
                failureRedirectUrl: failureUrl
            }
        }).then((response) => {
            
                // Verify the success of the create request
                expect(response.status).to.eq(200)

                const paymentOrderId = response.body.paymentOrderId
                const encodeSuccessUrl = encodeURIComponent(successUrl)
                const encodeFailuerUrl = encodeURIComponent(failureUrl)

                // Ensure the response body contains essential properties
                expect(response.body).have.property('paymentOrderId', paymentOrderId)
                expect(response.body).have.property('status', 'PENDING')
                expect(response.body).have.property('webRedirectUrl', `${Cypress.config().baseUrl}?paymentOrderId=${paymentOrderId}&successRedirectUrl=${encodeSuccessUrl}&failureRedirectUrl=${encodeFailuerUrl}`)
            
        })
    })

    it.skip('Handles payment order creation with successRedirectUrl and failureRedirectUrl having  invalid URL formats', () => {
        // Load URL test data from fixture file
        cy.fixture('urls').as('urls')

        // Access the url test data 
        cy.get('@urls').then((data) => {
            data.invalidSuccessUrls.forEach((invalidSuccessUrl) => {
                data.invalidFailedUrls.forEach((invalidFailedUrl) => {

                    // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
                    cy.request({
                        method: 'POST',
                        url: utils.requestUrl,
                        failOnStatusCode: false,
                        headers: utils.getApiHeaders(), // Include headers with valid secret and key
                        body: {
                            amount: 10,
                            currency: Cypress._.shuffle(utils.currencies)[0],
                            description: "Test Payment Order",
                            metadata: {
                                orderId: "1",
                                externalReference: "0001"
                            },
                            successRedirectUrl: invalidSuccessUrl,
                            failureRedirectUrl: invalidFailedUrl
                        }
                    }).then((response) => {
                            // Verify that the request returns a status code of 400 (Bad Request)
                            expect(response.status).to.eq(400)

                            cy.log(` InvalidSuccessUrl: ${invalidSuccessUrl}`)
                            cy.log(` InvalidFailedUrl: ${invalidFailedUrl}`)
                            // For invalid urls, expect error message 
                            expect(response.body).have.property('errorMessage', 'INVALID_REQUEST')
                            cy.log(`Test passed for successRedirectUrl : ${invalidSuccessUrl} failureRedirectUrl:  ${invalidFailedUrl}`)
                    })
                })
            })
        })
    })
})