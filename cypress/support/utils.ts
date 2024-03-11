// cypress/support/utils.js

// Generate a random amount value between 1 and 1000
const generateRandomAmount = () => {
  const randomAmountVal = Math.random() * (1000 - 10) + 10;
  return parseFloat(randomAmountVal.toFixed(2));
};

// Common headers for API requests
const getApiHeaders = () => {
  return {
    "x-pyypl-key": Cypress.env("key"),
    "x-pyypl-secret": Cypress.env("secret"),
    "Content-type": "application/json",
  };
};

//  Headers with invalid content type for API requests
const getInvalidContentTypeHeader = () => {
  return {
    "x-pyypl-key": Cypress.env("key"),
    "x-pyypl-secret": Cypress.env("secret"),
    "Content-type": "Invalid",
  };
};

//  Headers with invalid key for API requests
const getInvalidKeyApiHeader = () => {
  return {
    "x-pyypl-key": "awesome key",
    "x-pyypl-secret": Cypress.env("secret"),
    "Content-type": "application/json",
  };
};

//  Headers with invalid secret for API requests
const getInvalidSecretApiHeader = () => {
  return {
    "x-pyypl-key": Cypress.env("key"),
    "x-pyypl-secret": "awesome secret",
    "Content-type": "application/json",
  };
};

//  Headers with both invalid key and secret for API requests
const getInvalidKeyAndSecretApiHeader = () => {
  return {
    "x-pyypl-key": "invalidKey",
    "x-pyypl-secret": "invalidSecret",
    "Content-type": "application/json",
  };
};

//  Headers with empty key and secret for API requests
const getEmptyKeyAndSecretApiHeader = () => {
  return {
    "x-pyypl-key": "",
    "x-pyypl-secret": "",
    "Content-type": "application/json",
  };
};

const generateUUID = () => {
  // Function to generate a random part of the UUID
  const generateRandomPart = () =>
    Cypress._.random(0, 0xffff).toString(16).padStart(4, "0");

  // Create the UUID format
  const uuid = `${generateRandomPart()}${generateRandomPart()}-${generateRandomPart()}-4${generateRandomPart().substring(
    1
  )}-a${generateRandomPart().substring(
    1
  )}-${generateRandomPart()}${generateRandomPart()}${generateRandomPart()}`;

  return uuid;
};

const getRequestBodyForRetrievePaymentOrder = () => {
  return {
    amount: generateRandomAmount(),
    currency: Cypress._.shuffle(currencies)[0],
    description: "Test Payment Order",
    metadata: {
      orderId: "1",
      externalReference: "0001",
    },
    successRedirectUrl: successRedirectUrl,
    failureRedirectUrl: failureRedirectUrl,
  };
};

// Common redirect URLs
const successRedirectUrl = "https://www.success.com/";
const failureRedirectUrl = "https://failedroute.com/";

// Max amount for AED and USD
const maxAmountAED = 4000;
const maxAmountUSD = 1000;

// Supported currencies
const currencies = ["AED", "USD"];

// Set the max character limit
const maxCharacterLimit = 256;

const concurrentUser = 5;

const requestUrl = Cypress.config().baseUrl + "/pay/payment/order";

const organizationName = "Amazon AE";

const clientErrorResponse = [400, 401, 403, 404, 413];
const successfulResponse = [200];
const serverErrorResponse = [500, 501, 502, 503, 504, 505, 511];

export {
  generateRandomAmount,
  getApiHeaders,
  getInvalidContentTypeHeader,
  getInvalidKeyApiHeader,
  getInvalidSecretApiHeader,
  getInvalidKeyAndSecretApiHeader,
  getEmptyKeyAndSecretApiHeader,
  generateUUID,
  getRequestBodyForRetrievePaymentOrder as getRequestBodyForRetrievePaymentOrder,
  successRedirectUrl,
  failureRedirectUrl,
  currencies,
  maxAmountAED,
  maxAmountUSD,
  maxCharacterLimit,
  concurrentUser,
  requestUrl,
  organizationName,
  clientErrorResponse,
  successfulResponse,
  serverErrorResponse,
};
