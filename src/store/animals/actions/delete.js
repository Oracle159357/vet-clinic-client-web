import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteFromData2ByIdsTableV2 } from 'api';

export const deleteAnimal = createAsyncThunk(
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
      .addCase(deleteAnimal.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deleteSlice.reducer;
