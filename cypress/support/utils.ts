// cypress/support/utils.ts

// Common redirect URLs
export const successRedirectUrl = "https://www.success.com/";
export const failureRedirectUrl = "https://failedroute.com/";

// Max amount for AED and USD
export const maxAmountAED = 4000;
export const maxAmountUSD = 1000;

// Supported currencies
export const currencies = ["AED", "USD"];

// Set the max character limit
export const maxCharacterLimit = 256;

export const concurrentUser = 5;

export const url = Cypress.config().baseUrl;
export const requestUrl = `${url}/pay/payment/order`;
export const requestPrivateOrderUrl = `${url}/pay/private/payment/order/`;

export const organizationName = "Amazon AE";

export const clientErrorResponse = [400, 401, 403, 404, 413];
export const successfulResponse = [200];
export const serverErrorResponse = [500, 501, 502, 503, 504, 505, 511];

export const UNAUTHORIZED = "UNAUTHORIZED";
export const INVALID_REQUEST = "INVALID_REQUEST";
export const ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND";
export const PAYMENT_NOT_FOUND = "PAYMENT_NOT_FOUND";

export const webRedirectHostUrl =
  "https://d1ff9bm6x6p7ok.cloudfront.net/checkout/";
export const appRedirectHostUrl = "pyypl.dev://paymentOrderConfirm/";

// Generate a random amount value between 1 and 1000
export const generateRandomAmount = (): number => {
  const randomAmountVal = Math.random() * (1000 - 10) + 10;
  return parseInt(randomAmountVal.toFixed(2));
};

// Common headers for API requests
export const getApiHeaders = (): Record<string, string> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": Cypress.env("secret"),
  "Content-type": "application/json",
});

// Common headers for Get All Payment order API requests
export const getEmptyHeadersForAllPayment = (): Record<string, string> => ({
  "x-pyypl-key": "",
  "x-pyypl-secret": "",
});

export const getEmptyKeyHeadersForAllPayment = (): Record<string, string> => ({
  "x-pyypl-key": "",
  "x-pyypl-secret": Cypress.env("secret"),
});

export const getEmptySecretHeadersForAllPayment = (): Record<
  string,
  string
> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": "",
});

export const getInvalidKeyHeadersForAllPayment = (): Record<
  string,
  string
> => ({
  "x-pyypl-key": "InvalidKey",
  "x-pyypl-secret": Cypress.env("secret"),
});

export const getInvalidSecretHeadersForAllPayment = (): Record<
  string,
  string
> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": "InvalidSecret",
});

export const getInvalidKeyAndSecretHeadersForAllPayment = (): Record<
  string,
  string
> => ({
  "x-pyypl-key": "InvalidKey",
  "x-pyypl-secret": "InvalidSecret",
});

export const getApiHeadersForAllPayment = (): Record<string, string> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": Cypress.env("secret"),
});

//  Headers with invalid content type for API requests
export const getInvalidContentTypeHeader = (): Record<string, string> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": Cypress.env("secret"),
  "Content-type": "Invalid",
});

//  Headers with invalid key for API requests
export const getInvalidKeyApiHeader = (): Record<string, string> => ({
  "x-pyypl-key": "awesome key",
  "x-pyypl-secret": Cypress.env("secret"),
  "Content-type": "application/json",
});

//  Headers with invalid secret for API requests
export const getInvalidSecretApiHeader = (): Record<string, string> => ({
  "x-pyypl-key": Cypress.env("key"),
  "x-pyypl-secret": "awesome secret",
  "Content-type": "application/json",
});

//  Headers with both invalid key and secret for API requests
export const getInvalidKeyAndSecretApiHeader = (): Record<string, string> => ({
  "x-pyypl-key": "invalidKey",
  "x-pyypl-secret": "invalidSecret",
  "Content-type": "application/json",
});

//Headers without key
export const getApiHeadersWithoutKey = (): Record<string, string> => ({
  "x-pyypl-secret": Cypress.env("secret"),
  "Content-type": "application/json",
});

//Headers without secret
export const getApiHeadersWithoutSecret = (): Record<string, string> => ({
  "x-pyypl-key": Cypress.env("key"),
  "Content-type": "application/json",
});

//  Headers with empty key and secret for API requests
export const getEmptyKeyAndSecretApiHeader = (): Record<string, string> => ({
  "x-pyypl-key": "",
  "x-pyypl-secret": "",
  "Content-type": "application/json",
});

// Function to generate a UUID
export const generateUUID = (): string => {
  const generateRandomPart = (): string =>
    Cypress._.random(0, 0xffff).toString(16).padStart(4, "0");

  return `${generateRandomPart()}${generateRandomPart()}-${generateRandomPart()}-4${generateRandomPart().substring(
    1
  )}-a${generateRandomPart().substring(
    1
  )}-${generateRandomPart()}${generateRandomPart()}${generateRandomPart()}`;
};

// Function to remove milliseconds and "Z" from a timestamp string
export function convertTimestamp(timestamp: string): string {
  return timestamp.slice(0, -5); // Remove milliseconds and "Z"
}

// Function to subtract minutes from a timestamp
export function subtractMinutes(timestamp: string): string {
  const date = new Date(timestamp);
  date.setSeconds(date.getSeconds() - 5 * 60); // Subtract 5 minutes (300 seconds)
  return date.toISOString().slice(0, -5); // Remove milliseconds and "Z"
}

// Function to generate a request body for retrieving payment order
export const getRequestBodyForRetrievePaymentOrder = (): Record<
  string,
  any
> => ({
  amount: generateRandomAmount(),
  currency: Cypress._.shuffle(currencies)[0],
  description: "Test Payment Order",
  metadata: {
    orderId: "1",
    externalReference: "0001",
  },
  successRedirectUrl,
  failureRedirectUrl,
});

// Function to generate a request body without metadata for retrieving payment order
export const getRequestBodyWithoutMetadataForRetrievePaymentOrder = (): Record<
  string,
  any
> => ({
  amount: generateRandomAmount(),
  currency: Cypress._.shuffle(currencies)[0],
  description: "Test Payment Order",
  successRedirectUrl,
  failureRedirectUrl,
});
