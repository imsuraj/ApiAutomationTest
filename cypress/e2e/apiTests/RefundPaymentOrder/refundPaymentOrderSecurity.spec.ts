import * as utils from '../../../support/utils';

describe.skip('Refund payment order API security tests', () => {
  //4

  it('Verify that sensitive information (API key and secret) is not exposed in error responses.', () => {});

  it('Attempt to refund using SQL injection in the payment reference.', () => {});

  it('Verify that the API supports only secure communication (HTTPS).', () => {});

  it('Attempt to refund with a maliciously crafted payment reference', () => {});
});
