import * as utils from "../../support/utils";

describe("Create Payment Order API Validation tests", () => {
  it.only('Handles payment order creation without providing the "description"', () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it("Validates non-string value for description", () => {
    // Load  test data from fixture file
    cy.fixture("nonStringTestData").as("nonStringTestData");
    // Access the  test data
    cy.get("@nonStringTestData").then((data: any) => {
      // Iterate through each data and make a POST request.
      data.nonStringTestData.forEach((description) => {
        // Step 1: Make a POST request to create a payment order providing non string in the "description"
        cy.request({
          method: "POST",
          url: utils.requestUrl,
          failOnStatusCode: false,
          headers: utils.getApiHeaders(), // Include headers with valid secret and key
          body: {
            amount: utils.generateRandomAmount(),
            currency: Cypress._.shuffle(utils.currencies)[0],
            description: description,
            metadata: {
              orderId: "122",
              externalReference: "1234",
            },
            successRedirectUrl: utils.successRedirectUrl,
            failureRedirectUrl: utils.failureRedirectUrl,
          },
        }).then((response) => {
          // Verify that the request fails due to non string values
          expect(response.status).to.eq(400);

          expect(response.body).have.property(
            "errorMessage",
            "INVALID_REQUEST"
          );
          expect(response.body.errorDetails).to.include("description is wrong");
        });
      });
    });
  });

  it("Validates non-string value for metadata OrderId", () => {
    // Load  test data from fixture file
    cy.fixture("nonStringTestData").as("nonStringTestData");
    // Access the  test data
    cy.get("@nonStringTestData").then((data: any) => {
      // Iterate through each data and make a POST request.
      data.nonStringTestData.forEach((orderId) => {
        // Step 1: Make a POST request to create a payment order with non string metadata order id
        cy.request({
          method: "POST",
          url: utils.requestUrl,
          failOnStatusCode: false,
          headers: utils.getApiHeaders(), // Include headers with valid secret and key
          body: {
            amount: utils.generateRandomAmount(),
            currency: Cypress._.shuffle(utils.currencies)[0],
            description: "Non string tests",
            metadata: {
              orderId: orderId,
              externalReference: "1234",
            },
            successRedirectUrl: utils.successRedirectUrl,
            failureRedirectUrl: utils.failureRedirectUrl,
          },
        }).then((response) => {
          // Verify that the request fails due to non string values
          expect(response.status).to.eq(400);

          expect(response.body).have.property(
            "errorMessage",
            "INVALID_REQUEST"
          );
          expect(response.body.errorDetails).to.include("metadata is wrong");
        });
      });
    });
  });

  it("Validates non-string value for metadata externalReference", () => {
    // Load  test data from fixture file
    cy.fixture("nonStringTestData").as("nonStringTestData");
    // Access the  test data
    cy.get("@nonStringTestData").then((data: any) => {
      // Iterate through each data and make a POST request.
      data.nonStringTestData.forEach((externalReference) => {
        // Step 1: Make a POST request to create a payment order with non string externalReference
        cy.request({
          method: "POST",
          url: utils.requestUrl,
          failOnStatusCode: false,
          headers: utils.getApiHeaders(), // Include headers with valid secret and key
          body: {
            amount: utils.generateRandomAmount(),
            currency: Cypress._.shuffle(utils.currencies)[0],
            description: "Non string tests",
            metadata: {
              orderId: "123",
              externalReference: externalReference,
            },
            successRedirectUrl: utils.successRedirectUrl,
            failureRedirectUrl: utils.failureRedirectUrl,
          },
        }).then((response) => {
          // Verify that the request fails due to non string values
          expect(response.status).to.eq(400);

          expect(response.body).have.property(
            "errorMessage",
            "INVALID_REQUEST"
          );
          expect(response.body.errorDetails).to.include("metadata is wrong");
        });
      });
    });
  });

  it("Validates Maximum Character Limit for Description Field (<= 256 characters)", () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "A".repeat(utils.maxCharacterLimit),
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it("Validates Maximum Character Limit for metadata Order ID  (<= 256 characters)", () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Description",
        metadata: {
          orderId: "A".repeat(utils.maxCharacterLimit),
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it("Validates Maximum Character Limit for metadata externalReference (<= 256 characters)", () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Api",
        metadata: {
          orderId: "1",
          externalReference: "A".repeat(utils.maxCharacterLimit),
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it('Validates max character (greater than 256 character) limit for description"', () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "A".repeat(utils.maxCharacterLimit + 1),
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request fails due to exceeding max character limi
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include("description is wrong");
    });
  });

  it('Validates max character (greater than 256 character) limit for metadata orderId"', () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Description",
        metadata: {
          orderId: "A".repeat(utils.maxCharacterLimit + 1),
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request fails due to exceeding max character limi
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include("metadata is wrong");
    });
  });

  it('Validates max character (greater than 256 character) limit for metadata externalReference"', () => {
    // Step 1: Make a POST request to create a payment order without providing the "description"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: utils.generateRandomAmount(),
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test API",
        metadata: {
          orderId: "1",
          externalReference: "A".repeat(utils.maxCharacterLimit + 1),
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify that the request fails due to exceeding max character limi
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include("metadata is wrong");
    });
  });

  it('Handles payment order creation with empty "metadata"', () => {
    // Step 1: Make a POST request to create a payment order with empty "metadata"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {},
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it('Handles payment order creation with missing "orderId" in metadata', () => {
    // Step 1: Make a POST request to create a payment order with missing "orderId" in metadata
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it('Handles payment order creation with missing "externalReference" in metadata', () => {
    // Step 1: Make a POST request to create a payment order with missing "externalReference" in metadata
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "124",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it("Handles currency validation: 200 for valid currencies, 400 for invalid currencies", () => {
    // Array of currencies to be tested
    const currencies = ["AED", "USD", "NRS", "EUR", "GRB", "AUD", "SGD"];

    // Iterate through each currency in the array
    cy.wrap(currencies).each((currency) => {
      cy.request({
        method: "POST",
        url: utils.requestUrl,
        headers: utils.getApiHeaders(),
        body: {
          amount: utils.generateRandomAmount(),
          currency: `${currency}`,
          description: "Test Payment Order",
          metadata: {
            orderId: "1",
            externalReference: "0001",
          },
          successRedirectUrl: utils.successRedirectUrl,
          failureRedirectUrl: utils.failureRedirectUrl,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Check if the currency is valid (AED or USD)
        if (!(currency.toString() === "AED" || currency.toString() === "USD")) {
          // For invalid currencies, expect 400 and specific error details
          expect(response.status).to.eq(400);
          expect(response.body).have.property(
            "errorMessage",
            "INVALID_REQUEST"
          );
          expect(response.body.errorDetails).to.include(
            "invalid request: currency is wrong"
          );
          cy.log("Invalid Currency");
        } else {
          // For valid currencies, expect 200 and verify essential properties
          expect(response.status).to.eq(200);
          const paymentOrderId = response.body.paymentOrderId;
          const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
          const encodeFailureUrl = encodeURIComponent(utils.failureRedirectUrl);

          // Ensure the response body contains essential properties
          expect(response.body).have.property("paymentOrderId", paymentOrderId);
          expect(response.body).have.property("status", "PENDING");
        }
      });
    });
  });

  it('Handles payment order creation with missing "failureRedirectUrl"', () => {
    // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(utils.successRedirectUrl);
      const encodeFailuerUrl = encodeURIComponent(utils.failureRedirectUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it("Handles payment order creation with successRedirectUrl and failureRedirectUrl having different valid URL formats", () => {
    const successUrl = "https://www.success.new.co/";
    const failureUrl = "https://failedroute.new.co/";
    // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(), // Include headers with valid secret and key
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: successUrl,
        failureRedirectUrl: failureUrl,
      },
    }).then((response) => {
      // Verify the success of the create request
      expect(response.status).to.eq(200);

      const paymentOrderId = response.body.paymentOrderId;
      const encodeSuccessUrl = encodeURIComponent(successUrl);
      const encodeFailuerUrl = encodeURIComponent(failureUrl);

      // Ensure the response body contains essential properties
      expect(response.body).have.property("paymentOrderId", paymentOrderId);
      expect(response.body).have.property("status", "PENDING");
    });
  });

  it.skip("Handles payment order creation with successRedirectUrl and failureRedirectUrl having  invalid URL formats", () => {
    // Load URL test data from fixture file
    cy.fixture("urls").as("urls");

    // Access the url test data
    cy.get("@urls").then((data: any) => {
      data.invalidSuccessUrls.forEach((invalidSuccessUrl) => {
        data.invalidFailedUrls.forEach((invalidFailedUrl) => {
          // Step 1: Make a POST request to create a payment order with missing "failureRedirectUrl"
          cy.request({
            method: "POST",
            url: utils.requestUrl,
            failOnStatusCode: false,
            headers: utils.getApiHeaders(), // Include headers with valid secret and key
            body: {
              amount: 10,
              currency: Cypress._.shuffle(utils.currencies)[0],
              description: "Test Payment Order",
              metadata: {
                orderId: "1",
                externalReference: "0001",
              },
              successRedirectUrl: invalidSuccessUrl,
              failureRedirectUrl: invalidFailedUrl,
            },
          }).then((response) => {
            // Verify that the request returns a status code of 400 (Bad Request)
            expect(response.status).to.eq(400);

            cy.log(` InvalidSuccessUrl: ${invalidSuccessUrl}`);
            cy.log(` InvalidFailedUrl: ${invalidFailedUrl}`);
            // For invalid urls, expect error message
            expect(response.body).have.property(
              "errorMessage",
              "INVALID_REQUEST"
            );
            cy.log(
              `Test passed for successRedirectUrl : ${invalidSuccessUrl} failureRedirectUrl:  ${invalidFailedUrl}`
            );
          });
        });
      });
    });
  });

  it("Handles Invalid API endpoint", () => {
    // Step 1: Make POST request to a deliberately incorrect API endpoint
    cy.request({
      method: "POST",
      url: Cypress.config().baseUrl + "/pay/payment/orders", // Incorrect endpoint intentionally
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request returns a status code of 404 (Not Found)
      expect(response.status).to.eq(404);

      // Ensure the response body contains essential properties with expected values
      expect(response.body.error).equal("ROUTE_NOT_FOUND");
    });
  });

  it("Handles Invalid request over HTTP", () => {
    // Step 1: Make POST request to a deliberately incorrect API endpoint
    cy.request({
      method: "POST",
      url: "http://api.dev.pyypl.io" + "/pay/payment/order/", // Incorrect url intentionally
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the response is 403
      expect(response.status).to.eq(403);
    });
  });

  it("Handles Invalid method", () => {
    // Step 1: Make POST request to a deliberately incorrect API endpoint
    cy.request({
      method: "PUT", // Incorrect method intentionally
      url: Cypress.config().baseUrl + "/pay/payment/order",
      headers: utils.getApiHeaders(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the request returns a status code of 404 (Not Found)
      expect(response.status).to.eq(404);

      // Ensure the response body contains essential properties with expected values
      expect(response.body.error).equal("ROUTE_NOT_FOUND");
    });
  });

  it("Handles invalid content type in the request header", () => {
    // Step 1: Make POST request to create a payment order
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getInvalidContentTypeHeader(),
      body: utils.getRequestBodyForRetrievePaymentOrder(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify the response status and error message
      expect(response.status).to.eq(400);
      expect(response.body.errorMessage).equal("INVALID_REQUEST");
    });
  });

  it("Handles invalid amount scenarios", () => {
    // Load  test data from fixture file
    cy.fixture("invalidAmount").as("invalidAmount");
    // Access the  test data
    cy.get("@invalidAmount").then((data: any) => {
      // Iterate through each data and make a POST request.
      data.invalidAmount.forEach((invalidAmount) => {
        cy.log(`Starting Test  for amount: ${invalidAmount}`);
        // Make POST request to create a payment order with invalid amount
        cy.request({
          method: "POST",
          url: utils.requestUrl,
          failOnStatusCode: false,
          headers: utils.getApiHeaders(),
          body: {
            amount: invalidAmount,
            currency: Cypress._.shuffle(utils.currencies)[0],
            description: "Test Payment Order",
            metadata: {
              orderId: "1",
              externalReference: "0001",
            },
            successRedirectUrl: utils.successRedirectUrl,
            failureRedirectUrl: utils.failureRedirectUrl,
          },
        }).then((response) => {
          // Verify the response status and error details
          expect(response.status).to.eq(400);
          expect(response.body).have.property(
            "errorMessage",
            "INVALID_REQUEST"
          );
          expect(response.body.errorDetails).to.include(
            "invalid request: amount is wrong"
          );

          cy.log(`Test passed for amount: ${invalidAmount}`);
        });
      });
    });
  });

  it("Handles invalid currency code scenarios", () => {
    // Make POST request to create a payment order with an invalid currency code
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(),
      body: {
        amount: utils.generateRandomAmount(),
        currency: "INVALID",
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the response status and error details
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: currency is wrong"
      );
    });
  });

  it("Handles invalid success redirect URL scenario", () => {
    // Make POST request to create a payment order with an invalid success redirect URL
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(),
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: "invalidUrl",
        failureRedirectUrl: utils.failureRedirectUrl,
      },
    }).then((response) => {
      // Verify the response status and error details
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: successRedirectUrl is wrong"
      );
    });
  });

  it("Handles invalid failure redirect URL scenario", () => {
    // Make POST request to create a payment order with an invalid failure redirect URL
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      failOnStatusCode: false,
      headers: utils.getApiHeaders(),
      body: {
        amount: 10,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: "invalidUrl",
      },
    }).then((response) => {
      // Verify the response status and error details
      expect(response.status).to.eq(400);
      expect(response.body).have.property("errorMessage", "INVALID_REQUEST");
      expect(response.body.errorDetails).to.include(
        "invalid request: failureRedirectUrl is wrong"
      );
    });
  });

  // Extreme Value Tests

  it("Handles extreme value for amount scenario", () => {
    // Make POST request to create a payment order with an amount exceeding MAX_SAFE_INTEGER
    cy.request({
      method: "POST",
      url: utils.requestUrl,
      headers: utils.getApiHeaders(),
      body: {
        amount: Number.MAX_SAFE_INTEGER + 1,
        currency: Cypress._.shuffle(utils.currencies)[0],
        description: "Test Payment Order",
        metadata: {
          orderId: "1",
          externalReference: "0001",
        },
        successRedirectUrl: utils.successRedirectUrl,
        failureRedirectUrl: utils.failureRedirectUrl,
      },
      failOnStatusCode: false,
    }).then((response) => {
      //Validate expected response and log response body
      expect(response.status).to.eq(500);
      cy.log(`Request Body: ${JSON.stringify(response.body)}`);
      cy.log(`Response Status: ${response.status}`);
    });
  });
});
