/// <reference types="Cypress"/>

describe("Vivant Task", function () {
  it("Task", function () {
    //- Navigate to VIVANT platform (https://vivant.eco).
    cy.visit(Cypress.env("vivant"));
    //- Select France from the Select country dropdown.
    cy.contains("Select country").type("France{enter}");
    //- Enter 12345 ZIP code.
    cy.get("#postal_code").type("12345");
    //- Save the changes.
    cy.contains("Save").click();
    cy.get('[tabindex="0"]', { timeout: 30000 }).should("not.be.visible");
    //- Navigate to WINES page.
    cy.get(".Header_nav__2eril").contains("Wines").click({ force: true });
    cy.url().should("include", "/wines");
    //- Verify all wine cards contain price in euros and prices are not 0.
    cy.url().should("include", "/wines");
    cy.server();
    cy.route("GET", "api/en/wines?page**").as("total");
    loadMoreProducts();
    function loadMoreProducts() {
      cy.wait(1000);
      cy.get("body").then((body) => {
        if (body.find(".Button_dark_secondary__2W-PS").length > 0) {
          body.find(".Button_dark_secondary__2W-PS").click();
          cy.wait("@total").its('status').should('eq', 200);
          loadMoreProducts();
        }
      });
    }

    cy.get(".WineCard_content__3zIi1")
      .find(".WineCard_price__195D6")
      .each((element) => {
        const product = element.text();
        const productEuro = String(product.slice(-1));
        const productPrice = Number(product.slice(0, -1));
        expect(productEuro).to.equal(String("€"));
        expect(productPrice).to.not.equal(Number("0"));
      });
    //- Add one of the wines to bag.
    cy.contains(
      "Champagne André Heucq Coteaux Champenois Vieilles Vignes 2016"
    ).click();
    cy.contains("Add to Bag").click();
    //- Verify that wine added in the step above is displayed in the bag.
    cy.get(".Panel_body__CsFvL").should(
      "contain.text",
      "Champagne André Heucq Coteaux Champenois Vieilles Vignes 2016"
    );
  });
});
