const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app"); // Import your Express app

jest.mock("mysql2", () => ({
	createPool: jest.fn(() => ({
		query: jest.fn((query, params, callback) => {
			if (query.includes("SELECT * FROM users WHERE email")) {
				callback(null, [{ email: params[0] }]);
			} else if (query.includes("INSERT INTO users")) {
				callback(null, { insertId: 1 });
			} else {
				callback(null, {});
			}
		}),
	})),
}));

describe("Signup Endpoint", () => {
	it("should create a new user", async () => {
		const newUser = {
			name: "John Doe",
			email: "john@example.com",
			password: "test123",
		};

		const res = await request(app).post("/signup").send(newUser);

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("message", "User created successfully");
		expect(res.body).toHaveProperty("user");
		expect(res.body.user).toHaveProperty("name", newUser.name);
		expect(res.body.user).toHaveProperty("email", newUser.email);
	});

	it("should return an error for an existing user", async () => {
		const existingUser = {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "password123",
		};

		const res = await request(app).post("/signup").send(existingUser);

		expect(res.statusCode).toEqual(409);
		expect(res.body).toHaveProperty("error", "User with this email already exists");
	});
});
