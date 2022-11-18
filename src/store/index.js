import { configureStore, combineReducers } from '@reduxjs/toolkit';

import peoplesReducer from './peoples';
import animalsReducer from './animals';
import usersReducer from './users';

const rootReducer = combineReducers({
  peoples: peoplesReducer,
  animals: animalsReducer,
  users: usersReducer,
});

export default configureStore({ reducer: rootReducer });
