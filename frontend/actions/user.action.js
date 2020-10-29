import { userConstants } from '../constants'
import { userService } from '../_services'

export const userActions = {
    register
}

function register(user) {
    return (dispatch) => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    }

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function login(email, password) {
    return (dispatch) => {
        dispatch(request({ email }));

        userService.login()
    }
}