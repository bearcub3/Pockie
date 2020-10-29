import { combineReducers } from 'redux';
import { registration } from './registration.reducers'

const rootReducer = combineReducers({
    registration
});

export default rootReducer;