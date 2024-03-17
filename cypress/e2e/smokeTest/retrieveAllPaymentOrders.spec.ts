import * as utils from "../../support/utils";

describe("Get all Payment Order API tests", () => {
  /**
   * Get all Payment Order API Tests
   */

  it("Should fetch all payment order detail", () => {
    // Step 1: Get All Payment Order
    cy.request({
      method: "GET",
      url: `${utils.requestUrl}`,
      headers: utils.getApiHeaders(),
      failOnStatusCode: false,
    }).then((response) => {
      // Verify that the response code is 200
      expect(response.status).to.eq(200);

      // Verify that the response body is an object with a 'data' property
      expect(response.body).to.have.property("data").that.is.an("array").that.is
        .not.empty;

      // Checking the presence of certain attributes in the first payment order
      const firstPaymentOrder = response.body.data[0];
      expect(firstPaymentOrder).to.have.property("paymentOrderId");
      expect(firstPaymentOrder).to.have.property(
        "organizationName",
        utils.organizationName
      );
      expect(firstPaymentOrder).to.have.property("amount");
      expect(firstPaymentOrder).to.have.property("currency");
      expect(firstPaymentOrder).to.have.property("status");
      expect(firstPaymentOrder).to.have.property("description");
      expect(firstPaymentOrder).to.have.property("expiresAt");
      expect(firstPaymentOrder).to.have.property("createdAt");
      expect(firstPaymentOrder).to.have.property("metadata");
    });
  });
});
