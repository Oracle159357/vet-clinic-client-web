import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData1 } from 'api';
import { setPeopleOptions } from './options';

const initialState = {
  data: [],
  pageCount: 0,
  loading: false,
  error: null,
};

export const loadPeopleV2 = createAsyncThunk(
  'loadPeople',
  async (_, { getState }) => {
    const {
      pageSize,
      pageIndex,
      sortBy,
      filters,
    } = getState().peoples.options;
    const data = await getData1({
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
      .addCase(loadPeopleV2.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(loadPeopleV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPeopleV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const setPeopleOptionsAndLoad = createAsyncThunk(
  'setPeopleOptionsAndLoad',
  async (options, { dispatch }) => {
    dispatch(setPeopleOptions(options));
    dispatch(loadPeopleV2());
  },
);

export default resultSlice.reducer;
