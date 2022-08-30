import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addNewAnimal } from 'api';

export const addAnimalV2 = createAsyncThunk(
  'addAnimal',
  async (animal, { rejectWithValue }) => {
    try {
      const data = await addNewAnimal(animal);
      return { idNewAnimal: data };
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
      .addCase(addAnimalV2.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addAnimalV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnimalV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addSlice.reducer;
