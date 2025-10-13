import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const SignInUser = async (userEmail: string, userPassword: string) => {
	try {
		const response = await axios.post(
			`${API_URL}/api/v1/auth/login`,
			{
				email: userEmail,
				password: userPassword,
			},
			{
				withCredentials: false,
			}
		);

		const { user, token, message } = response.data;

		const userData = {
			...user,
			token,
		};

		localStorage.setItem("user", JSON.stringify(userData));

		return {
			user,
			token,
			message,
		};
	} catch (e) {
		console.error("SignInUser failed:", e);
		throw e;
	}
};

export const SignUpUser = async (data: {
	username: string;
	email: string;
	password: string;
	phone_number?: string;
}) => {
	try {
		const response = await axios.post(
			`${API_URL}/api/v1/auth/register`,
			data
		);
		return response.data;
	} catch (e) {
		console.error(e);
		throw e;
	}
};
