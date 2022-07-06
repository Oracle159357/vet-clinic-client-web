import { ADD_ANIMAL_FAILURE, ADD_ANIMAL_STARTED, ADD_ANIMAL_SUCCESS } from '../../../constants/action-types/animals';
import { addFromData2 } from '../../../../api';

const AddAnimalStarted = () => ({
  type: ADD_ANIMAL_STARTED,
});

const AddAnimalSuccess = () => ({
  type: ADD_ANIMAL_SUCCESS,
});

const AddAnimalFailure = (error) => ({
  type: ADD_ANIMAL_FAILURE,
  payload: {
    error,
  },
});

export const addAnimal = (animal) => async (dispatch) => {
  dispatch(AddAnimalStarted());
  const data = await addFromData2(animal);
  if (data?.errors) {
    dispatch(AddAnimalFailure(data.errors));
  }
  dispatch(AddAnimalSuccess());
  return data;
};

export default addAnimal;
