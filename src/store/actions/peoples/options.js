import { SET_PEOPLE_OPTIONS } from '../../constants/action-types/peoples';

export const SetPeopleOptions = (options) => ({
  type: SET_PEOPLE_OPTIONS,
  payload: {
    options,
  },
});

export default SetPeopleOptions;
