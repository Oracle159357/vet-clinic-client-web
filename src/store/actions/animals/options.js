import { SET_ANIMAL_OPTIONS } from '../../constants/action-types/animals';

export const SetAnimalOptions = (options) => ({
  type: SET_ANIMAL_OPTIONS,
  payload: {
    options,
  },
});

export default SetAnimalOptions;
