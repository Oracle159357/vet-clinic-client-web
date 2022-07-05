import {
  DELETE_PEOPLE_FAILURE,
  DELETE_PEOPLE_STARTED,
  DELETE_PEOPLE_SUCCESS,
} from '../../../constants/action-types';

export default function deleteReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case DELETE_PEOPLE_STARTED:
      return {
        error: null,
        loading: true,
      };
    case DELETE_PEOPLE_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case DELETE_PEOPLE_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
