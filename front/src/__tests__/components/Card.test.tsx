import { act, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Card from "../../components/Card";
import { Recipe } from "../../types";
import pizzaRecipes from "../../dummies";

const mockRecipe: Recipe = {
	label: "Margherita Pizza",
	image: "https://www.edamam.com/web-img/262/262b4353ca25074178ead2a07cdf7dc1.jpg",
	url: "http://www.marthastewart.com/348894/margherita-pizza",
	calories: 576,
	dietLabels: ["Low-Carb"],
	cuisineType: ["Italian"],
	dishType: ["pizza"],
};

test("should render a card with the recipe information", () => {
	render(<Card recipe={mockRecipe} favoriteRecipes={pizzaRecipes} setFavoriteRecipes={() => {}} />);
	expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
	expect(screen.getByText("Calories: 576.00")).toBeInTheDocument();
	expect(screen.getByText("Diet label: Low-Carb")).toBeInTheDocument();
	expect(screen.getByText("Dish type: pizza")).toBeInTheDocument();
	expect(screen.getByText("Cuisine type: Italian")).toBeInTheDocument();
});

test("should render a favorite button with a red heart if the recipe is already marked as favorite", () => {
	render(<Card recipe={mockRecipe} favoriteRecipes={pizzaRecipes} setFavoriteRecipes={() => {}} />);
	const favoriteIcon = screen.getByTestId("heart-icon");
	expect(favoriteIcon).toHaveAttribute("fill", "red");
});

test("should render a favorite button with a empty heart if the recipe is not marked as favorite", () => {
	const mockFavoriteRecipes = [] as Recipe[];

	render(<Card recipe={mockRecipe} favoriteRecipes={mockFavoriteRecipes} setFavoriteRecipes={() => {}} />);

	const favoriteIcon = screen.getByTestId("heart-icon");
	expect(favoriteIcon).toHaveAttribute("fill", "rgb(37, 37, 37)");
});

test("should call the setFavoriteRecipes callback when the favorite button is clicked", () => {
	const mockSetFavoriteRecipes = vi.fn();

	render(<Card recipe={mockRecipe} favoriteRecipes={pizzaRecipes} setFavoriteRecipes={mockSetFavoriteRecipes} />);

	const favoriteButton = screen.getByRole("button");
	act(() => {
		favoriteButton.click();
	});

	expect(mockSetFavoriteRecipes).toHaveBeenCalledTimes(1);
});
