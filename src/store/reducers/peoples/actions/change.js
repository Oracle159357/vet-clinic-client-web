import {
  CHANGE_PEOPLE_FAILURE,
  CHANGE_PEOPLE_STARTED,
  CHANGE_PEOPLE_SUCCESS,
} from '../../../constants/action-types';

export default function changeReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case CHANGE_PEOPLE_STARTED:
      return {
        error: null,
        loading: true,
      };
    case CHANGE_PEOPLE_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case CHANGE_PEOPLE_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
