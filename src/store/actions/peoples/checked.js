import { SET_PEOPLE_CHECKED } from '../../constants/action-types';

export const SetPeopleChecked = (checked) => ({
  type: SET_PEOPLE_CHECKED,
  payload: {
    checked,
  },
});

export default SetPeopleChecked;
