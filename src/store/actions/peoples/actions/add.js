import { ADD_PEOPLE_FAILURE, ADD_PEOPLE_STARTED, ADD_PEOPLE_SUCCESS } from '../../../constants/action-types';
import { addFromData1 } from '../../../../api';

const AddPeopleStarted = () => ({
  type: ADD_PEOPLE_STARTED,
});

const AddPeopleSuccess = () => ({
  type: ADD_PEOPLE_SUCCESS,
});

const AddPeopleFailure = (error) => ({
  type: ADD_PEOPLE_FAILURE,
  payload: {
    error,
  },
});

export const addPeople = (people) => async (dispatch) => {
  dispatch(AddPeopleStarted());
  const data = await addFromData1(people);
  if (data?.errors) {
    dispatch(AddPeopleFailure(data.errors));
  }
  dispatch(AddPeopleSuccess());
  return data;
};

export default addPeople;
