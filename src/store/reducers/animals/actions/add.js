import {
  ADD_ANIMAL_FAILURE,
  ADD_ANIMAL_STARTED,
  ADD_ANIMAL_SUCCESS,
} from '../../../constants/action-types/animals';

export default function addReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case ADD_ANIMAL_STARTED:
      return {
        error: null,
        loading: true,
      };
    case ADD_ANIMAL_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case ADD_ANIMAL_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
