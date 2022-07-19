import { configureStore, combineReducers } from '@reduxjs/toolkit';

import peoplesReducer from './peoples';
import animalsReducer from './animals';

const rootReducer = combineReducers({
  peoples: peoplesReducer,
  animals: animalsReducer,
});

export default configureStore({ reducer: rootReducer });
