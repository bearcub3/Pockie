import { updateConstants } from '../constants';
import { financeService } from '../_services';

export const updateActions = {
	updateGoal,
	updateParticipant,
	updateToday,
	updateSaving,
	updateWeekly,
	updateMonthly
};

function updateGoal(id) {
	return (dispatch) => {
		Promise.all([
			financeService.getGoals(id),
			financeService.getSavings(id)
		]).then(
			(value) => {
				dispatch(success(value[0].goals, value[1].result));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(goals, savings) {
		return {
			type: updateConstants.UPDATE_GOALS,
			goals,
			savings,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.UPDATE_GOALS_FAILURE,
			error,
			loadingState: false
		};
	}
}

function updateParticipant(id) {
	return (dispatch) => {
		Promise.all([financeService.getParticipants(id)]).then(
			(value) => {
				dispatch(success(value[0].participants));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(participants) {
		return {
			type: updateConstants.ADD_SAVING_COMPANION,
			participants,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.ADD_SAVING_COMPANION_FAILURE,
			error,
			loadingState: false
		};
	}
}

function updateToday(userid) {
	return (dispatch) => {
		Promise.all([financeService.getToday(userid)]).then(
			(value) => {
				dispatch(success(value[0]));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(today) {
		return {
			type: updateConstants.UPDATE_TODAY,
			today,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.UPDATE_TODAY_FAILURE,
			error,
			loadingState: false
		};
	}
}

function updateSaving(userid) {
	return (dispatch) => {
		Promise.all([financeService.getSavings(userid)]).then(
			(value) => {
				dispatch(success(value[0].result));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(onlySaving) {
		return {
			type: updateConstants.UPDATE_SAVING,
			onlySaving,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.UPDATE_SAVING_FAILURE,
			error,
			loadingState: false
		};
	}
}

function updateWeekly(userid) {
	return (dispatch) => {
		Promise.all([financeService.getWeekly(userid)]).then(
			(value) => {
				dispatch(success(value[0]));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(weekly) {
		return {
			type: updateConstants.UPDATE_WEEKLY,
			weekly,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.UPDATE_WEEKLY_FAILURE,
			error,
			loadingState: false
		};
	}
}

function updateMonthly(userid) {
	return (dispatch) => {
		Promise.all([financeService.getMonthly(userid)]).then(
			(value) => {
				dispatch(success(value[0]));
			},
			(error) => {
				dispatch(failure(error.toString()));
			}
		);
	};

	function success(monthly) {
		return {
			type: updateConstants.UPDATE_MONTHLY,
			monthly,
			loadingState: false
		};
	}
	function failure(error) {
		return {
			type: updateConstants.UPDATE_MONTHLY_FAILURE,
			error,
			loadingState: false
		};
	}
}
// function updateUser(userid) {
// 	return (dispatch) => {
// 		dispatch(request());

// 		Promise.all([userService.getUser(userid)]).then(
// 			(value) => {
// 				dispatch(success(value[0].users));
// 			},
// 			(error) => {
// 				dispatch(failure(error.toString()));
// 			}
// 		);
// 	};

// 	function request() {
// 		return { type: updateConstants.UPDATE_REQUEST, loadingState: true };
// 	}
// 	function success(user) {
// 		return {
// 			type: updateConstants.UPDATE_SUCCESS,
// 			user,
// 			loadingState: false
// 		};
// 	}
// 	function failure(error) {
// 		return {
// 			type: updateConstants.UPDATE_FAILURE,
// 			error,
// 			loadingState: false
// 		};
// 	}
// }
