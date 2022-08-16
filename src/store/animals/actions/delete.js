import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteFromData2ByIdsTableV2 } from 'api';

export const deleteAnimalV2 = createAsyncThunk(
  'deleteAnimal',
  async (allChecked, { rejectWithValue }) => {
    const response = await deleteFromData2ByIdsTableV2(allChecked);
    if (response === undefined) {
      return undefined;
    }
    return rejectWithValue(response.errors);
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
