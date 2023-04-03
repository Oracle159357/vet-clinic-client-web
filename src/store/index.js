import { configureStore, combineReducers } from '@reduxjs/toolkit';

import peoplesReducer from './peoples';
import animalsReducer from './animals';
import usersReducer from './users';
import loginReducer from './login/login';

const rootReducer = combineReducers({
  peoples: peoplesReducer,
  animals: animalsReducer,
  users: usersReducer,
  login: loginReducer,
});

export default configureStore({ reducer: rootReducer });
