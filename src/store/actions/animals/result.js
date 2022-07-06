import { getData2 } from '../../../api';
import {
  LOAD_ANIMAL_FAILURE,
  LOAD_ANIMAL_STARTED,
  LOAD_ANIMAL_SUCCESS,
  SET_ANIMAL_PAGE_COUNT,
} from '../../constants/action-types/animals';
import { SetAnimalOptions } from './options';

export const LoadAnimalStarted = () => ({
  type: LOAD_ANIMAL_STARTED,
});

export const LoadAnimalSuccess = (loadData) => ({
  type: LOAD_ANIMAL_SUCCESS,
  payload: {
    data: loadData,
  },
});

export const LoadAnimalFailure = (error) => ({
  type: LOAD_ANIMAL_FAILURE,
  payload: {
    error,
  },
});

export const SetAnimalPageCount = (pageCount) => ({
  type: SET_ANIMAL_PAGE_COUNT,
  payload: {
    pageCount,
  },
});

export const loadAnimal = () => async (dispatch, getState) => {
  const {
    pageSize,
    pageIndex,
    sortBy,
    filters,
  } = getState().animals.options;
  dispatch(LoadAnimalStarted());
  const data = await getData2({
    paging: { page: pageIndex, size: pageSize }, sorting: sortBy, filters,
  });
  if (data.errors) {
    dispatch(LoadAnimalFailure(data.errors));
  }
  dispatch(SetAnimalPageCount(Math.ceil(data.dataLength / pageSize)));
  const formattedData = data.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  dispatch(LoadAnimalSuccess(formattedData));
};

export const setAnimalOptionsAndLoad = (options) => async (dispatch) => {
  dispatch(SetAnimalOptions(options));
  dispatch(loadAnimal());
};
