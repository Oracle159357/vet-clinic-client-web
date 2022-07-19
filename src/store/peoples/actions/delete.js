import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteFromData1ByIdsTableV2 } from 'api';

export const deletePeopleV2 = createAsyncThunk(
  'deletePeople',
  async (allChecked, { rejectWithValue }) => {
    const response = await deleteFromData1ByIdsTableV2(allChecked);
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
      .addCase(deletePeopleV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePeopleV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePeopleV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deleteSlice.reducer;
