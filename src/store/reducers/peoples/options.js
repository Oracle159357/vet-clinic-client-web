import { SET_PEOPLE_OPTIONS } from '../../constants/action-types/peoples';

export default function optionsReducer(state = { }, action) {
  if (action.type === SET_PEOPLE_OPTIONS) {
    return action.payload.options;
  }
  return state;
}
