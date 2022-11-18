import { createSlice } from '@reduxjs/toolkit';

export const optionsSlice = createSlice({
  name: 'options',
  initialState: {},
  reducers: {
    setUserOptions: (state, action) => action.payload,
  },
});

export const { setUserOptions } = optionsSlice.actions;
export default optionsSlice.reducer;
