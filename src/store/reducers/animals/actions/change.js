import {
  CHANGE_ANIMAL_FAILURE,
  CHANGE_ANIMAL_STARTED,
  CHANGE_ANIMAL_SUCCESS,
} from '../../../constants/action-types/animals';

export default function changeReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case CHANGE_ANIMAL_STARTED:
      return {
        error: null,
        loading: true,
      };
    case CHANGE_ANIMAL_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case CHANGE_ANIMAL_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
