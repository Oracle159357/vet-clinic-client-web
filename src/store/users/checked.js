import { createSlice } from '@reduxjs/toolkit';

export const checkedSlice = createSlice({
  name: 'checked',
  initialState: [],
  reducers: {
    setUserChecked: (state, action) => action.payload,
  },
});

export const { setUserChecked } = checkedSlice.actions;
export default checkedSlice.reducer;
