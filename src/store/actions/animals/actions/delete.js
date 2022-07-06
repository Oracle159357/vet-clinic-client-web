import { deleteFromData2ByIdsTableV2 } from 'api';
import { DELETE_ANIMAL_FAILURE, DELETE_ANIMAL_STARTED, DELETE_ANIMAL_SUCCESS } from 'store/constants/action-types/animals';

const DeleteAnimalStarted = () => ({
  type: DELETE_ANIMAL_STARTED,
});

const DeleteAnimalSuccess = () => ({
  type: DELETE_ANIMAL_SUCCESS,
});

const DeleteAnimalFailure = (error) => ({
  type: DELETE_ANIMAL_FAILURE,
  payload: {
    error,
  },
});

export const deleteAnimal = (allChecked) => async (dispatch) => {
  dispatch(DeleteAnimalStarted());
  const data = await deleteFromData2ByIdsTableV2(allChecked);
  if (data?.errors) {
    dispatch(DeleteAnimalFailure(data.errors));
  }
  dispatch(DeleteAnimalSuccess());
};

export default deleteAnimal;
