import { combineReducers } from '@reduxjs/toolkit';
import addReducer from './add';
import deactivateReducer from './deactivate';
import changeReducer from './change';

export default combineReducers({
  add: addReducer,
  deactivate: deactivateReducer,
  change: changeReducer,
});
