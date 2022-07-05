import {
  LOAD_PEOPLE_FAILURE,
  LOAD_PEOPLE_STARTED,
  LOAD_PEOPLE_SUCCESS,
  SET_PEOPLE_PAGE_COUNT,
} from '../../constants/action-types';

export default function resultReducer(
  state = {
    data: [],
    pageCount: 0,
    loading: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case LOAD_PEOPLE_STARTED:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case LOAD_PEOPLE_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        loading: false,
      };
    case LOAD_PEOPLE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case SET_PEOPLE_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.payload.pageCount,
      };
    default: {
      return state;
    }
  }
}
