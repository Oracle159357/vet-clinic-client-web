import { combineReducers } from '@reduxjs/toolkit';
import resultReducer from './result';
import optionsReducer from './options';
import actionsReducer from './actions';
import checkedReducer from './checked';

const peoplesReducer = combineReducers({
  result: resultReducer,
  actions: actionsReducer,
  checked: checkedReducer,
  options: optionsReducer,
});

export default peoplesReducer;
