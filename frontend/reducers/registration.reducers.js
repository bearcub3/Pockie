import { userConstants } from '../constants'

export function registration(state = {}, action) {
    switch (action.type) {
      case userConstants.REGISTER_REQUEST:
        return { registering: true };
      case userConstants.REGISTER_SUCCESS:
        return { submitted: true };
      case userConstants.REGISTER_FAILURE:
        return { submitted: false };
      default:
        return state
    }
  }