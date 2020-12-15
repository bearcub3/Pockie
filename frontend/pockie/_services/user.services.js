import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userService = {
	register,
	login,
	logout,
	setUser,
};

function register(user) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user)
	};
	return fetch(`${API_URL}/api/user`, requestOptions).then(handleResponse);
}

function login(email, passworld) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password })
	};

	return fetch(`${API_URL}/api/login`, requestOptions)
		.then(handleResponse)
		.then((obj) => {
			let authenticated = JSON.parse(obj);
			const { success, user } = authenticated;

			if (success) {
				setUser(user);
				return user;
			} else if (!success) {
				throw new Error('No valid email or password');
			}
		});
}

function logout() {
	removeUser();
}

const setUser = async (value) => {
	try {
		await AsyncStorage.setItem('user', JSON.stringify(value));
	} catch (e) {
		console.log(e);
	}
};

const removeUser = async () => {
	try {
		await AsyncStorage.removeItem('user');
	} catch (e) {
		console.log(e);
	}
};

function handleResponse(response) {
	return response.text().then((data) => {
		//data && JSON.parse(data);

		if (!response.ok) {
			if (response.status === 401) {
				console.log(response.status);
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}
