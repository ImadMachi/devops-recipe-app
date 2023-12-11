import { Heart } from "lucide-react";
import { Recipe } from "../types";
import { useEffect, useState } from "react";

interface FavoriteProps {
	recipe: Recipe;
	favoriteRecipes: Recipe[];
	setFavoriteRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}
export default function FavoriteCard({ recipe, favoriteRecipes, setFavoriteRecipes }: FavoriteProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const isMarkedFavorite = favoriteRecipes.find(({ label }) => label == recipe.label);
		if (isMarkedFavorite) {
			setIsFavorite(true);
		}
	}, []);

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
		<div className="fc-container">
			<img src={`${recipe.image}`} alt="img" className="fc-img" />
			<div className="fc-content-box">
				<h1 className="fc-title">{recipe.label}</h1>
				<button onClick={handleClick} className="card-favorate-button">
					<Heart color="red" fill={isFavorite ? "red" : "rgb(37, 37, 37)"} size={30} />
				</button>
			</div>
		</div>
	);
}
