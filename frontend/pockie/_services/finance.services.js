import { API_URL } from '@env';
import { getRequestOption, handleResponse } from '../utils/helper';

export const financeService = {
	getToday,
	getGoals,
	getParticipants,
	getSavings,
	getWeekly,
	getMonthly,
};

function getToday(user_id) {
	return fetch(`${API_URL}/api/today/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((today) => {
			return today;
		});
}

function getGoals(user_id) {
	return fetch(`${API_URL}/api/goals/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((goals) => {
			return goals;
		});
}

function getParticipants(user_id) {
	return fetch(`${API_URL}/api/user/joint/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((participants) => {
			return participants;
		});
}

function getSavings(user_id) {
	return fetch(`${API_URL}/api/savings/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((savings) => {
			return savings;
		});
}

function getWeekly(user_id) {
	return fetch(`${API_URL}/api/weekly/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((weekly) => {
			return weekly;
		});
}

function getMonthly(user_id) {
	return fetch(`${API_URL}/api/monthly/${user_id}`, getRequestOption)
		.then(handleResponse)
		.then((monthly) => {
			return monthly;
		});
}
