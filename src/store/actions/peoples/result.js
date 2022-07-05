import { getData1 } from '../../../api';
import {
  LOAD_PEOPLE_FAILURE,
  LOAD_PEOPLE_STARTED,
  LOAD_PEOPLE_SUCCESS,
  SET_PEOPLE_PAGE_COUNT,
} from '../../constants/action-types';
import { SetPeopleOptions } from './options';

export const LoadPeopleStarted = () => ({
  type: LOAD_PEOPLE_STARTED,
});

export const LoadPeopleSuccess = (loadData) => ({
  type: LOAD_PEOPLE_SUCCESS,
  payload: {
    data: loadData,
  },
});

export const LoadPeopleFailure = (error) => ({
  type: LOAD_PEOPLE_FAILURE,
  payload: {
    error,
  },
});

export const SetPeoplePageCount = (pageCount) => ({
  type: SET_PEOPLE_PAGE_COUNT,
  payload: {
    pageCount,
  },
});

export const loadPeople = () => async (dispatch, getState) => {
  const {
    pageSize,
    pageIndex,
    sortBy,
    filters,
  } = getState().peoples.options;
  dispatch(LoadPeopleStarted());
  const data = await getData1({
    paging: { page: pageIndex, size: pageSize }, sorting: sortBy, filters,
  });
  if (data.errors) {
    dispatch(LoadPeopleFailure(data.errors));
  }
  dispatch(SetPeoplePageCount(Math.ceil(data.dataLength / pageSize)));
  const formattedData = data.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  dispatch(LoadPeopleSuccess(formattedData));
};

export const setPeopleOptionsAndLoad = (options) => async (dispatch) => {
  dispatch(SetPeopleOptions(options));
  dispatch(loadPeople());
};
