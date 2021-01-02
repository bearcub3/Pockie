import { API_URL } from '@env';
import { getRequestOption, handleResponse } from '../utils/helper';

export const userService = {
	getUser,
};

function getUser(user_id) {
	return fetch(`${API_URL}/api/user/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((user) => {
			return user;
		});
}
