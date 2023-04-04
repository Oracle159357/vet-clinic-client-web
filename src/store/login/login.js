import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser } from 'api';

export const login = createAsyncThunk(
  'login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(username, password);

      localStorage.setItem('accessToken', data.token);

      return { token: data.token };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
  },
);

export const loginSlice = createSlice({
  name: 'login',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
