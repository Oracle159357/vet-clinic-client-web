import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addFromData2 } from 'api';

export const addAnimal = createAsyncThunk(
  'addAnimal',
  async (animal, { rejectWithValue }) => {
    const response = await addFromData2(animal);
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
      .addCase(addAnimal.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addSlice.reducer;
