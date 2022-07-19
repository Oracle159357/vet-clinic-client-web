import { createSlice } from '@reduxjs/toolkit';

export const optionsSlice = createSlice({
  name: 'options',
  initialState: {},
  reducers: {
    setPeopleOptions: (state, action) => action.payload,
  },
});

export const { setPeopleOptions } = optionsSlice.actions;
export default optionsSlice.reducer;
