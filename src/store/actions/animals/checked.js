import { SET_ANIMAL_CHECKED } from '../../constants/action-types/animals';

export const SetAnimalChecked = (checked) => ({
  type: SET_ANIMAL_CHECKED,
  payload: {
    checked,
  },
});

export default SetAnimalChecked;
