import { combineReducers } from '@reduxjs/toolkit';
import addReducer from './add';
import deleteReducer from './delete';
import changeReducer from './change';

export default combineReducers({
  add: addReducer,
  delete: deleteReducer,
  change: changeReducer,
});
