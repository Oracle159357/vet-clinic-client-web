import {
  DELETE_ANIMAL_FAILURE,
  DELETE_ANIMAL_STARTED,
  DELETE_ANIMAL_SUCCESS,
} from '../../../constants/action-types/animals';

export default function deleteReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case DELETE_ANIMAL_STARTED:
      return {
        error: null,
        loading: true,
      };
    case DELETE_ANIMAL_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case DELETE_ANIMAL_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
