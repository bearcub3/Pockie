import { userConstants } from '../constants';
import { userService, financeService } from '../_services';

export const userActions = {
	getUserData,
	updateUserProfilePicture
};

function updateUserProfilePicture(userid) {
	return (dispatch) => {
		dispatch(request());
		Promise.all([userService.getUserProfilePicture(userid)]).then(
			(value) => {
				dispatch(success(value[0]));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};
	function request() {
		return { type: userConstants.USER_PICTURE_REQUEST, loadingState: true };
	}
	function success(picture) {
		return {
			type: userConstants.USER_PICTURE_SUCCESS,
			picture,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: userConstants.USER_PICTURE_FAILURE,
			error,
			loadingState: false
		};
	}
}

function getUserData(userid) {
	return (dispatch) => {
		dispatch(request());

		Promise.all([
			userService.getUser(userid),
			userService.getUserProfilePicture(userid),
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
						value[2],
						value[3].goals,
						value[4].participants,
						value[5].result,
						value[6],
						value[7],
						value[8]
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
		picture,
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
			picture,
			today,
			goals,
			participants,
			savings,
			weekly,
			monthly,
			pattern,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: userConstants.LOGIN_FAILURE,
			error,
			loadingState: false
		};
	}
}
