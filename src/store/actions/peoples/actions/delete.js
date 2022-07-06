import { deleteFromData1ByIdsTableV2 } from 'api';
import { DELETE_PEOPLE_FAILURE, DELETE_PEOPLE_STARTED, DELETE_PEOPLE_SUCCESS } from 'store/constants/action-types/peoples';

const DeletePeopleStarted = () => ({
  type: DELETE_PEOPLE_STARTED,
});

const DeletePeopleSuccess = () => ({
  type: DELETE_PEOPLE_SUCCESS,
});

const DeletePeopleFailure = (error) => ({
  type: DELETE_PEOPLE_FAILURE,
  payload: {
    error,
  },
});

export const deletePeople = (allChecked) => async (dispatch) => {
  dispatch(DeletePeopleStarted());
  const data = await deleteFromData1ByIdsTableV2(allChecked);
  if (data?.errors) {
    dispatch(DeletePeopleFailure(data.errors));
  }
  dispatch(DeletePeopleSuccess());
};

export default deletePeople;
