import { createSlice } from '@reduxjs/toolkit';

export const checkedSlice = createSlice({
  name: 'checked',
  initialState: [],
  reducers: {
    setPeopleChecked: (state, action) => action.payload,
  },
});

export const { setPeopleChecked } = checkedSlice.actions;
export default checkedSlice.reducer;
