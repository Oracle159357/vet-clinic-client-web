import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deactivateUser } from 'api';

export const deactivateUserV2 = createAsyncThunk(
  'deactivateUser',
  async (allChecked, { rejectWithValue }) => {
    try {
      const data = await deactivateUser(allChecked);
      return { idDeactivateUser: data };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
  },
);

export const deactivateSlice = createSlice({
  name: 'deactivate',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(deactivateUserV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deactivateUserV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateUserV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deactivateSlice.reducer;
