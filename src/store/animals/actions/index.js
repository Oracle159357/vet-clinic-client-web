import { combineReducers } from '@reduxjs/toolkit';
import addReducer from './add';
import changeReducer from './change';
import deleteReducer from './delete';

export default combineReducers({
  add: addReducer,
  change: changeReducer,
  delete: deleteReducer,
});
