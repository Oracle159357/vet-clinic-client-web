import {
  LOAD_ANIMAL_FAILURE,
  LOAD_ANIMAL_STARTED,
  LOAD_ANIMAL_SUCCESS,
  SET_ANIMAL_PAGE_COUNT,
} from '../../constants/action-types/animals';

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
    case LOAD_ANIMAL_STARTED:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case LOAD_ANIMAL_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        loading: false,
      };
    case LOAD_ANIMAL_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case SET_ANIMAL_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.payload.pageCount,
      };
    default: {
      return state;
    }
  }
}
