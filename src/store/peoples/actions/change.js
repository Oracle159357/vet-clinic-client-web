import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changeFromData1 } from 'api';

export const changePeopleV2 = createAsyncThunk(
  'changePeople',
  async (people, { rejectWithValue }) => {
    const response = await changeFromData1(people);
    if (response === undefined) {
      return undefined;
    }
    return rejectWithValue(response.errors);
  },
);

export const changeSlice = createSlice({
  name: 'change',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePeopleV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePeopleV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePeopleV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changeSlice.reducer;
