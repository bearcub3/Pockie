import { userConstants } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUser = async () => {
    try {
        let user = await AsyncStorage.getItem('user');
        return user;
    } catch(e) {
        console.log(e);
    }
}

let user = getUser();

export function authentication(state = {}, action) {
    switch(action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            }
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            }
        case userConstants.LOGIN_FAILURE:
            return {
                logginIn: false,
                user: action.error
            };
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}