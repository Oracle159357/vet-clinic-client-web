import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deletePeople } from 'api';

export const deletePeopleV2 = createAsyncThunk(
  'deletePeople',
  async (allChecked, { rejectWithValue }) => {
    try {
      const data = await deletePeople(allChecked);
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
