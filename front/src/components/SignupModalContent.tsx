import { useState } from "react";
import axios from "axios";
import { User } from "../types";

export default function SignupModalContent({
	setShowSignupModal,
	setUser,
}: {
	setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
	const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
	const [errorText, setErrorText] = useState("");

	const handleSignup = async () => {
		try {
			const response = await axios.post("http://localhost:3000/signup", {
				name: signupData.name,
				email: signupData.email,
				password: signupData.password,
			});

			if (response.status === 201) {
				const email = response.data.user.email;
				const name = response.data.user.name;
				setUser({ email, name });
				localStorage.setItem("recipe-app-user", JSON.stringify({ email, name }));
				setShowSignupModal(false);
			}
		} catch (error: unknown) {
			// @ts-ignore
			if (error.response && error.response.status === 409) {
				setErrorText("User already exists");
			} else {
				console.log(error);
				setErrorText("An unknown error occurred");
			}
		}
	};
	return (
		<>
			<h2 style={{ color: "white", fontSize: 24, textAlign: "center" }}>Signup</h2>
			<form style={{ backgroundColor: "rgb(26, 26, 27)" }}>
				<input
					type="text"
					placeholder="Name"
					value={signupData.name}
					onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<input
					type="email"
					placeholder="Email"
					value={signupData.email}
					onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={signupData.password}
					onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<button type="button" onClick={handleSignup} style={{ width: "100%", padding: 10, fontSize: 18 }}>
					Signup
				</button>
				<p style={{ fontSize: 14, color: "red" }}>{errorText}</p>
			</form>
		</>
	);
}
