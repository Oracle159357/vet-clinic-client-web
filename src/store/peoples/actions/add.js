import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addFromData1 } from 'api';

export const addPeopleV2 = createAsyncThunk(
  'addPeople',
  async (people, { rejectWithValue }) => {
    const response = await addFromData1(people);
    if (response === undefined) {
      return undefined;
    }
    return rejectWithValue(response.errors);
  },
);

export const addSlice = createSlice({
  name: 'add',
  initialState: { loading: false, error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPeopleV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addPeopleV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPeopleV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addSlice.reducer;
