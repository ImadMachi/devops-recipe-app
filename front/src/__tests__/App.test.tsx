import { expect, test, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import pizzaRecipes from "../dummies";

//Unit tests
test("renders App component", () => {
	render(<App />);
	const brandElement = screen.getByText(/Recipe App/i);
	expect(brandElement).toBeInTheDocument();
});

test("search form works correctly", () => {
	render(<App />);
	const searchInput = screen.getByPlaceholderText(/Search Your Recipe.../i) as HTMLInputElement;
	fireEvent.change(searchInput, { target: { value: "Pizza" } });
	expect(searchInput.value).toBe("Pizza");
});

// Integration Tests
// vi.mock("global.fetch", () => {
// 	return vi.fn(() => {
// 		return new Promise((resolve) => {
// 			resolve({
// 				json: () => Promise.resolve({ hits: pizzaRecipes.map((recipe) => ({ recipe })) }),
// 			});
// 		});
// 	});
// });

// test("searches and displays recipes on form submission (Enter key press)", async () => {
// 	render(<App />);
// 	const searchInput = screen.getByPlaceholderText(/Search Your Recipe.../i) as HTMLInputElement;

// 	// Change the search input value and press Enter key to submit the form
// 	act(() => {
// 		fireEvent.change(searchInput, { target: { value: "Pizza" } });
// 		fireEvent.keyPress(searchInput, { key: "Enter", code: 13, charCode: 13 });
// 	});
// 	// Wait for the API request to complete and recipes to be displayed
// 	await waitFor(
// 		() => {
// 			const recipeCards = screen.queryAllByRole("button");
// 			expect(recipeCards.length).toBeGreaterThan(0);
// 		},
// 		{ timeout: 5000 }
// 	);
// });
