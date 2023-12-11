const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const pool = mysql.createPool({
	host: "mysql",
	user: "root",
	password: "password",
	database: "auth_db",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

function init() {
	pool.query(
		"CREATE TABLE IF NOT EXISTS auth_db.users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))",
		(err) => {
			if (err) {
				console.error(err);
				res.status(500).json({ error: "Database error" });
				return;
			}
		}
	);
}

app.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;
	init();
	pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: "Error checking user" });
			return;
		}

		if (results.length > 0) {
			res.status(409).json({ error: "User with this email already exists" });
			return;
		}

		// Hash the password using bcrypt
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the user data into the database
		pool.query(
			"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
			[name, email, hashedPassword],
			(err, results) => {
				if (err) {
					console.error(err);
					res.status(500).json({ error: "Error creating user" });
					return;
				}
				res.status(201).json({ message: "User created successfully", user: { name, email } });
			}
		);
	});
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	init();
	pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: "Error retrieving user" });
			return;
		}

		if (results.length === 0) {
			res.status(401).json({ error: "User not found" });
			return;
		}

		const user = results[0];

		const match = await bcrypt.compare(password, user.password);

		if (match) {
			res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
		} else {
			res.status(401).json({ error: "Invalid password" });
		}
	});
});

app.get("/profile/:email", (req, res) => {
	const { email } = req.params;

	pool.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: "Error retrieving user profile" });
			return;
		}

		if (results.length === 0) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const user = results[0];
		res.status(200).json({ user: { name: user.name, email: user.email } });
	});
});

app.put("/profile/:email", async (req, res) => {
	const { email } = req.params;
	const { name, newPassword } = req.body;

	try {
		let hashedPassword;
		if (newPassword) {
			hashedPassword = await bcrypt.hash(newPassword, 10);
		}

		const updateValues = [];
		let updateQuery = "UPDATE users SET ";
		if (name) {
			updateQuery += "name = ?, ";
			updateValues.push(name);
		}
		if (hashedPassword) {
			updateQuery += "password = ?, ";
			updateValues.push(hashedPassword);
		}
		updateValues.push(email);
		updateQuery = updateQuery.slice(0, -2) + " WHERE email = ?";

		pool.query(updateQuery, updateValues, (err, results) => {
			if (err) {
				console.error(err);
				res.status(500).json({ error: "Error updating user profile" });
				return;
			}

			if (results.affectedRows === 0) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			res.status(200).json({ message: "User profile updated successfully"});
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error updating user profile" });
	}
});

app.get("/recipes", async (req, res) => {
	const { searchTerm } = req.query;

	const API_ID = "286f21ea";
	const API_KEY = "40214e71fce6fcc938c0a03780d19e8b";

	try {
		const response = await axios.get("https://api.edamam.com/search", {
			params: {
				q: searchTerm,
				app_id: API_ID,
				app_key: API_KEY,
			},
		});

		const recipes = response.data.hits.map((hit) => {
			const recipe = hit.recipe;
			return {
				label: recipe.label,
				image: recipe.image,
				url: recipe.url,
				calories: recipe.calories,
				dietLabels: recipe.dietLabels,
				cuisineType: recipe.cuisineType,
				dishType: recipe.dishType,
			};
		});

		res.status(200).json({ recipes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error fetching recipes from Edamam API" });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
