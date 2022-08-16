import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changeFromData2 } from 'api';

export const changeAnimalV2 = createAsyncThunk(
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
      .addCase(changeAnimalV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeAnimalV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAnimalV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changeSlice.reducer;
