import { userConstants } from '../constants';
import { updateConstants } from '../constants';

const initialState = {
	user: {},
	today: null,
	goals: null,
	participants: null,
	savings: null,
	weekly: null,
	monthly: null,
	pattern: null,
	loadingState: false,
};

export function authentication(state = initialState, action) {
	switch (action.type) {
		case userConstants.LOGIN_REQUEST:
			return {
				...state,
				loadingState: action.loadingState,
				user: action.user,
				today: action.today,
				goals: action.goals,
				participants: action.participants,
				savings: action.savings,
				weekly: action.weekly,
				monthly: action.monthly,
				pattern: action.pattern,
			};
		case userConstants.LOGIN_SUCCESS:
			return {
				...state,
				loadingState: action.loadingState,
				user: action.user,
				today: action.today,
				goals: action.goals,
				participants: action.participants,
				savings: action.savings,
				weekly: action.weekly,
				monthly: action.monthly,
				pattern: action.pattern,
			};
		case userConstants.LOGIN_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		case updateConstants.UPDATE_GOALS:
			const { goals, savings } = action;
			return {
				...state,
				goals: [...goals],
				savings: [...savings]
			};
		case userConstants.UPDATE_GOALS_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		case updateConstants.ADD_SAVING_COMPANION:
			const { participants } = action;
			return {
				...state,
				participants: [...participants],
			};
		case updateConstants.ADD_SAVING_COMPANION_FAILURE:
			return {
				...state,
				loadingState: false,
				error: action.error
			};
		case updateConstants.UPDATE_TODAY:
			const { today } = action;
			return {
				...state,
				today: {
					...state.today,
					expenses: today.expenses,
					incomes: today.incomes
				}
			};
		case updateConstants.UPDATE_TODAY_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		case updateConstants.UPDATE_SAVING:
			const { onlySaving } = action;
			return {
				...state,
				savings: [...onlySaving]
			};
		case updateConstants.UPDATE_SAVING_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		case updateConstants.UPDATE_WEEKLY:
			const { weekly } = action;
			return {
				...state,
				weekly: weekly
			};
		case updateConstants.UPDATE_WEEKLY_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		case updateConstants.UPDATE_MONTHLY:
			const { monthly } = action;
			return {
				...state,
				monthly: monthly
			};
		case updateConstants.UPDATE_MONTHLY_FAILURE:
			return {
				...state,
				loadingState: action.loadingState,
				error: action.error
			};
		default:
			return state;
	}
}
