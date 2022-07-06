import { SET_ANIMAL_CHECKED } from '../../constants/action-types/animals';

export default function checkedReducer(state = [], action) {
  if (action.type === SET_ANIMAL_CHECKED) {
    return action.payload.checked;
  }
  return state;
}
