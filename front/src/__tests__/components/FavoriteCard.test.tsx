import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import FavoriteCard from "../../components/FavoriteCard";
import pizzaRecipes from "../../dummies";
import { act } from "react-dom/test-utils";

const recipe = {
	label: "Margherita Pizza",
	image: "https://www.edamam.com/web-img/262/262b4353ca25074178ead2a07cdf7dc1.jpg",
	url: "http://www.marthastewart.com/348894/margherita-pizza",
	calories: 576,
	dietLabels: ["Low-Carb"],
	cuisineType: ["Italian"],
	dishType: ["pizza"],
};

test("should render the recipe's image, title, and a favorite button", () => {
	render(<FavoriteCard recipe={recipe} favoriteRecipes={pizzaRecipes} setFavoriteRecipes={() => {}} />);

	expect(screen.getByRole("img")).toHaveAttribute(
		"src",
		"https://www.edamam.com/web-img/262/262b4353ca25074178ead2a07cdf7dc1.jpg"
	);
	expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
	expect(screen.getByRole("button")).toBeInTheDocument();
});

test("should be able to add a recipe to the favorites list", async () => {
	const mockSetFavoriteRecipes = vi.fn();

	render(<FavoriteCard recipe={recipe} favoriteRecipes={[]} setFavoriteRecipes={mockSetFavoriteRecipes} />);

	const favoriteButton = screen.getByRole("button");

	act(() => {
		fireEvent.click(favoriteButton);
	});

	await waitFor(() => {
		expect(mockSetFavoriteRecipes).toHaveBeenCalledWith([recipe]);
	});
});

test("should be able to remove a recipe from the favorites list", async () => {
	const mockSetFavoriteRecipes = vi.fn();

	render(<FavoriteCard recipe={recipe} favoriteRecipes={[recipe]} setFavoriteRecipes={mockSetFavoriteRecipes} />);

	const favoriteButton = screen.getByRole("button");

	act(() => {
		fireEvent.click(favoriteButton);
	});

	await waitFor(() => {
		expect(mockSetFavoriteRecipes).toHaveBeenCalledWith([]);
	});
});
