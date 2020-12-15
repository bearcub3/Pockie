import EncryptedStorage from 'react-native-encrypted-storage';

import Auth0 from 'react-native-auth0';
import { DOMAIN, CLIENT_ID } from '@env';

const auth0 = new Auth0({ domain: `${DOMAIN}`, clientId: `${CLIENT_ID}` });

export const setAccessToken = () => {
	try {
		auth0.webAuth
			.authorize({ scope: 'openid profile email' })
			.then((credentials) => async () =>
				await EncryptedStorage.setItem({
					accessToken: credentials.accessToken
				})
			)
			.catch((error) => console.log(error));
		return;
	} catch (e) {
		console.log(e);
	}
};

export const removeItem = async (key) => {
	try {
		await EncryptedStorage.removeItem(key);
	} catch (e) {
		console.log(e);
	}
};

export const getItem = async (key) => {
	let item = '';
	try {
		item = await EncryptedStorage.getItem(key);
	} catch (e) {
		console.log(e);
	}
	return item;
};
