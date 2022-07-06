import { CHANGE_ANIMAL_FAILURE, CHANGE_ANIMAL_STARTED, CHANGE_ANIMAL_SUCCESS } from '../../../constants/action-types/animals';
import { changeFromData2 } from '../../../../api';

const ChangeAnimalStarted = () => ({
  type: CHANGE_ANIMAL_STARTED,
});

const ChangeAnimalSuccess = () => ({
  type: CHANGE_ANIMAL_SUCCESS,
});

const ChangeAnimalFailure = (error) => ({
  type: CHANGE_ANIMAL_FAILURE,
  payload: {
    error,
  },
});

export const changeAnimal = (animal) => async (dispatch) => {
  dispatch(ChangeAnimalStarted());
  const data = await changeFromData2(animal);
  if (data?.errors) {
    dispatch(ChangeAnimalFailure(data.errors));
  }
  dispatch(ChangeAnimalSuccess());

  return data;
};

export default changeAnimal;
