import { API_URL } from '@env';
import { getRequestOption, handleResponse } from '../utils/helper';

export const userService = {
	getUser,
	getUserProfilePicture,
};

function getUser(user_id) {
	return fetch(`${API_URL}/api/user/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((user) => {
			return user;
		});
}

function getUserProfilePicture(user_id) {
	return fetch(`${API_URL}/api/user/image/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((picture) => {
			return picture;
		});
}
