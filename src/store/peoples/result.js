import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPeople } from 'api';
import { setPeopleOptions } from './options';

const initialState = {
  data: [],
  pageCount: 0,
  loading: false,
  error: null,
};

export const loadPeopleV2 = createAsyncThunk(
  'loadPeople',
  async (_, { getState, rejectWithValue }) => {
    const {
      pageSize,
      pageIndex,
      sortBy,
      filters,
    } = getState().peoples.options;
    try {
      const data = await getPeople(
        {
          paging: { page: pageIndex, size: pageSize },
          sorting: sortBy,
          filters,
        },
      );
      const pageCount = Math.ceil(data.dataLength / pageSize);
      return { data: data.resultData, pageCount };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
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
