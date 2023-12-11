import { X } from "lucide-react";
import FavoriteCard from "./FavoriteCard";
import { Recipe } from "../types";

interface FavoritesProps {
	favoriteRecipes: Recipe[];
	setFavoriteRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

export default function Favorites({ favoriteRecipes, setFavoriteRecipes }: FavoritesProps) {
	const handleFavoritesClose = () => {
		const favoritesContainer = document.querySelector(".favorites-container");
		if (favoritesContainer) {
			favoritesContainer.classList.remove("active");
		}
	};

	return (
		<div className="favorites-container">
			<h1 className="favorites-title">MY FAVORITES</h1>
			<div>
				{favoriteRecipes.map((favoriteRecipe) => (
					<FavoriteCard
						key={favoriteRecipe.label}
						recipe={favoriteRecipe}
						favoriteRecipes={favoriteRecipes}
						setFavoriteRecipes={setFavoriteRecipes}
					/>
				))}
			</div>
			<span className="favorites-close" onClick={handleFavoritesClose}>
				<X />
			</span>
		</div>
	);
}
