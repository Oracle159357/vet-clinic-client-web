import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addNewUser } from 'api';

export const addUserV2 = createAsyncThunk(
  'addUser',
  async (user, { rejectWithValue }) => {
    try {
      const data = await addNewUser(user);
      return { idNewUser: data };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
  },
);

export const addSlice = createSlice({
  name: 'add',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addUserV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addSlice.reducer;
