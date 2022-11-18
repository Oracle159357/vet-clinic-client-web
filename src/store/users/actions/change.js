import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateUser } from 'api';

export const changeUserV2 = createAsyncThunk(
  'changeUser',
  async (user, { rejectWithValue }) => {
    try {
      const data = await updateUser(user);
      return { idChangeUser: data };
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
      .addCase(changeUserV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeUserV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changeSlice.reducer;
