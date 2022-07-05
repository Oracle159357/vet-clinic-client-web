import {
  ADD_PEOPLE_FAILURE,
  ADD_PEOPLE_STARTED,
  ADD_PEOPLE_SUCCESS,
} from '../../../constants/action-types';

export default function addReducer(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case ADD_PEOPLE_STARTED:
      return {
        error: null,
        loading: true,
      };
    case ADD_PEOPLE_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case ADD_PEOPLE_FAILURE:
      return {
        error: action.payload.error,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
