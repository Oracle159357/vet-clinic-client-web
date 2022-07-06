import { combineReducers } from 'redux';

import peoplesReducer from './peoples';
import animalsReducer from './animals';

const rootReducer = combineReducers({
  peoples: peoplesReducer,
  animals: animalsReducer,
});

export default rootReducer;
