describe("Home page", () => {
	it("render the front page", () => {
		cy.visit("http://localhost:5173/");

		cy.get('[data-testid="cypress-title"]').should("exist").should("contain", "Recipe App");
	});

	it("render the the recipe card", () => {
		cy.visit("http://localhost:5173/");

		cy.get('input[type="text"]').click().type("pizza").type("{enter}");
		cy.get('[class="item"]').should("have.length.greaterThan", 0);
	});

	it("adds a recipe to favorites", () => {
		cy.visit("http://localhost:5173/");

		cy.get('input[type="text"]').click().type("pizza").type("{enter}");
		cy.get('[class="card-favorate-button"]').first().click();
		cy.get('[class="favorite-box"]').first().click();

		cy.get('[class="fc-container"]').should("have.length.greaterThan", 0);
	});

	it("removes a recipe to favorites", () => {
		cy.visit("http://localhost:5173/");

		cy.get('input[type="text"]').click().type("pizza").type("{enter}");
		cy.get('[class="card-favorate-button"]').first().click();
		cy.get('[class="favorite-box"]').first().click();

		cy.get(".favorites-container .card-favorate-button").first().click();
		cy.get('[class="fc-container"]').should("have.length", 0);
	});
});
