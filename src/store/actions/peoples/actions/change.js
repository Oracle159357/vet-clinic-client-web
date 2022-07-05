import { CHANGE_PEOPLE_FAILURE, CHANGE_PEOPLE_STARTED, CHANGE_PEOPLE_SUCCESS } from '../../../constants/action-types';
import { changeFromData1 } from '../../../../api';

const ChangePeopleStarted = () => ({
  type: CHANGE_PEOPLE_STARTED,
});

const ChangePeopleSuccess = () => ({
  type: CHANGE_PEOPLE_SUCCESS,
});

const ChangePeopleFailure = (error) => ({
  type: CHANGE_PEOPLE_FAILURE,
  payload: {
    error,
  },
});

export const changePeople = (people) => async (dispatch) => {
  dispatch(ChangePeopleStarted());
  const data = await changeFromData1(people);
  if (data?.errors) {
    dispatch(ChangePeopleFailure(data.errors));
  }
  dispatch(ChangePeopleSuccess());

  return data;
};

export default changePeople;
