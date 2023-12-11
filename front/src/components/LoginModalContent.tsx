import { useState } from "react";
import axios from "axios";
import { User } from "../types";

export default function LoginModalContent({
	setShowLoginModal,
	setUser,
}: {
	setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
	const [loginData, setLoginData] = useState({ email: "", password: "" });
	const [errorText, setErrorText] = useState("");

	const handleLogin = async () => {
		try {
			const response = await axios.post("http://localhost:3000/login", {
				email: loginData.email,
				password: loginData.password,
			});

			if (response.status === 200) {
				const email = response.data.user.email;
				const name = response.data.user.name;
				setUser({ email, name });
				localStorage.setItem("recipe-app-user", JSON.stringify({ email, name }));
				setShowLoginModal(false);
			}
		} catch (error: unknown) {
			// @ts-ignore
			if (error.response && error.response.status === 401) {
				setErrorText("Invalid email or password");
			} else {
				setErrorText("An unknown error occurred");
			}
		}
	};
	return (
		<>
			<h2 style={{ color: "white", fontSize: 24, textAlign: "center" }}>Login</h2>
			<form style={{ backgroundColor: "rgb(26, 26, 27)" }}>
				<input
					type="email"
					placeholder="Email"
					value={loginData.email}
					onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={loginData.password}
					onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<button type="button" onClick={handleLogin} style={{ width: "100%", padding: 10, fontSize: 18 }}>
					Login
				</button>
				<p style={{ fontSize: 14, color: "red" }}>{errorText}</p>
			</form>
		</>
	);
}
