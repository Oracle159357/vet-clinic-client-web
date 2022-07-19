import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData2 } from 'api';
import { setAnimalOptions } from './options';

const initialState = {
  data: [],
  pageCount: 0,
  loading: false,
  error: null,
};

export const loadAnimal = createAsyncThunk(
  'loadAnimal',
  async (_, { getState }) => {
    const {
      pageSize,
      pageIndex,
      sortBy,
      filters,
    } = getState().animals.options;
    const data = await getData2({
      paging: { page: pageIndex, size: pageSize }, sorting: sortBy, filters,
    });
    const pageCount = Math.ceil(data.dataLength / pageSize);
    return { data: data.resultData, pageCount };
  },
);

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loadAnimal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(loadAnimal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAnimal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const setAnimalOptionsAndLoad = createAsyncThunk(
  'setAnimalOptionsAndLoad',
  async (options, { dispatch }) => {
    dispatch(setAnimalOptions(options));
    await dispatch(loadAnimal());
  },
);

export default resultSlice.reducer;
