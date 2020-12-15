import { combineReducers } from 'redux';
import { registration } from './registration.reducers';
import { authentication } from './authentication.reducers';

const rootReducer = combineReducers({
    registration,
    authentication
});

export default rootReducer;