import { SET_ANIMAL_OPTIONS } from '../../constants/action-types/animals';

export default function optionsReducer(state = { }, action) {
  if (action.type === SET_ANIMAL_OPTIONS) {
    return action.payload.options;
  }
  return state;
}
