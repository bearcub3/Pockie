import { userConstants } from '../constants';
import { userService, financeService } from '../_services';

export const userActions = {
	getUserData
};

function getUserData(userid) {
	return (dispatch) => {
		dispatch(request());

		Promise.all([
			userService.getUser(userid),
			financeService.getToday(userid),
			financeService.getGoals(userid),
			financeService.getParticipants(userid),
			financeService.getSavings(userid),
			financeService.getWeekly(userid),
			financeService.getMonthly(userid),
			financeService.getExpensePattern(userid),
		]).then(
			(value) => {
				dispatch(
					success(
						value[0].users,
						value[1],
						value[2].goals,
						value[3].participants,
						value[4].result,
						value[5],
						value[6],
						value[7]
					)
				);
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function request() {
		return { type: userConstants.LOGIN_REQUEST, loadingState: true };
	}
	function success(
		user,
		today,
		goals,
		participants,
		savings,
		weekly,
		monthly,
		pattern
	) {
		return {
			type: userConstants.LOGIN_SUCCESS,
			user,
			today,
			goals,
			participants,
			savings,
			weekly,
			monthly,
			pattern,
			loadingState: false,
		};
	}
	function failure(error) {
		return {
			type: userConstants.LOGIN_FAILURE,
			error,
			loadingState: false,
		};
	}
}
