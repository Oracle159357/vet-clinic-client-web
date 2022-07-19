import { createSlice } from '@reduxjs/toolkit';

export const checkedSlice = createSlice({
  name: 'checked',
  initialState: [],
  reducers: {
    setAnimalChecked: (state, action) => action.payload,
  },
});

export const { setAnimalChecked } = checkedSlice.actions;
export default checkedSlice.reducer;
