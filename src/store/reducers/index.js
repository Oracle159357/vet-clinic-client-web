import { combineReducers } from 'redux';

import peoplesReducer from './peoples';

const rootReducer = combineReducers({
  peoples: peoplesReducer,
});

export default rootReducer;
