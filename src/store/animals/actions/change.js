import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateAnimal } from 'api';

export const changeAnimalV2 = createAsyncThunk(
  'changeAnimal',
  async (animal, { rejectWithValue }) => {
    try {
      const data = await updateAnimal(animal);
      return { idChangeAnimal: data };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
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
