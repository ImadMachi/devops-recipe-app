import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types";

export default function ProfileModalContent({
	setShowProfileModal,
	setUser,
	user,
}: {
	setShowProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	user: User;
}) {
	const [profileData, setProfileData] = useState({ name: "", email: "", password: "" });
	const [errorText, setErrorText] = useState("");

	useEffect(() => {
		setProfileData({ name: user.name, email: user.email, password: "" });
	}, []);

	const handleProfile = async () => {
		try {
			const response = await axios.put(`http://localhost:3000/profile/${user.email}`, {
				name: profileData.name,
				email: profileData.email,
				password: profileData.password,
			});

			if (response.status === 200) {
				const email = profileData.email;
				const name = profileData.name;
				setUser({ email, name });
				localStorage.setItem("recipe-app-user", JSON.stringify({ email, name }));
				setShowProfileModal(false);
			}
		} catch (error: unknown) {
			console.log(error);

			setErrorText("An unknown error occurred");
		}
	};
	return (
		<>
			<h2 style={{ color: "white", fontSize: 24, textAlign: "center" }}>Profile</h2>
			<form style={{ backgroundColor: "rgb(26, 26, 27)" }}>
				<input
					type="text"
					placeholder="Name"
					value={profileData.name}
					onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<input
					type="email"
					placeholder="Email"
					value={profileData.email}
					onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={profileData.password}
					onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
					style={{ marginBottom: 10, width: "100%" }}
				/>
				<button type="button" onClick={handleProfile} style={{ width: "100%", padding: 10, fontSize: 18 }}>
					Update
				</button>
				<p style={{ fontSize: 14, color: "red" }}>{errorText}</p>
			</form>
		</>
	);
}
