import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changeFromData2 } from 'api';

export const changeAnimal = createAsyncThunk(
  'changeAnimal',
  async (animal, { rejectWithValue }) => {
    const response = await changeFromData2(animal);
    if (response === undefined) {
      return undefined;
    }
    return rejectWithValue(response.errors);
  },
);

export const changeSlice = createSlice({
  name: 'change',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeAnimal.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changeSlice.reducer;
