import { createSlice } from '@reduxjs/toolkit';

export const optionsSlice = createSlice({
  name: 'options',
  initialState: {},
  reducers: {
    setAnimalOptions: (state, action) => action.payload,
  },
});

export const { setAnimalOptions } = optionsSlice.actions;
export default optionsSlice.reducer;
