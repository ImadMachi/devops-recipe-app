import { useEffect, useState } from "react";
import Card from "./components/Card";
import "./App.css";
import { Heart, LogOut, UserIcon } from "lucide-react";
import Favorites from "./components/Favorites";
import { Recipe, User } from "./types";
import Modal from "react-modal";
import LoginModalContent from "./components/LoginModalContent";
import SignupModalContent from "./components/SignupModalContent";
import ProfileModalContent from "./components/ProfileModalContent";

const APP_ID = "286f21ea";
const APP_key = "40214e71fce6fcc938c0a03780d19e8b";

function App() {
	const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showSignupModal, setShowSignupModal] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);

	const [user, setUser] = useState<User | null>(null);

	const modalStyles = {
		content: {
			maxWidth: "600px",
			margin: "auto",
			height: "400px",
			backgroundColor: "rgb(26, 26, 27)",
		},
	};

	useEffect(() => {
		const storedUser = localStorage.getItem("recipe-app-user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}

		const data = (
			localStorage.getItem("favoriteRecipes") ? JSON.parse(localStorage.getItem("favoriteRecipes") || "") : []
		) as Recipe[];
		setFavoriteRecipes(data);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=20`;
		const response = await fetch(baseURL);
		const data = await response.json();
		setRecipes(data.hits);
	};

	const handleFavoritesOpen = () => {
		const favoritesContainer = document.querySelector(".favorites-container");
		if (favoritesContainer) {
			favoritesContainer.classList.add("active");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("recipe-app-user");
		setUser(null);
	};

	return (
		<div>
			<nav className="nav">
				{!!user ? (
					<>
						<div className="favorite-box" onClick={handleFavoritesOpen} style={{ marginRight: 10 }}>
							<Heart color="red" size={40} />
							<span className="favorite__text">Favorites</span>
						</div>
						<div className="favorite-box" onClick={handleLogout} style={{ marginRight: 10 }}>
							<LogOut color="white" size={40} />
							<span className="favorite__text">Logout</span>
						</div>
						<div className="favorite-box" onClick={() => setShowProfileModal(true)}>
							<UserIcon color="white" size={40} />
							<span className="favorite__text">Profile</span>
						</div>
					</>
				) : (
					<>
						<div className="favorite-box" onClick={() => setShowLoginModal(true)} style={{ marginRight: 15 }}>
							<span className="favorite__text" style={{ fontSize: 24 }}>
								Login
							</span>
						</div>
						<div className="favorite-box" onClick={() => setShowSignupModal(true)} style={{ marginRight: 15 }}>
							<span className="favorite__text" style={{ fontSize: 24 }}>
								Sign Up
							</span>
						</div>
					</>
				)}
			</nav>
			<section>
				<div className="container initial">
					<h1 className="brand" data-testid="cypress-title">
						Recipe App
					</h1>
					<form onSubmit={handleSubmit}>
						<input type="text" placeholder="Search Your Recipe..." onChange={handleChange} />
					</form>
					<div className="search-result">
						{recipes.map(({ recipe }, i) => (
							<Card recipe={recipe} key={i} favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />
						))}
					</div>
				</div>
			</section>
			<Favorites favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />

			<Modal isOpen={showLoginModal} style={modalStyles} onRequestClose={() => setShowLoginModal(false)}>
				<LoginModalContent setShowLoginModal={setShowLoginModal} setUser={setUser} />
			</Modal>

			<Modal isOpen={showSignupModal} style={modalStyles} onRequestClose={() => setShowSignupModal(false)}>
				<SignupModalContent setShowSignupModal={setShowSignupModal} setUser={setUser} />
			</Modal>

			<Modal isOpen={showProfileModal} style={modalStyles} onRequestClose={() => setShowProfileModal(false)}>
				<ProfileModalContent setShowProfileModal={setShowProfileModal} setUser={setUser} user={user} />
			</Modal>
		</div>
	);
}

export default App;
