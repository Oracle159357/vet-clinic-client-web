import { SET_PEOPLE_CHECKED } from '../../constants/action-types/peoples';

export default function checkedReducer(state = [], action) {
  if (action.type === SET_PEOPLE_CHECKED) {
    return action.payload.checked;
  }
  return state;
}
