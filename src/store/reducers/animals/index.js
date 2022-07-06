import { combineReducers } from 'redux';
import resultReducer from './result';
import optionsReducer from './options';
import actionsReducer from './actions';
import checkedReducer from './checked';

const animalsReducer = combineReducers({
  result: resultReducer,
  actions: actionsReducer,
  checked: checkedReducer,
  options: optionsReducer,
});

export default animalsReducer;
