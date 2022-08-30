import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteAnimal } from 'api';

export const deleteAnimalV2 = createAsyncThunk(
  'deleteAnimal',
  async (allChecked, { rejectWithValue }) => {
    try {
      const data = await deleteAnimal(allChecked);
      return { idDeletePerson: data };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
  },
);

export const deleteSlice = createSlice({
  name: 'delete',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAnimalV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAnimalV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnimalV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deleteSlice.reducer;
