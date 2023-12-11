import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Recipe } from "../types";

interface CardProps {
	recipe: Recipe;
	favoriteRecipes: Recipe[];
	setFavoriteRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

export default function Card({ recipe, favoriteRecipes, setFavoriteRecipes }: CardProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const isMarkedFavorite = favoriteRecipes.find(({ label }) => label == recipe.label);
		if (isMarkedFavorite) {
			setIsFavorite(true);
		} else {
			setIsFavorite(false);
		}
	}, [favoriteRecipes, recipe]);

	const handleClick = () => {
		if (isFavorite) {
			const data = favoriteRecipes.filter(({ label }) => label != recipe.label);
			localStorage.setItem("favoriteRecipes", JSON.stringify(data));
			setFavoriteRecipes(data);
			setIsFavorite(false);
		} else {
			const data = [...favoriteRecipes, recipe];
			localStorage.setItem("favoriteRecipes", JSON.stringify(data));
			setFavoriteRecipes(data);
			setIsFavorite(true);
		}
	};
	return (
		<div className="item">
			<img src={`${recipe.image}`} alt="img" />
			<div className="margin-top-20 flex-container items-center">
				<button onClick={handleClick} className="card-favorate-button">
					<Heart data-testid="heart-icon" color="red" fill={isFavorite ? "red" : "rgb(37, 37, 37)"} size={30} />
				</button>
				<a className="view-btn" target="_blank" href={`${recipe.url}`}>
					View Recipe
				</a>
			</div>
			<h1 className="title">{recipe.label}</h1>
			<p className="item-data">Calories: {recipe.calories.toFixed(2)}</p>
			<p className="item-data">Diet label: {recipe.dietLabels.length > 0 ? recipe.dietLabels : "No Data Found"}</p>
			<p className="item-data">Dish type: {recipe.dishType.length > 0 ? recipe.dishType : "No Data Found"}</p>
			<p className="item-data">Cuisine type: {recipe.cuisineType.length > 0 ? recipe.cuisineType : "No Data Found"}</p>
		</div>
	);
}
