import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Favorites from "../../components/Favorites";
import pizzaRecipes from "../../dummies";

test("should render the component", () => {
	render(<Favorites favoriteRecipes={pizzaRecipes} setFavoriteRecipes={() => {}} />);
	const title = screen.getByText("MY FAVORITES");
	expect(title).toBeInTheDocument();
});

test("should render a list of favorite recipes", () => {
	render(<Favorites favoriteRecipes={pizzaRecipes} setFavoriteRecipes={() => {}} />);
	for (const recipe of pizzaRecipes) {
		expect(screen.getByText(recipe.label)).toBeInTheDocument();
	}
});
